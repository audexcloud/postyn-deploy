import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

export default function AuthConfirm() {
  const [status, setStatus] = useState("Confirming your account…");

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    async function confirm() {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get("token_hash");
      const type = params.get("type");
      const code = params.get("code");

      try {
        if (tokenHash && type) {
          // Standard email confirmation link (token_hash flow)
          const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
          if (error) throw error;
        } else if (code) {
          // PKCE flow
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          setStatus("Invalid confirmation link. Please request a new one.");
          return;
        }
        setStatus("Email confirmed! Redirecting…");
        window.location.href = "/";
      } catch (err) {
        setStatus("Confirmation failed: " + (err.message || "unknown error"));
      }
    }

    confirm();
  }, []);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      color: "#1C1917",
    }}>
      <img src="/logo.png" alt="Postyn" style={{ height: 40, marginBottom: 24 }} />
      <p style={{ fontSize: 15, color: "#78716C" }}>{status}</p>
    </div>
  );
}
