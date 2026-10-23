# routes-app

The Routes site: the system map, card pages, line pages, routes, and the About page. Reads everything from `data/*.json`, which is built from the `routes-cards` store.

```bash
npm install
npm run sync     # rebuilds routes-cards/dist and copies it into data/ (expects ../routes-cards)
npm run dev      # http://localhost:3000
npm run build && npm start
```

Routes: `/` map · `/card/P6` a station (alias codes like `C5` resolve) · `/line/P` a line in order · `/route` the route picker · `/route/first-paycheck` a route drawn on the map · `/about` the pledge. `/#P6` also opens a station.

Progress ("mark read") and the active route live in localStorage until accounts (module 6) sync them.

## Deploy on Railway

New project → Deploy from GitHub repo → this folder. Railway detects Next.js; set the start command to `npm start` if it doesn't. `output: "standalone"` is on. Add a custom domain under Settings → Networking. To update content: edit the card store, run `npm run sync`, commit `data/`, push.

## Where things are

- `lib/layout.ts` places every station from `lines.json` (zone × position on line). Nothing is hand-placed; add a station to a line and it appears.
- `components/TransitMap.tsx` the SVG map. `CardPanel.tsx` the six-section card with Short/Long toggle. `MapScreen.tsx` wires them with line focus, selection, routes, and progress.
- Colors and type live in `app/globals.css` under `:root`.
