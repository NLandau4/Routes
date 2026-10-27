---
code: T11
slug: backtest
title: "Backtesting"
line: T
lines: [T]
also: []
zone: 5
status: written
summary: "Testing a strategy on past data, and the overfitting trap that makes every backtest look great."
hook: "Every strategy looks great on the data it was built from. That's not a result. That's a mirror."
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

Running a trading rule against past prices to see how it would have done. Useful for finding out whether an idea is nonsense; dangerous because of overfitting: tweak the rules enough and any strategy will fit history perfectly and fail going forward. The honest version tests on data the rule never saw, includes trading costs and spreads, and counts the strategies that were tried and discarded.

### Long

_Not yet written._

## Who ends up using it

### Short

Quant funds, with teams and skepticism. Retail traders and the people selling to them, usually with a chart of a line going up and to the right.

### Long

_Not yet written._

## How it makes money off you

### Short

Backtesting software subscriptions, 'proven' systems sold on their historical curve, signal services, and algorithmic-trading courses. The curve in the ad was chosen from many; you're paying for the survivor.

### Long

_Not yet written._

## What goes wrong

### Short

Fitting the rule to the data and calling it a discovery. Leaving out costs, slippage, and the stocks that went bankrupt and dropped out of the database. Testing on ten years that happened to be a bull market. Trading real money on a backtest with no out-of-sample period.

### Long

_Not yet written._

## What to ask

### Short

Was any of this data held back and tested after the rule was fixed? Are spreads, commissions, and taxes included? How many versions were tried before this one? What happens to the curve if I start it a year later?

### Long

_Not yet written._
