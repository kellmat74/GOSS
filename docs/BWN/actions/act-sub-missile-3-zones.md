---
id: act-sub-missile-3-zones
title: Nuclear submarine missile attack
category: sub-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "5.2.1"
  - "7.4"
  - "7.4.1.1"
  - "7.4.2"
seeAlso:
  - act-sub-missile-coordination
  - act-ship-fire-missiles
  - act-sub-attack
---

## When does this come up?

A nuclear submarine launches a missile attack against a TF (7.4) or a land facility (7.5) in its current zone. Per 7.4.1.1, submarine-launched missile attacks require the attacker to be in the same zone as the target — range is expressed by movement, not by the missile's reach.

## Procedure

1. Spend 1 OPS and select one Fresh nuclear submarine in the target's Sea Zone.
2. Roll one die and apply modifiers (+1 die for Good Detection on the target TF; -2 DRM if diesel attacker and target TF is Fast; -2 DRM per additional sub for coordinated attacks per 5.2.4).
   {{PA-BLOCK: ??? — Submarine launched missile modifiers}}
3. Look up the result on the missile attack type table:
   - 1-3: No attack — sub marked Spent, no ammo expended.
   - 4-7: Long Range — resolve missile attack with full count.
   - 8-9: Short Range — resolve a short-range missile attack.
   - 10+: Short Range + Torpedo — also resolve a 7.3 torpedo attack immediately afterwards if desired.
   {{PA-BLOCK: ??? — Sub launched missile attack types}}
4. Count missile points being fired, place the Missiles marker on the Missiles Track using the correct color(s) (7.4.2).
   {{PA-BLOCK: ??? — Missiles Track / incoming missile types}}
5. Defender resolves SAMs (7.4.2.1).
   {{PA-BLOCK: ??? — SAM resolution table}}
6. Resolve remaining missile dice (7.4.2.2).
   {{PA-BLOCK: ??? — Incoming missile resolution table}}
7. Apply hit effects: non-capital ships one step per hit; Amphibs/Convoys two hits per hit; capital ships roll on the damage table (7.4.2.3).
   {{PA-BLOCK: ??? — Capital ship damage table}}
8. Mark the sub 'Spent' and apply 'Cruise Missiles Fired' marker if applicable (9.5.3).

## See also

- [Multi-submarine missile coordination](./act-sub-missile-coordination.md)
- [Fire missiles with a Task Force](./act-ship-fire-missiles.md)
- [Submarine moves then attacks](./act-sub-attack.md)
- Related rules: (5.2.1), (7.4), (7.4.1.1), (7.4.2), (5.2.4)

## Why and what to watch for

<!-- COACH-PASS -->
