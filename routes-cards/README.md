# routes-cards

The single source of truth for Routes. Every card, line, zone, and route lives here as plain files. The site, the map, the Medium articles, the videos, Explain This, and Routes all read from `dist/`, which is built from these files and nothing else.

```
cards/<LINE>/<CODE>-<slug>.md   one file per station (67)
routes/<slug>.json              curated routes (5)
lines.json                      lines, zones, interchanges, connections
scripts/validate.py             schema + reference checks + compliance lint
scripts/build.py                validate, then emit dist/
COMPLIANCE.md                   the rules every file follows
```

## Daily use

```bash
python3 scripts/validate.py   # must pass before anything is published
python3 scripts/build.py      # writes dist/cards.json, map.json, routes.json, video-cards.json
```

No dependencies beyond Python 3.9+.

## A card

```
---
code: P6                 # line letter + position on that line; the station's address
slug: overdraft
title: "Overdraft"
line: P                  # primary line (folder)
lines: [P]               # every line it sits on; interchanges list two
also: []                 # the other codes an interchange answers to, e.g. P7 also: [C5]
zone: 1                  # 1 Basics … 5 Expert
status: written          # written | review | planned
summary: "…"             # one sentence; the map label's tooltip and the planned-card stub
hook: "…"                # the first line of the video and the article; null until written
related: [P5, P7, D2]    # the Connections field
connects: []             # dotted links on the map (cross-line relationships)
reading_minutes: {short: 2, long: null}
sources: []              # [{title, url, date}] for every figure; warning if empty on a written card
updated: 2026-10-22
lint_allow: []           # exact phrases the lint may ignore on this card; see COMPLIANCE.md
---

## What it is
### Short
### Long
## Who ends up using it
…
## How it makes money off you
…
## What goes wrong
…
## What to ask
…
```

Five sections, each with a `### Short` and a `### Long`. `_Not yet written._` is the placeholder and builds as `null`. A card is `written` once all five shorts exist; the long reads can follow. The sixth field on the card UI, Connections, is `related` from the frontmatter.

## Station codes

Each line is a letter: P Paycheck & Taxes, C Cushion & Protection, D Debt, I Investing, T Trading, M Modern Money. A station's code is its letter and position, so P6 is the sixth stop on the Paycheck line. Interchanges have one file under their primary line and list their other codes in `also`; P7 (Emergency fund) is also C5. Codes are permanent once published, because people will use them as shorthand. Insert a new station at the end of a line, or give it a letter suffix (P6a) if it must sit between two.

## Routes

```json
{"slug": "first-paycheck", "title": "First Paycheck",
 "for": "You just started a job and the stub, the bank, and the fees are all new.",
 "stops": [{"code": "P1", "why": "The stub is the document everything else on this route refers to, so it comes first."}, …]}
```

Three to twelve stops. Every `why` explains the order and goes through the lint. See COMPLIANCE.md.

## What the validator checks

Frontmatter fields and types; file and folder naming; unique codes; every `related`, `connects`, `also`, line, and route reference resolves; five sections each with Short and Long; written cards have no placeholder shorts; and the compliance lint on every sentence a reader sees (summary, hook, every field, every route `why` and `for`). Errors fail the build. Warnings (missing sources, routes through planned stations, missing hooks) print and pass.

## What's in dist/

- `cards.json`: every card with fields split short/long, plus the disclaimer and pledge attached.
- `map.json`: what the map component renders.
- `routes.json`: routes with titles and statuses resolved.
- `video-cards.json`: the shape `routes-video/src/cards.json` expects; copy it over to render clips.

## Editing

Edit the markdown. Run validate. Commit. Nothing else writes to this folder; `dist/` is generated and can be rebuilt at any time.
