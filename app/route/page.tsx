import Link from "next/link";
import { routes, map } from "@/lib/data";

export const metadata = { title: "Plan a route · Routes" };

export default function RoutesIndex() {
  return (
    <main className="page">
      <h1 className="d">Plan a route</h1>
      <p className="lead">A route is a reading order, not a plan. Pick the one that sounds like where you are, and the map draws your stops in yellow.</p>
      <ul className="stops">
        {routes.map((r) => (
          <li key={r.slug}>
            <Link href={`/route/${r.slug}`} className="stop">
              <span className="roundel m" style={{ background: "var(--yellow)", color: "var(--ink)" }}>{r.stops.length}</span>
              <span>
                <div className="t d">{r.title}</div>
                <div className="w">{r.for}</div>
                <div className="s m">{r.stops.map((s) => s.code).join(" · ")}</div>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="m" style={{ fontSize: 11, color: "var(--muted)", marginTop: 24 }}>{map.disclaimer.toUpperCase()}</p>
    </main>
  );
}
