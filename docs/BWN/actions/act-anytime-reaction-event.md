---
id: act-anytime-reaction-event
title: Play a Reaction event from hand
category: misc-actions
side: neutral
usage: anytime
cost: null
ruleRefs:
  - "4.2.3.1"
  - "4.2"
seeAlso:
  - act-active-ops-card-event
  - act-active-hand-card-event
  - act-anytime-draw-card
---

## When does this come up?

The opponent (or you) is resolving an action and a card in your hand has a Reaction event whose trigger condition has been met. The card itself specifies when it is playable. Reactions are free to play (the card text may impose other costs).

## Procedure

1. Trigger condition occurs during an action being resolved (4.2.3.1).
   {{PA-BLOCK: pa2:use-at-any-time — Use At Any Time (not an action)}}
2. Declare you are playing the card's Reaction event (the bottom event on a card).
3. Resolve the event per the card text. Reactions usually trigger immediately and modify or interrupt the current action.
4. Discard the card. If your hand drops below three cards, draw back up to three (4.2.3.6).

## See also

- [Play an event on one of your OPS cards](./act-active-ops-card-event.md)
- [Play a hand card's event for +2 OPS](./act-active-hand-card-event.md)
- [Draw a card (hand < 3)](./act-anytime-draw-card.md)
- Related rules: (4.2.3.1), (4.2)

## Why and what to watch for

Reaction events are free-to-play from hand when their trigger condition occurs (4.2.3.1). The design lets the hand-card layer respond to enemy action without consuming OPS or an action, interception cards, counter-attack cards, save cards, and "no, but" responses live here. The card itself specifies when it is playable; resolving it usually modifies or interrupts whatever the opponent just did.

Take it the moment the trigger fires, but understand the discard cost. Most reactions get used once and gone, they're not OPS cards on the table all turn. If you're holding the reaction primarily for a specific later trigger (a specific strike pattern, a specific Convoy attack), it might be worth letting an early weaker trigger pass to save the card. But sitting on reactions through the whole turn is usually wasteful, at end of turn they go nowhere special, they're just in hand for next turn.

The gotcha is reading the trigger language literally. "Submarine Pairing" requires any step loss to fire (4.2.3.1 clarification), not just submarine combat. "Distant Support" requires the attacking strike to be adjacent and commits the F-14 as CAP over the target fleet (clarification). "NATO Counter Attack" can be played on a Convoy that just arrived at port (the convoy was removed because it arrived, not because of the reaction). Read the entire card before declaring, and remember reactions can chain: your reaction may trigger your opponent's reaction in turn.

This pairs with the [hand-card +2 OPS event](./act-active-hand-card-event.md), keeping a critical reaction hidden in hand is the entire strategic value of the card system. Counter: opponent times their action to minimize reaction-card relevance, or holds back on the action that would trigger your reaction. Reactions to step losses can be especially difficult to bait, opponents may decline an attack rather than expose themselves to your reaction.

Example: Soviet declares a sub strike against NATO TF; rolls hits. NATO step loss triggered. NATO plays "Submarine Pairing" reaction from hand, declares two NATO subs that were in the zone, both now attack the Soviet sub simultaneously. Resolve, discard the reaction card, NATO draws back to 3 cards (4.2.3.6). Play returns to whatever was happening before, Soviet still completes the rest of the original attack resolution.
