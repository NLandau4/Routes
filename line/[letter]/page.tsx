import Link from "next/link";
import { notFound } from "next/navigation";
import { map, getCard, LINE_LETTERS } from "@/lib/data";

export function generateStaticParams() { return LINE_LETTERS.map((letter) => ({ letter })); }
export async function generateMetadata({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  const l = map.lines[letter]; return { title: l ? `${l.name} line · Routes` : "Routes" };
}
export default async function LinePage({ params }: { params: Promise<{ letter: string }> }) {
  const { letter } = await params;
  const l = map.lines[letter];
  if (!l) notFound();
  return (
    <main className="page">
      <h1 className="d" style={{ color: l.color }}>{l.name} line</h1>
      <p className="lead">{l.stations.length} stations, in order. Zones run from basics to expert.</p>
      <ul className="stops">
        {l.stations.map((code) => {
          const c = getCard(code);
          return (
            <li key={code}>
              <Link href={`/card/${c.code}`} className="stop">
                <span className="roundel m" style={{ background: l.color }}>{code}</span>
                <span>
                  <div className="t d">{c.title}</div>
                  <div className="w">{c.summary}</div>
                  <div className="s m">ZONE {c.zone} · {c.status.toUpperCase()}{c.also?.length ? ` · ALSO ${c.also.join(", ")}` : ""}</div>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
