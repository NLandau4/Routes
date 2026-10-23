"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/progress";

/** Magic-link sign-in. Email only; Routes never asks for anything else. */
export function AuthButton() {
  const sb = supabase();
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  if (!sb) return null;
  if (session) {
    return <button className="ghost-top m" onClick={() => sb.auth.signOut()} title={session.user.email ?? ""}>SIGNED IN · SIGN OUT</button>;
  }
  const send = async (e: React.FormEvent) => {
    e.preventDefault(); setState("sending");
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof location !== "undefined" ? location.origin : undefined } });
    setState(error ? "error" : "sent");
  };
  return (
    <>
      <button className="ghost-top m" onClick={() => setOpen((o) => !o)} aria-expanded={open}>SAVE PROGRESS</button>
      {open && (
        <form onSubmit={send} className="authpop" aria-label="Sign in by email">
          <div className="d" style={{ fontSize: 18, fontWeight: 800 }}>Save your progress</div>
          <p>We'll email you a link. No password, and we never ask for anything about your money.</p>
          {state === "sent" ? <p className="m" style={{ color: "var(--P)" }}>CHECK YOUR EMAIL FOR THE LINK.</p> : (
            <>
              <label htmlFor="auth-email" className="m" style={{ fontSize: 11 }}>EMAIL</label>
              <input id="auth-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              <button type="submit" className="pill-y d" disabled={state === "sending"}>{state === "sending" ? "SENDING…" : "SEND LINK"}</button>
              {state === "error" && <p className="m" style={{ color: "var(--D)", fontSize: 11 }}>THAT DIDN'T SEND. CHECK THE ADDRESS AND TRY AGAIN.</p>}
            </>
          )}
        </form>
      )}
    </>
  );
}
