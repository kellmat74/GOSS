---
id: act-anytime-draw-card
title: Draw a card (hand < 3)
category: misc-actions
side: neutral
usage: anytime
cost: null
ruleRefs:
  - "4.2.3.6"
  - "4.2"
seeAlso:
  - act-anytime-reaction-event
  - act-misc-pass
---

## When does this come up?

Your hand is below three cards — typically because you played a Reaction event or a hand-card event and discarded. This is the at-any-time hand top-up (4.2.3.6).

## Procedure

1. Verify your hand size is fewer than three cards (4.2.3.6).
   {{PA-BLOCK: pa2:use-at-any-time — Use At Any Time (not an action)}}
2. Draw one card from the deck.
3. Repeat as needed until your hand reaches three cards (unless the action is interrupted).

## See also

- [Play a Reaction event from hand](./act-anytime-reaction-event.md)
- [Pass](./act-misc-pass.md)
- Related rules: (4.2.3.6), (4.2)

## Coach

Draw immediately after a Reaction or +2 OPS hand-card play (4.2.3.6) so your reaction cushion is back before the opponent's next action. Wait until the current resolution closes, don't draw mid-attack. Late-game card scarcity is real, deck shuffles aren't infinite.

## Why and what to watch for

Drawing back to three cards is bookkeeping after a hand-card play (4.2.3.6). The intent is to keep both players holding a meaningful hand of cards through every turn so the reaction layer and the +2 OPS hand-card layer stay active. There is no choice involved, if you drop below three, draw back to three at any time.

Do it immediately after a Reaction or +2 OPS hand-card play, before the next action resolution. Keep an eye on the deck: if you've been forced to play cards rapidly through aggressive reaction use, you can blow through your draws and end up at a low deck count. Late-game card scarcity is real in BWN, the deck shuffles depend on scenario rules and aren't infinite refills. Draw back up promptly so you have the reaction cushion ready for the opponent's next action.

The only gotcha is interruption. If a sequence of events is being resolved (chains of reactions, ongoing attacks), wait until the resolution closes before drawing. You don't draw mid-attack; you draw between resolutions. Otherwise this is a single-step administrative action.

Pair this with [Reaction event play](./act-anytime-reaction-event.md) and [hand-card +2 OPS](./act-active-hand-card-event.md), both reduce hand size and trigger this draw. There is no opponent counter; this isn't an action and isn't intercepted.

Example: NATO plays a Reaction event ("Submarine Pairing") from a 3-card hand. Card discards, hand drops to 2. NATO declares draw, takes 1 card from the deck, hand returns to 3. Play resumes.
