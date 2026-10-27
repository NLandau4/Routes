---
code: T1
slug: orders
title: "Order types"
line: T
lines: [T]
also: []
zone: 3
status: written
summary: "Market, limit, stop. What each one promises, and when a market order costs you."
hook: "'Buy' isn't an order. It's three different orders, and one of them can fill at a price you never saw."
related: []
connects: []
reading_minutes:
  short: 2
  long: null
sources: []
updated: 2026-10-26
lint_allow: []
---

## What it is

### Short

Instructions to a broker. A market order says 'get me in now at whatever the price is.' A limit order says 'only at this price or better,' and may never fill. A stop order sits dormant until the price hits a trigger, then becomes a market order, which is how a stop set to limit a loss can fill well below the trigger in a fast move. A stop-limit adds a floor, at the cost of maybe not filling at all.

### Long

_Not yet written._

## Who ends up using it

### Short

Everyone who places a trade, including people who only ever hit the big green button, which is usually a market order. Active traders use limits by default.

### Long

_Not yet written._

## How it makes money off you

### Short

Market orders fill at the ask (buying) or the bid (selling), so you pay the spread every time. Brokers that sell your order flow to market makers earn more on market orders because those are the easiest to profit from. The fees are invisible; they show up as a slightly worse price.

### Long

_Not yet written._

## What goes wrong

### Short

A market order on a thinly traded stock or ETF at the open, filling far from the last price you saw. A stop-loss triggered by a brief dip, selling you out right before the rebound. A limit set so tight it never fills while the price runs away. Not knowing which type the app's default button is.

### Long

_Not yet written._

## What to ask

### Short

What type of order is this button? What's the spread right now? If I use a stop, what happens in a gap down? Is this order good for the day or until cancelled?

### Long

_Not yet written._
