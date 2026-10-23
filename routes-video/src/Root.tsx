import React from "react";
import { Composition } from "remotion";
import { DecoderCard } from "./DecoderCard";
import cards from "./cards.json";
import { buildTimeline, Card, FPS, totalFrames } from "./timing";

// One composition per card. Render any of them by id:
//   npx remotion render src/index.ts card-paycheck out/paycheck.mp4
export const Root: React.FC = () => (
  <>
    {(cards as Card[]).map((card) => (
      <Composition
        key={card.id}
        id={`card-${card.id}`}
        component={DecoderCard}
        durationInFrames={totalFrames(buildTimeline(card))}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{ card }}
      />
    ))}
  </>
);
