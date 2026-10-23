"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, map, routes, resolve, getCard } from "@/lib/data";

type Props = {
  card: Card;
  read: boolean;
  onToggleRead: () => void;
  routeSlug?: string | null;
  onClose?: () => void;
};

export function CardPanel({ card, read, onToggleRead, routeSlug, onClose }: Props) {
  const [open, setOpen] = useState<number>(0);
  const [mode, setMode] = useState<"short" | "long">("short");
  const line = map.lines[card.line];
  const route = routeSlug ? routes.find((r) => r.slug === routeSlug) : null;
  const stopIdx = route ? route.stops.findIndex((s) => resolve(s.code) === card.code) : -1;
  const stop = stopIdx >= 0 ? route!.stops[stopIdx] : null;
  const nextStop = route && stopIdx >= 0 && stopIdx < route.stops.length - 1 ? route.stops[stopIdx + 1] : null;

  // next station on the primary line
  const seq = line.stations.map(resolve);
  const i = seq.indexOf(card.code);
  const nextOnLine = i >= 0 && i < seq.length - 1 ? getCard(seq[i + 1]) : null;
  const zone = map.zones[card.zone - 1];
  const longTotal = card.reading_minutes.long;

  return (
    <aside className="panel" aria-label={`${card.code} ${card.title}`}>
      {route && stop && (
        <div className="routestrip m">
          <span>YOUR ROUTE</span>
          <b className="d">{route.title}</b>
          <span style={{ opacity: .75 }}>{route.stops.map((s) => (resolve(s.code) === card.code ? <b key={s.code}>{s.code} </b> : <span key={s.code}>{s.code} · </span>))}</span>
          <span className="right">STOP {stopIdx + 1} OF {route.stops.length}</span>
        </div>
      )}
      <div className="cardhead" style={{ background: `linear-gradient(160deg, ${line.color} 0%, ${line.color} 38%, #0E1116 140%)` }}>
        <div className="glow" />
        <div className="meta m">
          <span className="roundel" style={{ color: line.color }}>{card.code}</span>
          <div className="lineinfo">
            <div>{line.name.toUpperCase()} LINE{card.also?.length ? ` · ALSO ${card.also.join(", ")}` : ""}</div>
            <div>ZONE {card.zone} · {zone.name.toUpperCase()} · {card.status === "written" ? "CARD WRITTEN" : "PLANNED"}</div>
          </div>
          <span className="mins">{card.reading_minutes.short ? `${card.reading_minutes.short} MIN` : "SOON"}{longTotal ? ` · ${longTotal} MIN LONG` : ""}</span>
        </div>
        <h1 className="d">{card.title}</h1>
        <p className="hook">{card.hook ?? card.summary}</p>
        {stop && <p className="why m">WHY THIS STOP: {stop.why}</p>}
        {onClose && <button onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 12, right: 12, border: 0, background: "rgba(0,0,0,.25)", color: "#fff", width: 32, height: 32, borderRadius: 16 }}>×</button>}
      </div>

      <div className="sections">
        {card.fields.map((f, idx) => {
          const isOpen = open === idx;
          const text = mode === "long" ? f.long : f.short;
          return (
            <div key={f.key}>
              {idx > 0 && <div className="hair" />}
              <div className={`sec${isOpen ? " open" : ""}`}>
                <button aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : idx)} className="d">
                  <span className="n m">{String(idx + 1).padStart(2, "0")}</span>
                  {f.label}
                  {f.key === "money" && <span className="tag m">THE POINT</span>}
                  <span className="pm m">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <>
                    <div className="toggle m">
                      <button className={mode === "short" ? "on" : ""} onClick={() => setMode("short")}>SHORT</button>
                      <button className={mode === "long" ? "on" : ""} onClick={() => setMode("long")} disabled={!f.long} title={f.long ? "" : "Long read not written yet"}>LONG READ{f.long ? "" : " · SOON"}</button>
                    </div>
                    <div className={`body${text ? "" : " planned"}`}>{text ?? (f.short ? "The long read for this section isn't written yet. The short version is above." : "This card is planned. The station is on the map so you know it's coming.")}</div>
                  </>
                )}
              </div>
            </div>
          );
        })}
        <div className="hair" />
        <div className="sec">
          <div className="d" style={{ fontSize: 17, fontWeight: 800, display: "flex", gap: 12 }}><span className="n m" style={{ fontSize: 12, color: "var(--muted)" }}>06</span>Connections</div>
          <div className="chips">
            {[...card.related, ...card.connects].map((c) => { const k = getCard(c); return k ? <Link key={c} href={`/card/${k.code}`} className="chip m" style={{ borderColor: map.lines[k.line].color }}>{c} {k.title}</Link> : null; })}
          </div>
        </div>
      </div>

      <div className="cardfoot">
        <div className="next m">
          <span>NEXT</span>
          {nextStop ? <Link href={`/card/${resolve(nextStop.code)}`}>{nextStop.code} {nextStop.title}</Link> : nextOnLine ? <Link href={`/card/${nextOnLine.code}`}>{nextOnLine.code} {nextOnLine.title}</Link> : <span>End of the line</span>}
          {card.also?.length > 0 && <span style={{ color: "rgba(255,255,255,.5)" }}>· change here for the {card.lines.filter((l) => l !== card.line).map((l) => map.lines[l].name).join(", ")} line</span>}
        </div>
        <div className="actions">
          <button className="pill-y d" style={{ flex: 1 }} onClick={onToggleRead}>{read ? `UNMARK ${card.code}` : `MARK ${card.code} READ`}</button>
          <Link href={`/card/${card.code}`} className="ghost d">OPEN</Link>
        </div>
        <div className="disc m">{card.disclaimer.toUpperCase()} · {card.pledge.toUpperCase()}</div>
      </div>
    </aside>
  );
}
