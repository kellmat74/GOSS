---
id: act-sub-missile-coordination
title: Multi-submarine missile coordination (2-3 subs)
category: sub-actions
side: neutral
usage: action
cost: 2
ruleRefs:
  - "5.2.4"
  - "7.4"
  - "7.4.1.1"
seeAlso:
  - act-sub-missile-3-zones
  - act-ship-fire-missiles
---

## When does this come up?

Two or three submarines pool a coordinated missile attack against a single Task Force or facility. All subs must move to the same zone and resolve as one attack. Costs 1 OPS per participating submarine (so 2 or 3 total) (5.2.4).

## Procedure

1. Spend 1 OPS per submarine participating (2 or 3 total) and select 2-3 Fresh submarines.
2. Move all participating subs to the same Sea Zone — the target's zone (5.2.4, 7.4.1.1). Resolve any Hydrophone reactions on crossings.
3. Designate one as the primary attacker. The rest contribute missiles and apply a -2 DRM each to the launch roll (5.2.4). Resolve a single launch roll for the combined attack — Long Range / Short Range / Short Range + Torpedo (or no attack).
   {{PA-BLOCK: pa3:submarine-launched-missiles-vs-task-force — Submarine Launched Missiles vs. Task Force}}
4. Add all participating subs' missile counts together for one combined incoming volley. Defender resolves SAMs against it (7.4.2.1).
   {{PA-BLOCK: pa4:sam-resolution — SAM Resolution}}
5. Resolve any remaining missiles (7.4.2.2).
   {{PA-BLOCK: pa4:incoming-missile-resolution — Incoming Missile Resolution}}
6. Allocate hits.
   {{PA-BLOCK: pa4:missile-hit-selection — Missile Hit Selection}}
7. Apply hit effects per 7.4.2.3. Capital ships roll on the damage table.
   {{PA-BLOCK: pa4:capital-ship-damage — Capital Ship Damage}}
8. Mark all participating subs 'Spent' and apply Cruise Missiles Fired markers as needed (9.5.3).

## See also

- [Nuclear submarine missile attack](./act-sub-missile-3-zones.md)
- [Fire missiles with a Task Force](./act-ship-fire-missiles.md)
- Related rules: (5.2.4), (7.4), (7.4.1.1), (9.5.3)

## Coach

Each extra sub past the first applies -2 DRM to the single launch roll (5.2.4), so a 3-sub coordination launches at -4, almost always set up Good Detection first to get the 2-dice-take-best (7.4.1.1). Save coordination for high-value Good-detected carrier targets where one massive volley swamps the SAM screen; SAM shots scale slower than incoming missiles (7.4.2.1). All participating subs end Spent with Cruise Missiles Fired markers (9.5.3).

## Why and what to watch for

Coordinated missile attacks model the Soviet doctrine of pulse-firing multiple SSGN/SSGs simultaneously to saturate a high-value target's SAM defenses. Two or three subs (5.2.4) sortie to the same Sea Zone and fire as one volley, pooling their missile counts into a single resolution that overwhelms even a strong defender. The 1 OPS per participating sub is a real cost (so 2 or 3 OPS total), but the strategic upside is enormous: SAM shots scale slower than incoming missiles, so doubling missiles roughly halves the percentage stopped (7.4.2.1).

Take this action against a Good-detected, high-value target where stacking one massive volley does meaningful damage versus spreading the shots across turns. The canonical target is a NATO carrier TF: each Oscar II carries 24 Shipwrecks, so a 2-Oscar coordination throws 48 missiles into a SAM screen that allows maybe +2 extra SAM shots beyond the missile count. Save coordination for when individual launches would be absorbed by SAMs anyway.

The launch-roll penalty is the trap. Each additional sub past the first applies -2 DRM to the single combined launch roll (5.2.4). A 2-sub coordination launches at -2, a 3-sub coordination at -4. Without Good Detection (which gives the "roll 2, take best" bonus per 7.4.1.1), a 3-sub coordination can easily roll a "No Attack" result and waste 3 OPS plus three subs marked Spent. So this action almost always wants Good Detection set up first by an MP, RORSAT, or detect-action sub. Second gotcha: all participating subs must move to the same Sea Zone in this action's sequence (7.4.1.1), so plan the previous turn's positioning. Third: each sub still applies its Cruise Missiles Fired marker (9.5.3) and is Spent at the end, so a coordination commits a big chunk of your sub force.

Pair with [Submarine moves and detects](./act-sub-detect.md) by a separate detecting sub or MP overflight to bank Good detection first. Counter: NATO defends with F-14 missile screens (yellow missiles -1 per missile on 1-2), high-SAM screen TFs, and CAP.

Soviet Turn 4: two Oscar IIs both in Mid 7-8 with a Good-detected NATO CV TF. 2 OPS, launch roll at -2 DRM with 2 dice take best: rolls 6 and 9, takes 9 for Short Range. 48 Shipwrecks vs NATO's 36 SAM shots, ~24 missiles survive, 12 dice rolled, ~9 hits land. The carrier eats a damage roll plus N9 attacker-allocated hits.
