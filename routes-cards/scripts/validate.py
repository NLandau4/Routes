#!/usr/bin/env python3
"""Validate the card store: schema, codes, references, and the compliance lint.

Exit 1 on any error. Warnings are printed but do not fail the build.
Run from the repo root:  python3 scripts/validate.py
"""
import json, os, re, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FIELDS = ["What it is", "Who ends up using it", "How it makes money off you", "What goes wrong", "What to ask"]
LINE_LETTERS = set("PCDITM")

# ---------- compliance lint ----------
# Routes publishes general, impersonal education. These patterns are the phrasings that
# make text read as a personalized recommendation, a forecast, or a guarantee. Each match is an
# error unless the card lists the exact phrase in `lint_allow`.
# Patterns are matched case-insensitively on each field's text.
ADVICE = [
    (r"\byou should\b", "personal recommendation"),
    (r"\byou shouldn't\b", "personal recommendation"),
    (r"\bshould you\b", "personal recommendation"),
    (r"\byou need to (open|buy|sell|switch|move|invest|put|close)\b", "personal recommendation"),
    (r"\byou (must|have to) (open|buy|sell|switch|move|invest|put|close)\b", "personal recommendation"),
    (r"\b(i|we) recommend\b", "recommendation"),
    (r"\brecommended\b", "recommendation"),
    (r"\bour (pick|picks|favorite|favourite)\b", "recommendation"),
    (r"\bbest (bank|card|fund|etf|stock|broker|app|account|loan|rate|choice|option)s?\b", "ranking"),
    (r"\btop \d+ (bank|card|fund|etf|stock|broker|app|account)s?\b", "ranking"),
    (r"\b(buy|sell|short|hold) (this|that|the|these|those) (stock|fund|etf|coin|token|bond|option)s?\b", "trade instruction"),
    (r"\btime to (buy|sell)\b", "trade instruction"),
    (r"\b(guaranteed|guarantee) (return|returns|profit|profits|gain|gains|income)\b", "guarantee"),
    (r"\b(can't|cannot|can not) lose\b", "guarantee"),
    (r"\brisk[- ]free (return|profit|gain)s?\b", "guarantee"),
    (r"\b(will|is going to|are going to) (go up|go down|rise|fall|crash|rally|double|outperform|beat the market)\b", "forecast"),
    (r"\bthe market will\b", "forecast"),
    (r"\brates (will|are going to) (rise|fall|drop|climb)\b", "forecast"),
    (r"\bexpect(ed)? (to )?(return|returns|gain|gains) of \d", "forecast"),
    (r"\byou('ll| will) (make|earn|get) \$?\d", "forecast"),
    (r"\b(invest|move|keep|save|contribute) (at least |about |around )?\$\d", "dollar target"),
    (r"\b\d+% of your (income|paycheck|salary|money|portfolio)\b", "allocation target"),
    (r"\bfor your (situation|portfolio|goals|age|income)\b", "personalization"),
    (r"\bbased on your (situation|portfolio|goals|age|income|balance)\b", "personalization"),
    (r"\b(affiliate|sponsored|partner) (link|links|offer|offers)\b", "affiliate language"),
    (r"\bsign up (through|via|with) (our|my) link\b", "affiliate language"),
    (r"\buse code\b", "affiliate language"),
]
# Phrases that look like advice words but are terms of art, never flagged.
TERMS_OK = ["buy now, pay later", "buy now pay later", "pay in 4", "short selling", "sell side", "buy side"]

def lint(text, allow):
    t = text.lower()
    for ok in TERMS_OK:
        t = t.replace(ok, " ")
    for a in allow:
        t = t.replace(a.lower(), " ")
    hits = []
    for pat, kind in ADVICE:
        for m in re.finditer(pat, t):
            hits.append((kind, m.group(0)))
    return hits

# ---------- frontmatter ----------
def parse_front(src, path):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", src, re.S)
    if not m:
        return None, None, [f"{path}: missing frontmatter"]
    fm, body = m.group(1), m.group(2)
    d, errs = {}, []
    cur = None
    for line in fm.split("\n"):
        if re.match(r"^\s+\w+:", line) and cur:
            k, v = line.strip().split(":", 1)
            d[cur][k.strip()] = parse_val(v.strip())
            continue
        if ":" not in line:
            errs.append(f"{path}: bad frontmatter line: {line!r}")
            continue
        k, v = line.split(":", 1)
        k, v = k.strip(), v.strip()
        if v == "":
            d[k] = {}
            cur = k
        else:
            d[k] = parse_val(v)
            cur = None
    return d, body, errs

def parse_val(v):
    if v == "null": return None
    if v.startswith("[") and v.endswith("]"):
        inner = v[1:-1].strip()
        return [x.strip().strip('"') for x in inner.split(",")] if inner else []
    if v.startswith('"'):
        return json.loads(v)
    if re.fullmatch(r"-?\d+", v): return int(v)
    return v

def parse_body(body, path):
    """Return {field: {'short': str, 'long': str}} and errors."""
    out, errs = {}, []
    sections = re.split(r"^## ", body, flags=re.M)[1:]
    for sec in sections:
        name, _, rest = sec.partition("\n")
        name = name.strip()
        if name not in FIELDS:
            errs.append(f"{path}: unknown section '## {name}'")
            continue
        parts = re.split(r"^### ", rest, flags=re.M)[1:]
        sub = {}
        for p in parts:
            pn, _, pt = p.partition("\n")
            sub[pn.strip().lower()] = pt.strip()
        if "short" not in sub or "long" not in sub:
            errs.append(f"{path}: section '{name}' needs ### Short and ### Long")
        out[name] = sub
    for f in FIELDS:
        if f not in out:
            errs.append(f"{path}: missing section '## {f}'")
    return out, errs

PLACEHOLDER = "_Not yet written._"

def main():
    errors, warnings = [], []
    cards = {}
    for path in sorted(glob.glob(f"{ROOT}/cards/*/*.md")):
        rel = os.path.relpath(path, ROOT)
        src = open(path, encoding="utf-8").read()
        fm, body, e = parse_front(src, rel)
        errors += e
        if fm is None: continue
        for req in ["code", "slug", "title", "line", "lines", "zone", "status", "summary", "related", "connects", "reading_minutes", "sources", "updated"]:
            if req not in fm: errors.append(f"{rel}: missing '{req}'")
        code = fm.get("code", "")
        if not re.fullmatch(r"[PCDITM]\d{1,2}", code): errors.append(f"{rel}: bad code {code!r}")
        if code in cards: errors.append(f"{rel}: duplicate code {code}")
        if fm.get("line") not in LINE_LETTERS: errors.append(f"{rel}: bad line {fm.get('line')!r}")
        if fm.get("zone") not in (1, 2, 3, 4, 5): errors.append(f"{rel}: zone must be 1-5")
        if fm.get("status") not in ("written", "planned", "review"): errors.append(f"{rel}: status must be written|planned|review")
        expected_name = f"{code}-{fm.get('slug')}.md"
        if os.path.basename(path) != expected_name: errors.append(f"{rel}: filename should be {expected_name}")
        if os.path.basename(os.path.dirname(path)) != fm.get("line"): errors.append(f"{rel}: folder should be cards/{fm.get('line')}/")
        fields, e = parse_body(body, rel)
        errors += e
        allow = fm.get("lint_allow") or []
        # Lint every piece of prose the reader will see.
        texts = [("summary", fm.get("summary") or ""), ("hook", fm.get("hook") or "")]
        for f, sub in fields.items():
            for k, v in sub.items():
                if v and v != PLACEHOLDER: texts.append((f"{f}/{k}", v))
        for where, text in texts:
            for kind, phrase in lint(text, allow):
                errors.append(f"{rel} [{where}]: {kind}: {phrase!r}")
        if fm.get("status") == "written":
            for f in FIELDS:
                if fields.get(f, {}).get("short", PLACEHOLDER) == PLACEHOLDER:
                    errors.append(f"{rel}: status written but '{f}' short is a placeholder")
            if not fm.get("hook"): warnings.append(f"{rel}: written card has no hook")
            has_fig = any(re.search(r"\$\d|\d+(\.\d+)?%|\b\d{2,}\b", t) for _, t in texts)
            if has_fig and not fm.get("sources"): warnings.append(f"{rel}: states a figure but has no sources")
            long_done = all(fields.get(f, {}).get("long", PLACEHOLDER) != PLACEHOLDER for f in FIELDS)
            rm = fm.get("reading_minutes") or {}
            if long_done and rm.get("long") is None: warnings.append(f"{rel}: long reads written but reading_minutes.long is null")
        cards[code] = {**fm, "fields": fields, "path": rel}

    # references
    for code, c in cards.items():
        for r in c.get("related", []) + c.get("connects", []) + c.get("also", []):
            if r not in cards and r not in sum([x.get("also", []) for x in cards.values()], []):
                errors.append(f"{c['path']}: references unknown code {r}")
    # lines.json
    lines = json.load(open(f"{ROOT}/lines.json"))
    alias = {}
    for c in cards.values():
        for a in c.get("also", []): alias[a] = c["code"]
    for L, ln in lines["lines"].items():
        for s in ln["stations"]:
            if s not in cards and s not in alias:
                errors.append(f"lines.json: line {L} lists unknown station {s}")
    # routes
    for path in sorted(glob.glob(f"{ROOT}/routes/*.json")):
        rel = os.path.relpath(path, ROOT)
        r = json.load(open(path))
        for req in ["slug", "title", "for", "stops"]:
            if req not in r: errors.append(f"{rel}: missing '{req}'")
        if not 3 <= len(r.get("stops", [])) <= 12: errors.append(f"{rel}: routes have 3 to 12 stops")
        seen = set()
        for i, s in enumerate(r.get("stops", [])):
            code = alias.get(s.get("code"), s.get("code"))
            if code not in cards: errors.append(f"{rel}: stop {i+1} unknown code {s.get('code')}"); continue
            if code in seen: errors.append(f"{rel}: stop {s['code']} repeated")
            seen.add(code)
            if not s.get("why"): errors.append(f"{rel}: stop {s['code']} needs a 'why' (explain the order, never an action)")
            for kind, phrase in lint(s.get("why", ""), []):
                errors.append(f"{rel} stop {s['code']} why: {kind}: {phrase!r}")
            if cards[code]["status"] != "written": warnings.append(f"{rel}: stop {s['code']} is not written yet")
        for kind, phrase in lint(r.get("for", ""), []):
            errors.append(f"{rel} 'for': {kind}: {phrase!r}")

    for w in warnings: print("warn:", w)
    for e in errors: print("ERROR:", e)
    written = sum(1 for c in cards.values() if c["status"] == "written")
    print(f"\n{len(cards)} cards ({written} written), {len(glob.glob(f'{ROOT}/routes/*.json'))} routes, {len(warnings)} warnings, {len(errors)} errors")
    sys.exit(1 if errors else 0)

if __name__ == "__main__":
    main()
