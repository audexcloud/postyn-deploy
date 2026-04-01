import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, fullName } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return res.status(200).json({ ok: true, skipped: "email not configured" });
  }

  const resend = new Resend(resendKey);
  const firstName = fullName ? fullName.trim().split(" ")[0] : null;
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Postyn <onboarding@resend.dev>",
    to: email,
    subject: "Welcome to Postyn!",
    html: `
      <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;color:#1C1917">
        <img src="https://app.postyn.ai/logo.png" alt="Postyn.ai" style="height:48px;margin-bottom:24px" />
        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Welcome to Postyn!</h1>
        <p style="font-size:15px;color:#78716C;margin:0 0 24px">${greeting} You're all set up on the <strong>Free Plan</strong>. Start creating and optimizing your social media posts with AI.</p>
        <div style="background:#F5F5F4;border-radius:10px;padding:20px 24px;margin-bottom:24px">
          <div style="font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#A8A29E;margin-bottom:12px">What's included</div>
          <ul style="margin:0;padding:0 0 0 18px;color:#44403C;font-size:14px;line-height:1.8">
            <li>AI-powered post optimization</li>
            <li>LinkedIn, Twitter/X, Instagram &amp; more</li>
            <li>5 optimizations per month</li>
          </ul>
        </div>
        <a href="https://app.postyn.ai" style="display:inline-block;background:#1C1917;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;margin-bottom:24px">Start writing →</a>
        <p style="font-size:13px;color:#A8A29E;margin:0">Need more? Upgrade to Base or Pro anytime for higher limits and priority support.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Failed to send welcome email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }

  return res.status(200).json({ ok: true });
}
