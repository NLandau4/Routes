"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

/** One card a week. Inserts into the subscribers table; nothing else is collected. */
export function Subscribe({ source }: { source: string }) {
  const sb = supabase();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "dup" | "error">("idle");
  if (!sb) return null;
  const go = async (e: React.FormEvent) => {
    e.preventDefault(); setState("sending");
    const { error } = await sb.from("subscribers").insert({ email, source });
    setState(error ? (error.code === "23505" ? "dup" : "error") : "done");
  };
  if (state === "done" || state === "dup") return <p className="m" style={{ fontSize: 11, color: "var(--P)" }}>{state === "done" ? "YOU'RE ON THE LIST. ONE CARD A WEEK." : "YOU'RE ALREADY ON THE LIST."}</p>;
  return (
    <form onSubmit={go} className="subscribe" aria-label="Get one card a week by email">
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="One card a week · your email" aria-label="Email" />
      <button type="submit" className="d" disabled={state === "sending"}>{state === "sending" ? "…" : "JOIN"}</button>
      {state === "error" && <span className="m" style={{ fontSize: 11, color: "var(--D)" }}>DIDN'T WORK, TRY AGAIN</span>}
    </form>
  );
}
