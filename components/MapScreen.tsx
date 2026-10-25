"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TransitMap } from "./TransitMap";
import { CardPanel } from "./CardPanel";
import { map, routes, getCard, resolve } from "@/lib/data";
import { useProgress, useActiveRoute } from "@/lib/progress";

export function MapScreen({ initial, initialRoute }: { initial?: string; initialRoute?: string }) {
  const [selected, setSelected] = useState<string | null>(initial ?? null);
  const [focusLine, setFocusLine] = useState<string | null>(null);
  const { read, toggle, has } = useProgress();
  const { slug, setSlug } = useActiveRoute();
  useEffect(() => { if (initialRoute) setSlug(initialRoute); }, [initialRoute, setSlug]);
  useEffect(() => {
    const h = location.hash.replace("#", "");
    if (h && map.stations[resolve(h)]) setSelected(resolve(h));
  }, []);
  const route = slug ? routes.find((r) => r.slug === slug) : null;
  const card = selected ? getCard(selected) : null;

  return (
    <>
      <div className="linebar">
        {Object.entries(map.lines).map(([L, ln]) => {
          const active = focusLine === L;
          return (
            <button key={L} className={`linebtn d${active ? " active" : ""}`} style={active ? { background: `linear-gradient(90deg, ${ln.color}, ${ln.color}cc)` } : {}}
                    onClick={() => { setFocusLine(active ? null : L); }}>
              <span className="dot m" style={{ background: ln.color, color: active ? ln.color : "#fff" }}>{L}</span>{ln.name}
            </button>
          );
        })}
        {route ? (
          <button className="pill-y d" style={{ marginLeft: 14, display: "flex", gap: 8, alignItems: "center" }} onClick={() => setSlug(null)} title="Clear route">
            <span style={{ width: 14, height: 14, borderRadius: 7, border: "3px dashed #0E1116", boxSizing: "border-box" }} />
            Your route · {route.title} · {route.stops.filter((s) => has(resolve(s.code))).length} of {route.stops.length} ×
          </button>
        ) : (
          <Link href="/route" className="pill-y d" style={{ marginLeft: 14 }}>Plan a route</Link>
        )}
        <span className="m" style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>{focusLine ? "CLICK THE LINE AGAIN TO SHOW ALL" : "PICK A LINE OR A STATION"}</span>
      </div>
      <div className="hair" />
      <div className="shell">
        <TransitMap selected={selected} onSelect={(c) => { setSelected(c); history.replaceState(null, "", `#${c}`); }} focusLine={focusLine} read={read} routeCodes={route ? route.stops.map((s) => s.code) : []} />
        {card ? (
          <CardPanel card={card} read={has(card.code)} onToggleRead={() => toggle(card.code)} routeSlug={slug} onClose={() => setSelected(null)} />
        ) : (
          <aside className="panel panel-empty">
            <div className="empty">
              <div className="d" style={{ fontSize: 28, fontWeight: 800, color: "var(--ink)" }}>Pick a station</div>
              <p>Each line is a learning path. Stations are lessons. Zones run left to right from first paycheck to expert topics, so you can start anywhere and know how far in you are.</p>
              <ol>
                <li>Click a line to see only that path.</li>
                <li>Click a station for the card and the next stop.</li>
                <li>Dashed rings are interchanges: lessons on two lines. Dotted links are related stops.</li>
                <li>Plan a route and the map draws your reading order in yellow.</li>
              </ol>
              <p className="m" style={{ fontSize: 11 }}>{map.disclaimer.toUpperCase()}</p>
            </div>
          </aside>
        )}
        {!card && <div className="tap-hint m">TAP A STATION</div>}
      </div>
    </>
  );
}
