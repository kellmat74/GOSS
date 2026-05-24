---
id: act-misc-repair
title: Repair a facility
category: misc-actions
side: neutral
usage: action
cost: 2
ruleRefs:
  - "5.4.1"
  - "2.3.8.4"
seeAlso:
  - act-misc-demine-port
---

## When does this come up?

A facility (port, airbase, etc.) has taken damage. Spending 2 OPS removes one Hit; if the removal would change the damage status (Heavy → Light, Light → Undamaged), a die roll is required (5.4.1).

## Procedure

1. Spend 2 OPS and select one damaged facility.
2. Remove one Hit marker from the facility.
3. If removing this Hit would change the damage status, roll a die. Result of 5+ confirms the status change. On 1-4, the action is wasted (the Hit is still removed but the status does not improve).
   {{PA-BLOCK: pa6:facility-damage — Facility Damage · Effects cumulative}}
4. See (2.3.8.4) for the effects of facility damage on hosted units.

## See also

- [De-Mine a Port](./act-misc-demine-port.md)
- Related rules: (5.4.1), (2.3.8.4), (2.3.8.5)

## Why and what to watch for

Repair lets you spend 2 OPS to take a Hit off a damaged facility (5.4.1). The design intent is to give you a tempo of recovery against bombing campaigns, a damaged airbase, port, or combined facility can be partially restored over multiple turns, but never instantly. The 5+ status-change roll models the fact that going from Heavy to Light or from Light to fully Undamaged requires actual repair-crew work, not just paperwork.

Take this when the damage status (not raw hit count) is what's hurting you. Light port damage adds +1 hit to arriving convoys/amphs and doubles sub OPS cost moving out of that port; heavy port damage adds +2 hits to convoys and tacks on +1 OPS to form a TF there (2.3.8.4). Light airbase damage halts all flying and forces On-Patrol units home Spent; heavy airbase damage reduces every CAP roll to 1 die per unit and prevents Spent markers from clearing at turn end (2.3.8.4). The first repair on a heavily damaged base, the one with a chance of dropping it to Light, is enormously more valuable than later cosmetic hit removals.

The gotcha is the 5+ roll. If you spend 2 OPS to remove the Hit that would change the damage status (from Heavy to Light, or from Light to Undamaged), you roll a die: 5+ confirms the status change, 1-4 wastes the action, the Hit is still removed but the status stays at the current level (5.4.1). So always check whether removing this Hit crosses a status threshold; if it does, you're gambling 2 OPS on a 60% chance of the real benefit. Hits below the status threshold are guaranteed removal but only count as facility cosmetic damage.

This pairs with [De-Mine a Port](./act-misc-demine-port.md) when a port is both mined and damaged, note de-mine rolls go from 5+ (undamaged) to 7+ (damaged), so repair first to make later de-mine cheaper. Counter: the opponent re-bombs the facility to put hits back on faster than you can repair.

Example: Iceland's Keflavik is Heavy damaged (3 hits). NATO spends 2 OPS on Repair, removes one Hit (now 2 hits), and rolls a 6, status drops Heavy → Light. CAP next turn returns to printed dice instead of 1 die per unit. Next turn NATO spends another 2 OPS and rolls a 3, Hit removed but stays Light (the 2nd hit-removal didn't cross the status threshold but it was still wasted on the roll). Third repair attempt rolls a 7 and Keflavik returns to Undamaged.
