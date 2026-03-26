import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return res.status(401).json({ error: "Unauthorized" });

  // Expire at midnight on the first of next month
  const now = new Date();
  const expiresAt = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

  const { error } = await supabase
    .from("profiles")
    .update({ plan_expires_at: expiresAt })
    .eq("id", user.id);

  if (error) return res.status(500).json({ error: "Failed to cancel plan" });

  return res.status(200).json({ ok: true, expiresAt });
}
