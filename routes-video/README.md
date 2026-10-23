# Plainmoney video pipeline

Card JSON in, 9:16 clip out. One template, every card.

## Run it

```bash
npm install
npm run preview                                   # Remotion Studio: scrub any card live
npm run render -- card-paycheck out/paycheck.mp4  # render one card
```

On a Mac, delete the `setBrowserExecutable` line in `remotion.config.ts`; Remotion downloads its own Chromium.

## Add a card

Append an object to `src/cards.json`. Fields: `id`, `number`, `term`, `path`, `hook`, five `fields` (`what`, `who`, `money`, `risks`, `questions`), `outro`. Each card becomes a composition named `card-<id>`.

The `money` field is the one the template treats differently: background shifts, label gets bigger. Keep it the sharpest line on the card.

## Wire in the voice (next step)

`src/timing.ts` estimates how long each segment takes from word count. When ElevenLabs returns a track with word timestamps, replace `estimate()` with the real start times per segment and per word, and add an `<Audio src={...} />` in `DecoderCard.tsx`. Captions and word reveals already key off `words[i].startFrame`, so nothing else changes.

## Brand

All colors live in the `C` object at the top of `src/DecoderCard.tsx`. Font is Inter with system fallback; to ship a specific face, load it with `@remotion/google-fonts` or a local `@font-face`.

## Length

Target under 60 s for Shorts/Reels. The estimate runs ~2.7 words/s; card 1 is ~160 words plus hook and outro, about 63 s unvoiced. Trim the longest field or speed the pace if a card runs long.
