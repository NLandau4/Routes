"use client";
import { useProgress } from "@/lib/progress";

export function YouCounter({ total }: { total: number }) {
  const { read } = useProgress();
  return <span className="you">YOU · <b>{String(read.length).padStart(2, "0")}</b>/{total} READ</span>;
}
