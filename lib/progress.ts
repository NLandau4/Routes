"use client";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

/** Read-progress and active route. Local first; synced to Supabase when signed in.
 *  On sign-in the browser's list and the account's list are merged (union), never overwritten. */
const KEY = "routes.read", ROUTE_KEY = "routes.route";

function loadLocal(): string[] { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } }
function saveLocal(v: string[]) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} }

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const sb = supabase(); if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  return session;
}

export function useProgress() {
  const [read, setRead] = useState<string[]>([]);
  const session = useSession();

  useEffect(() => { setRead(loadLocal()); }, []);

  // merge with the account on sign-in
  useEffect(() => {
    const sb = supabase(); if (!sb || !session) return;
    (async () => {
      const { data } = await sb.from("progress").select("code").eq("user_id", session.user.id);
      const remote = (data ?? []).map((r) => r.code as string);
      const merged = Array.from(new Set([...loadLocal(), ...remote]));
      setRead(merged); saveLocal(merged);
      const missing = merged.filter((c) => !remote.includes(c));
      if (missing.length) await sb.from("progress").upsert(missing.map((code) => ({ user_id: session.user.id, code })));
    })();
  }, [session]);

  const toggle = useCallback((code: string) => {
    setRead((prev) => {
      const next = prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code];
      saveLocal(next);
      const sb = supabase();
      if (sb && session) {
        if (next.includes(code)) sb.from("progress").upsert({ user_id: session.user.id, code }).then(() => {});
        else sb.from("progress").delete().eq("user_id", session.user.id).eq("code", code).then(() => {});
      }
      return next;
    });
  }, [session]);

  return { read, toggle, has: (c: string) => read.includes(c), session };
}

export function useActiveRoute() {
  const [slug, setSlugState] = useState<string | null>(null);
  const session = useSession();
  useEffect(() => { try { setSlugState(localStorage.getItem(ROUTE_KEY)); } catch {} }, []);
  useEffect(() => {
    const sb = supabase(); if (!sb || !session) return;
    sb.from("reader_state").select("active_route").eq("user_id", session.user.id).maybeSingle().then(({ data }) => {
      if (data?.active_route) { setSlugState(data.active_route); try { localStorage.setItem(ROUTE_KEY, data.active_route); } catch {} }
    });
  }, [session]);
  const setSlug = useCallback((s: string | null) => {
    setSlugState(s);
    try { s ? localStorage.setItem(ROUTE_KEY, s) : localStorage.removeItem(ROUTE_KEY); } catch {}
    const sb = supabase();
    if (sb && session) sb.from("reader_state").upsert({ user_id: session.user.id, active_route: s, updated_at: new Date().toISOString() }).then(() => {});
  }, [session]);
  return { slug, setSlug };
}
