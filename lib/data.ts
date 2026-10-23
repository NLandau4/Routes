import cardsJson from "@/data/cards.json";
import mapJson from "@/data/map.json";
import routesJson from "@/data/routes.json";

export type Field = { key: string; label: string; short: string | null; long: string | null };
export type Card = {
  code: string; slug: string; title: string; line: string; lines: string[]; also: string[];
  zone: number; status: "written" | "planned" | "review"; summary: string; hook: string | null;
  related: string[]; connects: string[]; reading_minutes: { short: number | null; long: number | null };
  sources: { title: string; url: string; date: string }[]; updated: string; fields: Field[];
  disclaimer: string; pledge: string;
};
export type Line = { name: string; color: string; stations: string[] };
export type Zone = { n: number; name: string; tagline: string };
export type Station = { code: string; also: string[]; title: string; slug: string; line: string; lines: string[]; zone: number; status: string; summary: string };
export type MapData = { lines: Record<string, Line>; zones: Zone[]; stations: Record<string, Station>; interchanges: { card: string; codes: string[] }[]; connections: string[][]; disclaimer: string; pledge: string };
export type Route = { slug: string; title: string; for: string; stops: { code: string; why: string; title: string; status: string; line: string }[]; disclaimer: string };

export const cards = cardsJson as unknown as Record<string, Card>;
export const map = mapJson as unknown as MapData;
export const routes = routesJson as unknown as Route[];

/** Resolve an alias code (C5) to its card's primary code (P7). */
export function resolve(code: string): string {
  if (cards[code]) return code;
  const hit = Object.values(cards).find((c) => c.also?.includes(code));
  return hit ? hit.code : code;
}
export const getCard = (code: string) => cards[resolve(code)];
export const lineOf = (letter: string) => map.lines[letter];
export const writtenCount = () => Object.values(cards).filter((c) => c.status === "written").length;
export const LINE_LETTERS = Object.keys(map.lines);
