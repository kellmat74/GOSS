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

Submarine-launched cruise and anti-ship missiles model the SLCM and SSM weapons that put Soviet SSGNs and some NATO SSNs in the strike role. The single-zone range rule (7.4.1.1) reflects the design choice that BWN treats missile reach as movement-equivalent: the sub must close to the target's Sea Zone to fire, rather than ranging from adjacent. The launch-roll-then-resolve sequence captures the real uncertainty of an undersea cruise launch: target solution quality drives outcome.

Take this action when a nuclear sub sits in the target TF's zone and you want a missile strike rather than a torpedo run, or when the sub is positioned to attack a land facility (7.5). The launch roll is the key choice: 1 die normally, 2 dice if Good Detection (use best). That asymmetry means upgrading the target to Good before launch is huge, going from a 70% chance of any attack to a 91% chance with two dice taking the best result.

The DRM stack is where new players lose damage. -2 if a diesel sub is shooting a Fast TF (matters for older Soviet diesel SSGs); -2 per additional coordinating sub from 5.2.4 (so a 2-sub coordination is -2, a 3-sub coordination is -4 on the launch roll). Charlie II missiles have a designer note allowing "no attack" on what would normally be a Long Range result, modeling the older Charlie's narrower target solution: optional rule, check your version. Second gotcha: a 10+ result triggers a torpedo attack from the same submarine afterwards (7.3) on top of the missile damage. This is a meaningful upside on Short Range + Torpedo and one of the best things that can happen to a sub player. Third: the Cruise Missiles Fired marker (9.5.3) lasts the turn, so plan to return to port for reload.

The sibling action is [Multi-submarine missile coordination](./act-sub-missile-coordination.md) when two or three subs pool a strike. [Fire missiles with a Task Force](./act-ship-fire-missiles.md) covers the surface-launched parallel. Defender uses SAMs, F-14s, and CAP.

A Soviet Oscar II in Good-detected position vs a NATO carrier TF in Mid 7-8 spends 1 OPS. Two dice, take the best: rolls 4 and 9, takes the 9 for Short Range. The Oscar's full payload of 24 Shipwrecks goes in, NATO's SAMs take a -2 DRM (red/yellow incoming), 8 hits land on the screen and the carrier rolls a damage check.
