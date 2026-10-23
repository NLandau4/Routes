import { map, resolve } from "./data";

/** Station positions for the transit map, derived from lines.json. Nothing is hand-placed. */
export const ZONE_X0 = 60, ROW_Y0 = 150, ROW_H = 112, STATION_W = 118;
/** Zone widths scale with the busiest line in that zone, so labels never collide. */
export const ZONE_WIDTHS: number[] = map.zones.map((z) => {
  let maxN = 2;
  for (const ln of Object.values(map.lines)) {
    const n = ln.stations.map(resolve).filter((c) => map.stations[c].zone === z.n).length;
    maxN = Math.max(maxN, n);
  }
  return Math.max(300, maxN * STATION_W);
});
export const zoneX = (n: number) => ZONE_X0 + ZONE_WIDTHS.slice(0, n - 1).reduce((a, b) => a + b, 0);
export const MAP_W = zoneX(map.zones.length + 1) + 40;
export const MAP_H = ROW_Y0 + ROW_H * (Object.keys(map.lines).length - 1) + 120;

export type Pos = { x: number; y: number };
const cache: Record<string, Pos> = {};

export function positions(): Record<string, Pos> {
  if (Object.keys(cache).length) return cache;
  const letters = Object.keys(map.lines);
  letters.forEach((L, row) => {
    const codes = map.lines[L].stations.map(resolve);
    const byZone: Record<number, string[]> = {};
    for (const c of codes) {
      const z = map.stations[c].zone;
      (byZone[z] ??= []).push(c);
    }
    for (const [z, list] of Object.entries(byZone)) {
      const x0 = zoneX(Number(z)), w = ZONE_WIDTHS[Number(z) - 1];
      list.forEach((c, i) => {
        const x = x0 + ((i + 0.5) * w) / list.length;
        const y = ROW_Y0 + row * ROW_H;
        // interchange: owned by its primary line; secondary lines detour to it
        if (map.stations[c].line === L || !cache[c]) cache[c] = { x, y };
      });
    }
  });
  // interchanges sit halfway between their two rows so both rails reach them cleanly
  for (const ic of map.interchanges) {
    const st = map.stations[ic.card];
    const rows = st.lines.map((l) => letters.indexOf(l));
    cache[ic.card] = { x: cache[ic.card].x, y: ROW_Y0 + ((Math.min(...rows) + Math.max(...rows)) / 2) * ROW_H };
  }
  return cache;
}

/** Rail path with 45° elbows between consecutive stations. */
export function railPath(codes: string[]): string {
  const P = positions();
  const pts = codes.map((c) => P[resolve(c)]);
  if (!pts.length) return "";
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const dy = b.y - a.y;
    if (Math.abs(dy) < 1) { d += ` L${b.x} ${b.y}`; continue; }
    const run = Math.abs(dy); // a 45° elbow covers `run` horizontally
    const dx = b.x - a.x;
    if (Math.abs(dx) <= run) { d += ` L${b.x} ${b.y}`; continue; }
    if (dx > 0) d += ` L${b.x - run} ${a.y} L${b.x} ${b.y}`;
    else d += ` L${a.x - run} ${b.y} L${b.x} ${b.y}`;
  }
  return d;
}
