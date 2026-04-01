import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

  // Send thank-you email for the upgrade
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const resend = new Resend(resendKey);
    const planLabel = plan === "base" ? "Base" : "Pro";
    const planLimit = plan === "base" ? "50 posts/month" : "150 posts/month";
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Postyn <onboarding@resend.dev>",
      to: customerEmail,
      subject: `Thank you for upgrading to Postyn ${planLabel}!`,
      html: `
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#1C1917">
          <img src="https://app.postyn.ai/logo.png" alt="Postyn.ai" style="height:48px;margin-bottom:24px" />
          <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Thank you for your purchase!</h1>
          <p style="font-size:15px;color:#78716C;margin:0 0 24px">Your account has been upgraded to the <strong>${planLabel} Plan</strong>. Your new limits are active right now.</p>
          <div style="background:#F5F5F4;border-radius:10px;padding:20px 24px;margin-bottom:24px">
            <div style="font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#A8A29E;margin-bottom:12px">${planLabel} Plan includes</div>
            <ul style="margin:0;padding:0 0 0 18px;color:#44403C;font-size:14px;line-height:1.8">
              <li>${planLimit} of AI-powered post optimization</li>
              <li>All platforms: LinkedIn, Twitter/X, Instagram &amp; more</li>
              ${plan === "pro" ? "<li>Priority support</li>" : ""}
            </ul>
          </div>
          <a href="https://app.postyn.ai" style="display:inline-block;background:#1C1917;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;margin-bottom:24px">Go to Postyn →</a>
          <p style="font-size:13px;color:#A8A29E;margin:0">Questions? Just reply to this email and we'll be happy to help.</p>
        </div>
      `,
    }).catch((e) => console.error("Failed to send upgrade email:", e));
  }

  return res.status(200).json({ ok: true, plan, email: customerEmail });
}

export const config = {
  api: { bodyParser: { sizeLimit: "1mb" } },
};
