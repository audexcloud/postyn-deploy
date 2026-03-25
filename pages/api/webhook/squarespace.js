import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Map Squarespace product slugs/names to plan values
const PLAN_MAP = {
  "base-plan": "base",
  "pro-plan": "pro",
};

function getPlanFromOrder(order) {
  if (!order?.lineItems) return null;
  for (const item of order.lineItems) {
    // Check product URL slug or name
    const slug = item.productUrl?.split("/").pop()?.toLowerCase() || "";
    const name = (item.productName || "").toLowerCase();
    for (const [key, plan] of Object.entries(PLAN_MAP)) {
      if (slug.includes(key) || name.includes(key.replace("-", " "))) {
        return plan;
      }
    }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify Squarespace webhook signature
  const secret = process.env.SQUARESPACE_WEBHOOK_SECRET;
  if (secret) {
    const signature = req.headers["x-squarespace-signature"];
    const rawBody = JSON.stringify(req.body);
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");
    if (signature !== expected) {
      return res.status(401).json({ error: "Invalid signature" });
    }
  }

  const { topic, data } = req.body;

  // Only process completed orders
  if (topic !== "order.create" && topic !== "order.update") {
    return res.status(200).json({ ok: true, skipped: true });
  }

  const order = data;
  const customerEmail = order?.customerEmail;
  if (!customerEmail) {
    return res.status(200).json({ ok: true, skipped: "no email" });
  }

  const plan = getPlanFromOrder(order);
  if (!plan) {
    console.log("Unrecognized product in order:", order?.lineItems?.map(i => i.productName));
    return res.status(200).json({ ok: true, skipped: "unrecognized product" });
  }

  // Use service role key to bypass RLS and update the user's plan
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: "Supabase service key not configured" });
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // Find the user by email in auth.users, then update their profile
  const { data: users, error: userErr } = await supabase
    .from("profiles")
    .update({ plan })
    .eq("email", customerEmail)
    .select("id");

  if (userErr) {
    console.error("Failed to update plan:", userErr);
    return res.status(500).json({ error: "Database update failed" });
  }

  if (!users || users.length === 0) {
    console.log("No profile found for email:", customerEmail);
    return res.status(200).json({ ok: true, skipped: "user not found" });
  }

  console.log(`Updated plan to '${plan}' for ${customerEmail}`);
  return res.status(200).json({ ok: true, plan, email: customerEmail });
}

export const config = {
  api: { bodyParser: { sizeLimit: "1mb" } },
};
