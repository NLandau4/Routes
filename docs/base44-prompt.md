# Base44 build prompt for Routes

Paste as the first message in a new Base44 app. Upload `routes-app/data/cards.json`, `map.json`, and `routes.json` when it asks for data, or let it read them from the connected GitHub repo.

---

PROJECT: Routes. A financial education app built as a transit map.

What it is
Routes teaches money terms the way a subway map teaches a city. Every money term is a station. Stations sit on six colored lines (learning paths). Five zones run left to right from "first paycheck" to "expert." Each station opens a card with the same six sections every time. Readers mark stations read and can follow a route (a curated reading order). The app is education only. It never gives advice, never recommends a product, has no affiliate links, and every card carries a fixed disclaimer. Treat the compliance rules at the end as hard requirements.

Source code is in my GitHub, which is connected to this workspace
Two repositories:
- routes-app: a working Next.js 15 implementation of everything described below. Read it before building anything. The files that matter: lib/layout.ts (station placement and the 45° rail path algorithm), components/TransitMap.tsx (the SVG map), components/CardPanel.tsx (the six-section card with Short/Long toggle), components/MapScreen.tsx (line focus, selection, routes, progress), lib/progress.ts (localStorage state), app/globals.css (every color, font, and component style), and the pages under app/. The content it reads is in data/cards.json, data/map.json, and data/routes.json.
- routes-cards: the content source of truth. Markdown cards under cards/, routes under routes/, lines.json, and scripts/build.py which produces the three JSON files. COMPLIANCE.md is the rulebook; follow it.
Port the logic and the styles from routes-app into this app rather than reinventing them. Keep the station placement algorithm, the rail path math, the CSS variables, and the component structure. Import the three JSON files from routes-app/data/ as the Card, Line/Zone, and Route entities. Where Base44 needs its own conventions (routing, entities, auth), adapt, but the visual output must match what routes-app renders. If anything in this prompt conflicts with the repo, the repo wins for implementation detail and this prompt wins for scope and compliance.

What already exists (build on this, do not redesign)
- cards.json: 67 cards keyed by station code (P1 … M8). Each card has: code, slug, title, line (letter), lines (array), also (alias codes for interchanges), zone (1–5), status (written | planned), summary, hook, related (codes), connects (codes), reading_minutes {short, long}, sources, updated, fields (array of five: key, label, short, long; long is null when unwritten), disclaimer, pledge.
- map.json: lines (letter → name, color, ordered station codes), zones (n, name, tagline), stations, interchanges, connections.
- routes.json: 5 curated routes, each with slug, title, "for" sentence, and stops [{code, why, title, status, line}].
Import these into entities: Card, Line, Zone, Route. Do not alter the text content. 20 cards are written; 47 are planned stubs and must still appear on the map, drawn with a dashed ring.

Lines and colors (exact)
P Paycheck & Taxes #1F9D5A · C Cushion & Protection #2F6BFF · D Debt #E8322B · I Investing #F28B00 · T Trading #8A3FFC · M Modern Money #00A3A3. Station codes are the line letter plus position (P6 = sixth stop on the Paycheck line). Interchanges belong to two lines and answer to two codes (P7 is also C5).

Pages

1. / The map. Full-width SVG transit map. Compute station positions from the data: each line is a horizontal row (P top, M bottom, 112px apart); each zone is a vertical band whose width scales with the busiest line in that zone (about 118px per station, minimum 300px); stations are spaced evenly within their zone on their line; interchanges sit halfway between their two rows so both rails reach them. Rails are 12px, rounded, with 45° elbows between stations on different rows, drawn with a subtle gradient of the line color. Zone labels as black pills ("ZONE 1" + name) at the top of each band with dashed vertical dividers. Station = white circle with black stroke; interchange = larger circle with a dashed second ring in the other line's color; planned = dashed stroke; read = small green dot inside; selected = yellow fill (#FFD100) with a soft glow. Labels alternate above/below by row; station code in small mono text on the opposite side. Zoom +/−/Fit buttons bottom-left. Pan by drag/scroll.
   A line bar above the map: six pill buttons (letter roundel + name). Clicking one dims every other line and station to ~20% opacity and glows the chosen line; clicking again shows all. Transitions ~400ms.
   A right-side panel (desktop, 470px) or bottom sheet (mobile, ~62vh, draggable handle) shows the selected card. Empty state: "Pick a station" with four one-line instructions.

2. The card panel (also /card/[code], alias codes resolve). Header in a gradient from the line color to near-black, containing: a white roundel with the code, the line name, "ZONE n · name · CARD WRITTEN or PLANNED," a yellow pill with reading time ("5 MIN · 14 MIN LONG"), the title in a heavy display face at ~48px, and the hook sentence. Below: six numbered expandable sections (01–06): What it is, Who ends up using it, How it makes money off you (this one carries a small black tag reading "THE POINT"), What goes wrong, What to ask, Connections. One open at a time; section 01 open by default. Inside an open section, a pill toggle SHORT | LONG READ. LONG READ is disabled with "· SOON" when long is null. Connections shows related and connects codes as outlined chips linking to those cards. Footer in dark gradient: "NEXT → code title" (next on the line, or next route stop if a route is active), a yellow "MARK P6 READ" button, an outlined "OPEN" link, and the disclaimer + pledge in small mono caps.

3. /line/[letter] The line's stations in order as a list of cards (roundel, title, summary, zone, status).

4. /route A list of the five routes (title, "for" sentence, stop codes). /route/[slug] opens the map with that route active: everything not on the route dims, the route is drawn over the rails as a 5px yellow dashed path with a soft dark under-stroke, each stop shows its step number, the first stop is selected, a yellow strip above the card reads "YOUR ROUTE · title · stop list · STOP n OF m," and the card header shows "WHY THIS STOP:" followed by the stop's why text. A yellow chip in the line bar shows "Your route · title · k of m" with an × to clear it; when no route is active the chip reads "Plan a route" and links to /route.

5. /about The pledge and the disclaimer, plus: what Routes is, what it is not (advice), who writes it, and a data note (progress stays in the browser until the reader makes an account; Routes never asks for balances, account numbers, or holdings).

User state
Phase 1 (now): read progress and the active route stored in localStorage, no login. Header shows "YOU · 06/67 READ." Phase 2 (build the entities now, wire later): a User entity with readStations (array of codes) and activeRoute (slug), synced on magic-link login. Do not ask for any financial information at signup.

Design spec
White page (#FFFFFF) over a very light dot grid (#D5D9E0 dots on 28px). Ink #0E1116. Muted #5B6472. One accent: yellow #FFD100 (with #FFE257 and #F2B600 for gradient ends), used only for the selected station, the route path, the primary button, and the header ring. Top bar 64px, dark gradient (#0E1116 → #141B24 → #0F2A22), with a yellow ring logo, "ROUTES" in heavy display type, a mono subtitle "SYSTEM MAP · 6 LINES · 67 STATIONS · 20 WRITTEN," and a yellow pill link to About. Fonts from Google Fonts: Bricolage Grotesque (display, 700/800), IBM Plex Mono (codes, labels, small caps), Instrument Sans (body). Dividers are 1px hairlines that fade at both ends, not solid rules. Pills and roundels, not boxes. Soft drop shadows on floating controls. No emoji anywhere. Must work at 390px wide: line bar scrolls horizontally, panel becomes a bottom sheet, header hides the subtitle.

Compliance rules (hard requirements)
- Every card view, route view, and the About page shows this text unaltered: "Educational only. Not investment, tax, or legal advice, and not personalized to you."
- The pledge appears on About and in every card footer: "No affiliate links. No sponsored products. Routes is not paid when you sign up for anything."
- No feature may recommend, rank, or compare financial products, say "you should," set a dollar or percentage target for the reader, forecast prices or rates, or promise returns. Routes are reading orders; a stop's "why" explains the order, never an action.
- No external links to financial products. No ads. No referral codes.
- Do not collect balances, account numbers, income, holdings, or any financial data from users at any point.
- Do not add any AI chat or AI-generated financial text in this phase. (A later phase adds an "Explain This" feature with strict guardrails; leave a disabled placeholder nav item only.)

Out of scope for this build
Payments, AI features, generated routes, admin editing of cards (content is edited in the source data and re-imported), social features, notifications.

Done means
The map renders all 67 stations from the data with correct lines, zones, interchanges, and dashed planned stations; clicking any station opens its card with all six sections and the Short/Long toggle; line focus dims correctly; the five routes draw as yellow paths with numbered stops and "why this stop"; progress persists in the browser; every page carries the disclaimer; the whole thing works on a phone.
