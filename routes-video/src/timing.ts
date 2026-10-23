// Timeline builder. Without a voice track, segment length is estimated from
// word count at a speaking pace. When ElevenLabs timestamps are available,
// replace `estimate` with real start/end seconds per segment and per word.

export type Card = {
  id: string;
  number: number;
  term: string;
  path: string;
  hook: string;
  fields: { key: string; label: string; text: string }[];
  outro: string;
};

export type Segment = {
  key: string;
  label: string | null;
  text: string;
  startFrame: number;
  endFrame: number;
  words: { word: string; startFrame: number }[];
};

export const FPS = 30;
const WORDS_PER_SEC = 2.7;
const PAUSE_SEC = 0.45;

const estimate = (text: string) => text.trim().split(/\s+/).length / WORDS_PER_SEC;

export const buildTimeline = (card: Card): Segment[] => {
  const segs: Segment[] = [];
  let t = 0.6; // lead-in

  const push = (key: string, label: string | null, text: string) => {
    const dur = estimate(text);
    const words = text.trim().split(/\s+/);
    const per = dur / words.length;
    segs.push({
      key,
      label,
      text,
      startFrame: Math.round(t * FPS),
      endFrame: Math.round((t + dur) * FPS),
      words: words.map((w, i) => ({ word: w, startFrame: Math.round((t + i * per) * FPS) })),
    });
    t += dur + PAUSE_SEC;
  };

  push("hook", null, card.hook);
  for (const f of card.fields) push(f.key, f.label, f.text);
  push("outro", null, card.outro);
  return segs;
};

export const totalFrames = (segs: Segment[]) => segs[segs.length - 1].endFrame + FPS;
