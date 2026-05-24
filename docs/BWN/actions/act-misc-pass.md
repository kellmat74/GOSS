---
id: act-misc-pass
title: Pass
category: misc-actions
side: neutral
usage: action
cost: 0
ruleRefs:
  - "5.4.5"
  - "4.2"
seeAlso:
  - act-anytime-draw-card
---

## When does this come up?

You have fewer Operations Points than your opponent and would rather wait for them to commit. Passing burns the action slot at zero cost so the opponent must play next, after which you get another chance to act (5.4.5).

## Procedure

1. Verify your remaining OPS total is less than your opponent's (5.4.5).
2. Declare Pass. No OPS is spent.
3. The opponent plays the next action.
4. Play returns to you for another action choice. You may pass again if the OPS imbalance still holds.

## See also

- [Draw a card (hand < 3)](./act-anytime-draw-card.md)
- Related rules: (5.4.5), (4.2)

## Why and what to watch for

Pass is the tempo tool. When you have fewer OPS than your opponent you can declare Pass and force them to play next, after which you act again (5.4.5). The design intent is to prevent the OPS-rich player from front-loading every important action, the OPS-poor side gets the right to wait and counter-punch.

Take it when you'd rather see the opponent commit before you reveal your remaining plays. Classic uses: you've held back a high-value action (a strike, a TF formation) and you want to know whether the opponent will move the relevant detection marker, or you've held back a Reaction card and want them to fire the action that triggers it. Passing also matters at the end of a turn when you have 1-2 OPS left and don't want to waste it on weak actions, let the opponent burn through their own pool first.

The gotcha is the eligibility check: you must have less OPS remaining than your opponent, period (5.4.5 clarification). If you're tied, you cannot pass. The opponent then plays an action; their OPS drops below yours; you can no longer pass next time (you now have more OPS than they do). So passes alternate naturally if both players burn OPS at equal rates. Pass also burns the action slot, you don't get a free reaction or hand-card play before passing. And you cannot pass on the final action when one player has 0 OPS; the opponent simply finishes their last action and the turn ends.

This pairs with hidden-info play (hand cards, reactions) where letting the opponent commit first reveals which counter you should fire. Counter: opponents with more OPS will keep playing actions; eventually you'll run out of passes when the OPS gap closes. There's no card-based pass-prevention.

Example: turn 5, NATO has 4 OPS, Soviet has 6 OPS. NATO declares Pass, costs nothing. Soviet plays an Air Strike (1 OPS), now Soviet has 5 OPS, NATO still 4. NATO can no longer pass; declares an action. Both players continue alternating until OPS exhausted. Net effect: NATO forced Soviet to act first, learned the Air Strike target, and can now plan their remaining 4 OPS around the revealed information.
