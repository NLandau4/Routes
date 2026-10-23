"use client";
import { useMemo, useState } from "react";
import { map, resolve } from "@/lib/data";
import { positions, railPath, MAP_W, MAP_H, zoneX } from "@/lib/layout";

type Props = {
  selected: string | null;
  onSelect: (code: string) => void;
  focusLine: string | null;
  read: string[];
  routeCodes?: string[];
};

export function TransitMap({ selected, onSelect, focusLine, read, routeCodes = [] }: Props) {
  const P = useMemo(() => positions(), []);
  const [scale, setScale] = useState(1);
  const letters = Object.keys(map.lines);
  const routeSet = new Set(routeCodes.map(resolve));
  const inRoute = (c: string) => routeSet.has(resolve(c));
  const dimLine = (L: string) => (focusLine ? L !== focusLine : routeCodes.length > 0);

  return (
    <div className="mapwrap" style={{ height: "calc(100vh - 64px - 54px)" }}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} width={MAP_W * scale} height={MAP_H * scale} role="img" aria-label="Routes system map">
        <defs>
          {letters.map((L) => (
            <linearGradient key={L} id={`g${L}`} x1="0" x2="1">
              <stop offset="0" stopColor={map.lines[L].color} stopOpacity="0.85" />
              <stop offset="1" stopColor={map.lines[L].color} />
            </linearGradient>
          ))}
          <linearGradient id="gZ" x1="0" x2="1"><stop offset="0" stopColor="#0E1116" /><stop offset="1" stopColor="#2A3341" /></linearGradient>
          <filter id="glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="7" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0E1116" floodOpacity=".22" /></filter>
        </defs>

        {map.zones.map((z) => {
          const x = zoneX(z.n);
          return (
            <g key={z.n}>
              {z.n > 1 && <line x1={x - 10} y1={60} x2={x - 10} y2={MAP_H - 20} stroke="#0E1116" strokeOpacity=".25" strokeWidth="1.5" strokeDasharray="2 8" strokeLinecap="round" />}
              <rect x={x} y={22} width={92} height={26} rx={13} fill="url(#gZ)" />
              <text x={x + 14} y={40} className="zone-text">ZONE {z.n}</text>
              <text x={x + 104} y={40} className="zone-sub">{z.name.toUpperCase()}</text>
            </g>
          );
        })}

        {map.connections.filter(([a, b]) => selected && [resolve(a), resolve(b)].includes(resolve(selected))).map(([a, b]) => {
          const pa = P[resolve(a)], pb = P[resolve(b)];
          return <line key={a + b} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} className="walk" />;
        })}

        {letters.map((L) => {
          const d = railPath(map.lines[L].stations);
          const dim = dimLine(L);
          return (
            <g key={L}>
              {focusLine === L && <path d={d} className="rail" stroke={map.lines[L].color} strokeOpacity=".35" strokeWidth="22" filter="url(#glow)" />}
              <path d={d} className={`rail${dim ? " dim" : ""}`} stroke={`url(#g${L})`} />
            </g>
          );
        })}

        {routeCodes.length > 1 && (
          <>
            <path d={railPath(routeCodes)} className="routeline-under" />
            <path d={railPath(routeCodes)} className="routeline" />
          </>
        )}

        {Object.values(map.stations).map((st) => {
          const p = P[st.code];
          const inter = st.lines.length > 1;
          const isSel = selected ? resolve(selected) === st.code : false;
          const dim = routeCodes.length ? !inRoute(st.code) && !isSel : focusLine ? !st.lines.includes(focusLine) : false;
          const color = map.lines[st.line].color;
          const labelAbove = letters.indexOf(st.line) % 2 === 0;
          const cls = ["station", inter ? "inter" : "", st.status === "planned" ? "planned" : "", read.includes(st.code) ? "read" : "", isSel ? "sel" : "", dim ? "dim" : ""].join(" ");
          const stepIdx = routeCodes.map(resolve).indexOf(st.code);
          return (
            <g key={st.code} className={cls} tabIndex={0} role="button" aria-label={`${st.code} ${st.title}`}
               onClick={() => onSelect(st.code)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(st.code); } }}>
              {isSel && <circle cx={p.x} cy={p.y} r={26} fill={color} opacity=".3" filter="url(#glow)" />}
              {inter && <circle cx={p.x} cy={p.y} r={14} fill="none" stroke={map.lines[st.lines[1]].color} strokeWidth="3" strokeDasharray="4 3" />}
              <circle className="dot" cx={p.x} cy={p.y} r={inter ? 10 : 8} />
              {!isSel && read.includes(st.code) && <circle className="fill" cx={p.x} cy={p.y} r={4} />}
              {stepIdx >= 0 && !isSel && <text x={p.x} y={p.y + 3.5} textAnchor="middle" fontSize="9" fontWeight="700" fill="#0E1116">{stepIdx + 1}</text>}
              <text x={p.x} y={labelAbove ? p.y - 18 : p.y + 30} textAnchor="middle">{st.title}</text>
              <text x={p.x} y={labelAbove ? p.y + 26 : p.y - 16} textAnchor="middle" className="code">{[st.code, ...st.also].join("·")}</text>
            </g>
          );
        })}
      </svg>
      <div className="maptools m">
        <button aria-label="Zoom in" onClick={() => setScale((s) => Math.min(2, s * 1.25))}>+</button>
        <button aria-label="Zoom out" onClick={() => setScale((s) => Math.max(0.4, s / 1.25))}>−</button>
        <button onClick={() => setScale(1)}>FIT</button>
      </div>
    </div>
  );
}
