---
id: act-sub-attack-then-move
title: Submarine attacks then moves
category: sub-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "5.2.1"
  - "7.3"
  - "7.3.1"
seeAlso:
  - act-sub-attack
  - act-sub-on-patrol
---

## When does this come up?

A submarine already in the same zone as a detected enemy TF launches its torpedo attack first, then relocates. Same OPS cost as the move-then-attack variant; the order is the only difference (5.2.1).

## Procedure

1. Spend 1 OPS and select one Fresh submarine already in the target TF's Sea Zone.
2. Resolve the torpedo attack per the standard procedure — declare target, calculate dice from the sub's Anti-Surface value, apply modifiers, roll, resolve TF ASW, then apply hits (7.3.1). See [Submarine moves then attacks](./act-sub-attack.md) for the full step-by-step.
   {{PA-BLOCK: pa3:submarine-vs-task-force — Submarine vs. Task Force (DRMs)}}
   {{PA-BLOCK: pa3:submarine-attack-results — Submarine Attack Results}}
   {{PA-BLOCK: pa3:task-force-asw-defense — Task Force ASW Defense}}
   {{PA-BLOCK: pa3:effects-of-hits-by-submarines — Effects of hits by Submarines}}
3. After combat resolves, move the submarine using its normal movement allowance (5.2.2). Cross-zone Hydrophone Barrier reactions still apply (2.3.6).
4. Mark the submarine 'Spent'.

## See also

- [Submarine moves then attacks a TF](./act-sub-attack.md)
- [Submarine moves and goes On Patrol](./act-sub-on-patrol.md)
- Related rules: (5.2.1), (7.3), (7.3.1), (5.2.2), (2.3.6)

## Coach

Use this when you start the turn in the target zone and expect a strong ASW reaction next turn, the post-attack move lets you clear out before the counter-search lands. Combat math is identical to move-then-attack (7.3.1), no extra range or dice. The post-attack move still respects Hydrophone Barriers and movement allowance (5.2.2, 2.3.6), so a diesel only crawls one zone away after firing.

## Why and what to watch for

The attack-then-move action exists so a submarine already sitting in the same zone as a detected enemy TF can shoot first and relocate afterwards, modeling the classic post-attack evasion: torpedo away, then run silent to a new operating area before the counter-search lands. Same OPS cost as the move-then-attack variant (5.2.1), but the sequencing matters because moving after the attack lets the sub clear the zone before the next enemy turn opens.

Take this action when you start the turn already in the target zone (often because you went On Patrol there previously, or because a prior detect-then-move ended you here without firing). It is the right call when you expect strong enemy ASW reaction next turn and want to be elsewhere when it arrives. It also lets you trigger a Hydrophone Barrier crossing **after** combat, which can be useful when you want to absorb the barrier reaction with the protection of a still-fresh sub rather than a battered one.

The combat math is identical to [Submarine moves then attacks](./act-sub-attack.md): same Good Detection +1 die, same Fast TF -1 (or -2 for diesel), same doubles for missile/hit upgrades, same TF ASW counter-roll (7.3.1). The single difference is timing of post-combat movement. New players sometimes assume this action gives extra range or extra dice; it does not. The other gotcha is forgetting that the post-attack move still respects Hydrophone Barriers and the sub's normal movement allowance (5.2.2), so a diesel can only crawl one zone away after firing.

Pair with [Submarine moves and goes On Patrol](./act-sub-on-patrol.md) the previous turn to pre-position. Counter is the same as the move-then-attack: defender layers TF ASW + On-Patrol MP + Hydrophone reactions on whatever zone the sub flees into.

A NATO Trafalgar SSN sits On Patrol in North 7-8 from last turn. A Good-detected Soviet TF enters the zone but the NATO player elects not to react. This turn, NATO spends 1 OPS: attack-then-move. Anti-Surface 3 +1 (Good) = 4 dice, scores hits, then the Trafalgar slips into Mid 9-10 before Soviet MPs can search North 7-8 next turn.
