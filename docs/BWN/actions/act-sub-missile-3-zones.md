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
2. Roll 1 die (2 dice if Good Detection — use best). Apply DRMs (-2 if diesel attacker vs Fast TF; -2 per additional coordinating sub per 5.2.4). Look up result for No Attack / Long Range / Short Range / Short Range + Torpedo.
   {{PA-BLOCK: pa3:submarine-launched-missiles-vs-task-force — Submarine Launched Missiles vs. Task Force}}
3. Defender resolves SAMs against the incoming missiles (7.4.2.1).
   {{PA-BLOCK: pa4:sam-resolution — SAM Resolution}}
4. Resolve any remaining missiles (roll one die per 2 missiles, plus one for a remaining single) (7.4.2.2).
   {{PA-BLOCK: pa4:incoming-missile-resolution — Incoming Missile Resolution}}
5. Allocate hits using the hit-selection sequence (N9/N10 first by attacker, then alternating per side's cadence).
   {{PA-BLOCK: pa4:missile-hit-selection — Missile Hit Selection}}
6. Apply hit effects: non-capital ships one step per hit; Amphibs/Convoys two hits per hit; capital ships roll on the damage table (7.4.2.3).
   {{PA-BLOCK: pa4:capital-ship-damage — Capital Ship Damage}}
7. On a 10+ result, also resolve a 7.3 torpedo attack from the same submarine immediately afterwards.
8. Mark the sub 'Spent' and apply 'Cruise Missiles Fired' marker if applicable (9.5.3).

## See also

- [Multi-submarine missile coordination](./act-sub-missile-coordination.md)
- [Fire missiles with a Task Force](./act-ship-fire-missiles.md)
- [Submarine moves then attacks](./act-sub-attack.md)
- Related rules: (5.2.1), (7.4), (7.4.1.1), (7.4.2), (5.2.4)

## Why and what to watch for

<!-- COACH-PASS -->
