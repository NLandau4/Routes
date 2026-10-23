import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { buildTimeline, Card, Segment } from "./timing";

// Brand tokens — swap once, every clip follows.
const C = {
  bg: "#0E1420",
  bgAccent: "#15241B",
  ink: "#F4F1EA",
  muted: "#8E97A8",
  accent: "#E9C46A",
  accentInk: "#0E1420",
  rule: "#263044",
};
const SHORT: Record<string, string> = { what: "What", who: "Who", money: "Money", risks: "Risks", questions: "Questions" };
const FONT = "'Inter', 'Helvetica Neue', Arial, sans-serif";

const ease = (f: number, from: number, to: number, a = 0, b = 1) =>
  interpolate(f, [from, to], [a, b], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const DecoderCard: React.FC<{ card: Card }> = ({ card }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const segs = buildTimeline(card);
  const current = segs.find((s) => frame >= s.startFrame - 8 && frame < s.endFrame + 12) ?? segs[0];
  const isMoney = current.key === "money";
  const isHook = current.key === "hook";
  const isOutro = current.key === "outro";

  // Background shifts to the accent-tinted tone on the "money" segment.
  const moneyMix = isMoney ? ease(frame, current.startFrame - 8, current.startFrame + 6) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT, color: C.ink }}>
      <AbsoluteFill style={{ backgroundColor: C.bgAccent, opacity: moneyMix }} />

      {/* Header */}
      <div style={{ position: "absolute", top: 110, left: 80, right: 80, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 30, letterSpacing: 6, fontWeight: 700, color: C.muted }}>ROUTES</div>
        <div style={{ fontSize: 30, color: C.muted }}>
          {card.path.toUpperCase()} · {String(card.number).padStart(2, "0")}
        </div>
      </div>

      {/* Term */}
      <Term term={card.term} frame={frame} fps={fps} small={!isHook} />

      {/* Progress chips for the five fields */}
      {!isHook && (
        <div style={{ position: "absolute", top: 500, left: 80, right: 80, display: "flex", gap: 16 }}>
          {card.fields.map((f) => {
            const seg = segs.find((s) => s.key === f.key)!;
            const done = frame >= seg.endFrame;
            const active = current.key === f.key;
            return (
              <div
                key={f.key}
                style={{
                  fontSize: 28,
                  padding: "12px 24px",
                  borderRadius: 999,
                  border: `2px solid ${active ? C.accent : done ? C.muted : C.rule}`,
                  color: active ? C.accentInk : done ? C.ink : C.muted,
                  backgroundColor: active ? C.accent : "transparent",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {SHORT[f.key] ?? f.label}
              </div>
            );
          })}
        </div>
      )}

      {/* Main panel: current field */}
      {!isHook && !isOutro && <FieldPanel seg={current} frame={frame} fps={fps} isMoney={isMoney} />}
      {isHook && <HookPanel seg={current} frame={frame} fps={fps} />}
      {isOutro && <OutroPanel seg={current} frame={frame} />}

      {/* Caption bar */}
      <Caption seg={current} frame={frame} />

      {/* Footer */}
      <div style={{ position: "absolute", bottom: 90, left: 80, right: 80, display: "flex", justifyContent: "space-between", fontSize: 24, color: C.muted }}>
        <span>No affiliate links. Ever.</span>
        <span>routes</span>
      </div>
    </AbsoluteFill>
  );
};

const Term: React.FC<{ term: string; frame: number; fps: number; small: boolean }> = ({ term, frame, fps, small }) => {
  const enter = spring({ frame, fps, config: { damping: 200 } });
  const y = interpolate(enter, [0, 1], [40, 0]);
  const size = small ? 72 : 140;
  const top = small ? 380 : 700;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 80,
        right: 80,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: -2,
        lineHeight: 1,
        opacity: enter,
        transform: `translateY(${y}px)`,
        transition: "none",
      }}
    >
      {term}
    </div>
  );
};

const HookPanel: React.FC<{ seg: Segment; frame: number; fps: number }> = ({ seg, frame, fps }) => {
  const o = ease(frame, seg.startFrame, seg.startFrame + 12);
  return (
    <div style={{ position: "absolute", top: 880, left: 80, right: 80, fontSize: 56, lineHeight: 1.25, fontWeight: 500, opacity: o, color: C.ink }}>
      {seg.text}
    </div>
  );
};

const FieldPanel: React.FC<{ seg: Segment; frame: number; fps: number; isMoney: boolean }> = ({ seg, frame, fps, isMoney }) => {
  const enter = spring({ frame: frame - seg.startFrame + 8, fps, config: { damping: 18, stiffness: 120 } });
  const x = interpolate(enter, [0, 1], [60, 0]);
  return (
    <div style={{ position: "absolute", top: 660, left: 80, right: 80, opacity: enter, transform: `translateX(${x}px)` }}>
      <div style={{ fontSize: isMoney ? 44 : 32, fontWeight: 800, color: C.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 26 }}>
        {seg.label}
      </div>
      <div style={{ height: 4, width: isMoney ? 240 : 120, backgroundColor: C.accent, marginBottom: 36 }} />
      <div style={{ fontSize: isMoney ? 60 : 54, lineHeight: 1.3, fontWeight: isMoney ? 600 : 400 }}>
        <Reveal seg={seg} frame={frame} />
      </div>
    </div>
  );
};

// Words appear as they are spoken; already-spoken text stays.
const Reveal: React.FC<{ seg: Segment; frame: number }> = ({ seg, frame }) => (
  <span>
    {seg.words.map((w, i) => {
      const o = ease(frame, w.startFrame - 2, w.startFrame + 4);
      return (
        <span key={i} style={{ opacity: o }}>
          {w.word}{" "}
        </span>
      );
    })}
  </span>
);

const OutroPanel: React.FC<{ seg: Segment; frame: number }> = ({ seg, frame }) => {
  const o = ease(frame, seg.startFrame, seg.startFrame + 10);
  return (
    <div style={{ position: "absolute", top: 760, left: 80, right: 80, opacity: o }}>
      <div style={{ fontSize: 40, color: C.muted, lineHeight: 1.4 }}>{seg.text}</div>
      <div style={{ fontSize: 60, fontWeight: 800, marginTop: 60 }}>Every money term. One place. Plain words.</div>
    </div>
  );
};

// Bottom caption: current sentence, word-by-word highlight, large for sound-off viewing.
const Caption: React.FC<{ seg: Segment; frame: number }> = ({ seg, frame }) => {
  const window = 7;
  const idx = Math.max(0, seg.words.findIndex((w, i) => frame < (seg.words[i + 1]?.startFrame ?? Infinity)));
  const start = Math.max(0, Math.min(idx - 2, seg.words.length - window));
  const slice = seg.words.slice(start, start + window);
  return (
    <div style={{ position: "absolute", bottom: 190, left: 60, right: 60, textAlign: "center" }}>
      <div style={{ display: "inline-block", padding: "18px 30px", borderRadius: 18, backgroundColor: "rgba(0,0,0,0.55)", fontSize: 44, fontWeight: 700, lineHeight: 1.25 }}>
        {slice.map((w, i) => {
          const abs = start + i;
          const spoken = abs <= idx;
          return (
            <span key={abs} style={{ color: abs === idx ? C.accent : spoken ? C.ink : C.muted }}>
              {w.word}{" "}
            </span>
          );
        })}
      </div>
    </div>
  );
};
