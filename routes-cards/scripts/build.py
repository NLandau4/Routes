#!/usr/bin/env python3
"""Compile the card store to dist/ for the site, the map, and the video pipeline.

  dist/cards.json       every card, fields split short/long, disclaimer attached
  dist/map.json         lines, zones, stations with codes/titles/status, interchanges, connections
  dist/routes.json      curated routes with resolved titles
  dist/video-cards.json the shape the Remotion template reads (written cards only)

Runs validate.py first and refuses to build if it fails.
"""
import json, os, subprocess, sys, glob
sys.path.insert(0, os.path.dirname(__file__))
import validate as V

ROOT = V.ROOT
DISCLAIMER = "Educational only. Not investment, tax, or legal advice, and not personalized to you."
PLEDGE = "No affiliate links. No sponsored products. Routes is not paid when you sign up for anything."
FIELD_KEYS = {"What it is": "what", "Who ends up using it": "who", "How it makes money off you": "money", "What goes wrong": "wrong", "What to ask": "ask"}

def main():
    r = subprocess.run([sys.executable, os.path.join(ROOT, "scripts", "validate.py")], capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stdout); print("build refused: validation failed"); sys.exit(1)
    cards = {}
    for path in sorted(glob.glob(f"{ROOT}/cards/*/*.md")):
        src = open(path, encoding="utf-8").read()
        fm, body, _ = V.parse_front(src, path)
        fields, _ = V.parse_body(body, path)
        out = {k: fm.get(k) for k in ["code", "slug", "title", "line", "lines", "also", "zone", "status", "summary", "hook", "related", "connects", "reading_minutes", "sources", "updated"]}
        out["fields"] = []
        for label, key in FIELD_KEYS.items():
            s = fields.get(label, {})
            short = s.get("short", ""); long_ = s.get("long", "")
            out["fields"].append({"key": key, "label": label,
                                  "short": None if short == V.PLACEHOLDER else short,
                                  "long": None if long_ == V.PLACEHOLDER else long_})
        out["disclaimer"] = DISCLAIMER
        out["pledge"] = PLEDGE
        cards[out["code"]] = out
    lines = json.load(open(f"{ROOT}/lines.json"))
    alias = {a: c["code"] for c in cards.values() for a in (c.get("also") or [])}
    stations = {}
    for L, ln in lines["lines"].items():
        for s in ln["stations"]:
            code = alias.get(s, s)
            c = cards[code]
            stations[code] = {"code": code, "also": c.get("also") or [], "title": c["title"], "slug": c["slug"], "line": c["line"], "lines": c["lines"], "zone": c["zone"], "status": c["status"], "summary": c["summary"]}
    mapjson = {"lines": lines["lines"], "zones": lines["zones"], "stations": stations, "interchanges": lines["interchanges"], "connections": lines["connections"], "disclaimer": DISCLAIMER, "pledge": PLEDGE}
    routes = []
    for path in sorted(glob.glob(f"{ROOT}/routes/*.json")):
        rt = json.load(open(path))
        for st in rt["stops"]:
            code = alias.get(st["code"], st["code"])
            st["title"] = cards[code]["title"]; st["status"] = cards[code]["status"]; st["line"] = cards[code]["line"]
        rt["disclaimer"] = DISCLAIMER
        routes.append(rt)
    video = []
    for c in cards.values():
        if c["status"] != "written": continue
        video.append({"id": c["slug"], "code": c["code"], "number": int(c["code"][1:]), "term": c["title"], "path": lines["lines"][c["line"]]["name"],
                      "hook": c["hook"] or c["summary"],
                      "fields": [{"key": f["key"], "label": f["label"], "text": f["short"]} for f in c["fields"]],
                      "outro": DISCLAIMER})
    os.makedirs(f"{ROOT}/dist", exist_ok=True)
    for name, data in [("cards.json", cards), ("map.json", mapjson), ("routes.json", routes), ("video-cards.json", video)]:
        json.dump(data, open(f"{ROOT}/dist/{name}", "w"), indent=2, ensure_ascii=False)
    print(f"built dist/: {len(cards)} cards, {len(stations)} stations, {len(routes)} routes, {len(video)} video cards")

if __name__ == "__main__":
    main()
