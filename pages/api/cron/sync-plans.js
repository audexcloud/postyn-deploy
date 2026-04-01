import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

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

function generateTempPassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const segment = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `Postyn-${segment(4)}-${segment(4)}`;
}

async function createAccountAndNotify({ email, plan, supabase, resend }) {
  const tempPassword = generateTempPassword();
  const planLabel = plan === "base" ? "Base" : "Pro";
  const planLimit = plan === "base" ? "50 posts/month" : "150 posts/month";

  // Create the auth user with email already confirmed
  const { data: userData, error: createErr } = await supabase.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (createErr) {
    console.error(`Failed to create user for ${email}:`, createErr);
    return false;
  }

  const userId = userData.user.id;

  // Create their profile with the purchased plan
  const { error: profileErr } = await supabase.from("profiles").insert({
    id: userId,
    email,
    full_name: "",
    plan,
  });

  if (profileErr) {
    console.error(`Failed to create profile for ${email}:`, profileErr);
  }

  // Send welcome email with credentials
  const { error: emailErr } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Postyn <onboarding@resend.dev>",
    to: email,
    subject: "Your Postyn account is ready",
    html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#1C1917">
        <img src="https://app.postyn.ai/logo.png" alt="Postyn.ai" style="height:48px;margin-bottom:24px" />
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Welcome to Postyn</h1>
        <p style="font-size:15px;color:#78716C;margin:0 0 24px">Your <strong>${planLabel} Plan</strong> (${planLimit}) is active. We created an account for you using your purchase email.</p>
        <div style="background:#F5F5F4;border-radius:10px;padding:20px 24px;margin-bottom:24px">
          <div style="font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#A8A29E;margin-bottom:12px">Your login details</div>
          <div style="margin-bottom:8px"><span style="font-size:13px;color:#78716C">Email: </span><span style="font-size:13px;font-weight:600;color:#1C1917">${email}</span></div>
          <div><span style="font-size:13px;color:#78716C">Temporary password: </span><span style="font-size:15px;font-weight:700;color:#1C1917;letter-spacing:.04em">${tempPassword}</span></div>
        </div>
        <a href="https://app.postyn.ai" style="display:inline-block;background:#1C1917;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;margin-bottom:24px">Log in to Postyn →</a>
        <p style="font-size:13px;color:#A8A29E;margin:0">Please change your password after logging in. If you already have a Postyn account under a different email, contact us and we'll merge them.</p>
      </div>
    `,
  });

  if (emailErr) {
    console.error(`Failed to send email to ${email}:`, emailErr);
  }

  console.log(`Created new account for ${email} with plan '${plan}'`);
  return true;
}

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const sqspKey = process.env.SQUARESPACE_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: "Missing Supabase env vars" });
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  let upgraded = 0;
  let created = 0;

  // Downgrade any subscriptions whose billing period has expired (runs every tick)
  const { data: expired } = await supabase
    .from("profiles")
    .update({ plan: "free", plan_expires_at: null })
    .lt("plan_expires_at", new Date().toISOString())
    .neq("plan", "free")
    .select("email");

  if (expired?.length) {
    console.log(`Downgraded ${expired.length} expired subscription(s):`, expired.map(u => u.email));
  }

  // Sync new Squarespace orders (skip gracefully if API key not configured)
  if (sqspKey) {
    const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const sqspRes = await fetch(
      `https://api.squarespace.com/1.0/commerce/orders?modifiedAfter=${encodeURIComponent(since)}&fulfillmentStatus=FULFILLED`,
      { headers: { Authorization: `Bearer ${sqspKey}`, "Content-Type": "application/json" } }
    );

    if (!sqspRes.ok) {
      const err = await sqspRes.text();
      console.error("Squarespace API error:", err);
    } else {
      const { result: orders } = await sqspRes.json();
      if (orders?.length) {
        const resend = resendKey ? new Resend(resendKey) : null;
        for (const order of orders) {
          const email = order.customerEmail;
          const plan = getPlanFromLineItems(order.lineItems);
          if (!email || !plan) continue;

          const { data: updated, error: updateErr } = await supabase
            .from("profiles")
            .update({ plan })
            .eq("email", email)
            .select("id");

          if (updateErr) { console.error(`Failed to update ${email}:`, updateErr); continue; }

          if (updated && updated.length > 0) {
            console.log(`Upgraded ${email} → ${plan}`);
            upgraded++;
            if (resend) {
              const planLabel = plan === "base" ? "Base" : "Pro";
              const planLimit = plan === "base" ? "50 posts/month" : "150 posts/month";
              resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "Postyn <onboarding@resend.dev>",
                to: email,
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
              }).catch((e) => console.error(`Failed to send upgrade email to ${email}:`, e));
            }
          } else if (resend) {
            const ok = await createAccountAndNotify({ email, plan, supabase, resend });
            if (ok) created++;
          } else {
            console.warn(`No account found for ${email} and RESEND_API_KEY not set — skipping account creation`);
          }
        }
      }
    }
  }

  return res.status(200).json({ ok: true, upgraded, created, expired: expired?.length || 0 });
}
