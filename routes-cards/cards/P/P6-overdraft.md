---
code: P6
slug: overdraft
title: "Overdraft"
line: P
lines: [P]
also: []
zone: 1
status: written
summary: "Spending more than you have. The bank declines it or covers it and charges a fee, historically $30 to $35 each."
hook: "The $35 fee for having $4 in your account."
related: [P5, P7, D2]
connects: []
reading_minutes:
  short: 2
  long: 9
sources: ["Congress Repeals CFPB's Overdraft Rule (CRS IN12513) · https://www.everycrsreport.com/reports/IN12513.html · 2025-09-10", "CFPB finalizes $5 overdraft fee cap for large banks (Banking Dive) · https://www.bankingdive.com/news/cfpb-overdraft-final-rule-5-dollar-fee-chopra-aba-cba/735348/ · 2024-12-12"]
updated: 2026-10-26
lint_allow: []
---

## What it is

### Short

Spending more than is in your checking account. The bank either declines the transaction or covers it and charges an overdraft fee, often around $35 per occurrence. Several large banks dropped the fee in 2021 and 2022 and others cut it to about $10; many still charge the full amount.

### Long

Here is the whole mechanism in one sentence: you try to spend money that isn't in your checking account, and the bank decides what to do about it.

There are only three things it can do. It can decline the transaction, and you pay with something else or not at all. It can cover the transaction out of its own pocket and charge you a fee for the favor, which is an overdraft. Or it can move money from a linked savings account to cover the gap, which is an overdraft transfer, usually free or a few dollars.

The second one is the product. For most of the last thirty years the fee was around $35, charged per transaction, and it didn't matter whether the transaction was a $4 coffee or a $400 car repair. The fee was the fee.

Two things changed recently, and they pull in opposite directions. From 2021 on, a handful of big banks dropped overdraft fees entirely or cut them to about $10, mostly because regulators and the press kept pointing at them. Then in late 2024 the CFPB finalized a rule that would have capped the fee at $5 for large banks. In May 2025 Congress repealed that rule before it took effect. So the cap is gone, the pressure that produced the voluntary cuts has eased, and what you pay now depends entirely on which bank you're at. Some charge nothing. Some charge $10. Plenty still charge $35.

The important word in all of this is *decline*. A declined card feels like failure. It's actually the cheap outcome. The expensive outcome is the one where everything goes through.

## Who ends up using it

### Short

Nobody on purpose. It happens most to people living paycheck to paycheck, which is why it's been the subject of so much regulation.

### Long

Nobody signs up for overdraft the way they sign up for a credit card. It happens to people. But it doesn't happen evenly.

The CFPB's own research over the years found the same shape every time: a small share of account holders pay the large majority of overdraft fees. Those are people who overdraft many times a year, which is another way of saying people whose balance lives near zero. If your account never drops below a few hundred dollars, the fee is theoretical. If you're timing rent against a paycheck, it's a line item.

There's a second group that pays occasionally and gets angrier about it: people with money in savings and almost nothing in checking, who forgot an autopay was coming. Same fee, different story.

And there's a group that's shrinking but still real: people who think they're protected because their card "always works." It always works because they opted in to overdraft coverage, sometimes years ago, often at account opening, and the bank is quietly covering and charging.

## How it makes money off you

### Short

The fee itself. Overdraft and NSF fees ran about $5.8 billion in 2023, down from $12.6 billion in 2019. A federal rule capping the fee at $5 at large banks was finalized in December 2024 and repealed by Congress in May 2025, so the fee is back to whatever each bank sets. "Overdraft protection" is a product you opt into that covers the shortfall from a linked account, sometimes for a smaller fee.

### Long

The fee is the product. That's not a cynical reading; it's how the banks' own financial statements describe it. Before the voluntary cuts, overdraft and non-sufficient-funds fees were one of the largest sources of consumer fee income at U.S. banks, in the tens of billions of dollars a year across the industry. A service that costs the bank almost nothing to provide (it's a short loan, repaid within days when your paycheck lands) and brings in that much is not a courtesy. It's a business line.

Three mechanics make the business work.

**Opt-in.** Since 2010, banks have needed your permission to charge overdraft fees on debit card purchases and ATM withdrawals. So they ask for it, at account opening, framed as protection: *would you like us to cover your purchases if you're short?* Most people say yes. Saying yes is what turns a free decline into a $35 fee.

**Per-transaction pricing.** The fee attaches to each item, not to the day. Five small purchases over the line are five fees. This is where the $4 coffee becomes a $39 coffee.

**Posting order.** For years, many banks processed a day's transactions from largest to smallest rather than in the order they happened. That drains the account faster and triggers more fees on the small items that follow. Here's the same $80 of spending, two ways:

![The same five purchases, two posting orders](/figures/P6-ordering.svg "Same day, same purchases: two fees or four, depending on the order the bank posts them")

Largest-first posting has been litigated repeatedly and many banks have stopped. Some haven't. The way to know is to ask, or to read the deposit agreement, which almost nobody does.

## What goes wrong

### Short

Several fees in one day from small purchases. Some banks have reordered transactions largest-first, which triggers more overdrafts.

### Long

The classic failure is the cascade. One autopay lands a day early, the balance goes negative, and then the normal small purchases of a day each pick up a fee before you notice. By the time the paycheck arrives, the bank takes the fees first, which can leave the balance short again. Two or three fee days in a month is a few hundred dollars gone from someone who, by definition, didn't have a few hundred dollars to spare.

The second failure is the one the opt-in creates. People who are covered don't find out they were short until the statement, so there's no moment to stop and pay another way. A decline at the register is unpleasant and informative. Coverage is pleasant and expensive.

![What happens when you swipe with $4 in the account](/figures/P6-optin.svg "The opt-in decides whether a $12 charge costs $12 or $47")

Third, overdraft fees are sometimes confused with NSF fees, which are charged when the bank *declines* a check or an electronic payment for insufficient funds. Same trigger, opposite action, and historically a similar price. Most large banks dropped NSF fees between 2022 and 2024. Some smaller institutions still charge them, which means you can be charged for a payment that didn't go through.

Fourth, the fee keeps the account negative, and a negative balance for long enough gets the account closed and reported to a database banks check before opening new accounts. That can lock someone out of the banking system for years. The fee is the first domino.

## What to ask

### Short

Am I opted in to overdraft coverage, or will the card just decline? What's the fee, and is there a daily cap? Can I link savings as a backstop instead?

### Long

These are questions for a bank, phrased so a teller or a chat agent can answer them.

**Am I opted in to overdraft coverage on debit card purchases and ATM withdrawals?** If the answer is yes and you don't remember choosing it, the follow-up is how to opt out. Opting out means the card declines when you're short, and nothing else changes.

**What is the overdraft fee, and is there a daily maximum on the number of fees?** Most banks cap it at three to six per day, which is still a lot.

**Is there a grace amount or a grace period?** Some banks don't charge if the overdraft is under a small amount, or if the balance is brought positive by the end of the next business day.

**In what order do you post a day's transactions?** You're listening for "in the order received" or "smallest first." If the answer is "largest first," that's a thing to know about your bank.

**Can I link savings for overdraft transfers instead, and what does that cost?**

**Do you charge an NSF fee when you decline a payment?**

One more question, and it's for yourself: what would change if the card just declined? For most people the honest answer is a moment of embarrassment and a different card. That's the trade the opt-in form is asking you to think about.
