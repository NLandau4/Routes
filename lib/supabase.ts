"use client";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/** Browser client. Returns null when the env vars are absent, so the app still runs local-only. */
let client: SupabaseClient | null | undefined;
export function supabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  client = url && key ? createClient(url, key) : null;
  return client;
}
