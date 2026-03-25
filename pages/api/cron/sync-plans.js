import { createClient } from "@supabase/supabase-js";

const PLAN_MAP = {
  "base-plan": "base",
  "pro-plan": "pro",
};

function getPlanFromLineItems(lineItems = []) {
  for (const item of lineItems) {
    const url = (item.productUrl || "").toLowerCase();
    const name = (item.productName || "").toLowerCase().replace(/\s+/g, "-");
    for (const [key, plan] of Object.entries(PLAN_MAP)) {
      if (url.includes(key) || name.includes(key)) return plan;
    }
  }
  return null;
}

export default async function handler(req, res) {
  // Verify this is called by Vercel Cron (or manually with the secret)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sqspKey = process.env.SQUARESPACE_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!sqspKey || !supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: "Missing env vars" });
  }

  // Fetch orders modified in the last 10 minutes (overlap prevents gaps between runs)
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const sqspRes = await fetch(
    `https://api.squarespace.com/1.0/commerce/orders?modifiedAfter=${encodeURIComponent(since)}&fulfillmentStatus=FULFILLED`,
    {
      headers: {
        Authorization: `Bearer ${sqspKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!sqspRes.ok) {
    const err = await sqspRes.text();
    console.error("Squarespace API error:", err);
    return res.status(500).json({ error: "Squarespace API failed" });
  }

  const { result: orders } = await sqspRes.json();

  if (!orders || orders.length === 0) {
    return res.status(200).json({ ok: true, processed: 0 });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  let processed = 0;

  for (const order of orders) {
    const email = order.customerEmail;
    const plan = getPlanFromLineItems(order.lineItems);

    if (!email || !plan) continue;

    const { error } = await supabase
      .from("profiles")
      .update({ plan })
      .eq("email", email);

    if (error) {
      console.error(`Failed to update ${email}:`, error);
    } else {
      console.log(`Updated ${email} → ${plan}`);
      processed++;
    }
  }

  return res.status(200).json({ ok: true, processed, total: orders.length });
}
