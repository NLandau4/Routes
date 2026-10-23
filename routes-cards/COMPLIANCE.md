# Compliance rules for everything in this store

Routes is education. It is general, impersonal, and regularly published, which is the kind of content the publisher's exclusion under the Investment Advisers Act of 1940 (Section 202(a)(11)(D)) is meant to cover. Everything below exists to keep it there. This file is the product's working rules, not legal advice; a securities attorney reviews these rules, the disclaimers, and the Explain This and Routes prompts before the paid tier launches.

## What a card may do

- Describe what a product or term is, who ends up using it, how the provider earns from it, what goes wrong, and what questions a reader can ask a bank, employer, or provider.
- Name companies as examples of a category (the three credit bureaus, the common BNPL providers). Never rank them, never compare them as better or worse, and give a source for any claim about a named company.
- State historical figures with a date and a source in `sources`. A number without a source is a warning at validation and must be sourced before the card is published.

## What a card may never do

- Recommend. No "you should," no "we recommend," no "best X," no "our pick." The validator rejects these phrasings (`scripts/validate.py`, `ADVICE`).
- Personalize. No "for your situation," no "based on your income." A card is the same for every reader.
- Instruct a trade or an action. No "buy," "sell," "open," "close," "switch," "move your money" as an instruction. Questions a reader can ask are fine; steps they should take are not.
- Forecast. No "rates will rise," no "the market will." Historical ranges with sources only.
- Guarantee. No "guaranteed returns," "can't lose," "risk-free profit." The Scams card may quote these phrases as red flags; it allowlists them in `lint_allow` and that is the only legitimate use.
- Set targets. No "save $X," no "put 15% of your income in." Describing how a formula works (a match of 100% of the first 3%) is fine; telling the reader a number to hit is not.
- Carry affiliate language. No affiliate links, no sponsored products, no referral codes, in any field, ever. The pledge is attached to every built card.

## Terms of art

Phrases that contain advice words but are names of things ("buy now, pay later," "short selling") are listed in `TERMS_OK` in the validator and are never flagged. Add to that list only for a real term, never to get a sentence past the lint.

## Routes

A route is a reading order, not a plan. Each stop's `why` explains why that station comes next in the sequence. It may refer to what the reader said they want to understand. It may never tell the reader to do anything, and it goes through the same lint as cards. Route intake asks what someone wants to understand and what situation they are in, in plain words. It never asks for balances, holdings, income figures, or account details.

## Explain This and generated Routes (when built)

- Retrieval runs only over this store. The model explains using card language and links to cards.
- The system prompt refuses "should I," "is this good for me," and any request for a decision, and redirects to the relevant card.
- Every output is logged with its inputs for review, and every output carries the disclaimer.
- Uploads are not retained beyond the session unless the reader saves the result, and saved results are encrypted at rest. The privacy page states this in plain words.
- A one-click report button on every output.

## Disclaimers

Every card, route, article, and AI output carries, unaltered:

> Educational only. Not investment, tax, or legal advice, and not personalized to you.

The About page carries the pledge:

> No affiliate links. No sponsored products. Routes is not paid when you sign up for anything.

## Maintenance

Figures go stale. Every card has `updated`; a quarterly sweep re-checks every figure against its source and bumps the date. What's New posts record each change.
