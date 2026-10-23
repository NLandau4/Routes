"use client";
import { useEffect, useState } from "react";

/** Read-progress and active route, per browser. Accounts (module 6) will sync this. */
const KEY = "routes.read", ROUTE_KEY = "routes.route";

function load(): string[] { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } }
function save(v: string[]) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch {} }

export function useProgress() {
  const [read, setRead] = useState<string[]>([]);
  useEffect(() => { setRead(load()); }, []);
  const toggle = (code: string) => {
    const next = read.includes(code) ? read.filter((c) => c !== code) : [...read, code];
    setRead(next); save(next);
  };
  return { read, toggle, has: (c: string) => read.includes(c) };
}

export function useActiveRoute() {
  const [slug, setSlugState] = useState<string | null>(null);
  useEffect(() => { try { setSlugState(localStorage.getItem(ROUTE_KEY)); } catch {} }, []);
  const setSlug = (s: string | null) => { setSlugState(s); try { s ? localStorage.setItem(ROUTE_KEY, s) : localStorage.removeItem(ROUTE_KEY); } catch {} };
  return { slug, setSlug };
}
