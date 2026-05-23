---
id: act-ship-asw
title: ASW in current zone (instead of moving)
category: ship-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "7.2"
  - "7.2.2"
  - "7.2.2.1"
seeAlso:
  - act-anytime-sub-asw-vs-tf
  - act-anytime-mp-vs-sub
  - act-anytime-hydrophone
---

## When does this come up?

A Task Force that wants to hunt a known submarine in its zone — instead of moving this beat — spends 1 OPS to roll ASW dice from its component ships (7.2.2). Doing so is loud: the TF is auto-marked with at least a Poor Detection and may even upgrade itself to Good Detection (7.2.2.1).

## Procedure

1. Spend 1 OPS and declare the TF is conducting ASW in its current zone (7.2.2). Mark the TF with a Poor Detection marker immediately (7.2.2.1).
2. Per-ship ASW values: tally each ship's Anti-Submarine value, +2 per carrier (0 in Bad Weather), +ASW per On-Patrol MP in zone, and ASW ×3 for any escorting submarine.
   {{PA-BLOCK: pa3:task-force-asw — Task Force ASW (per-unit values)}}
3. Compute the ASW total and look up dice + Tactical Value. Move up one row in Bad Weather (Fast modifier is **ignored** for the ASW-instead-of-moving action per 7.2.2).
   {{PA-BLOCK: pa3:task-force-asw-defense — Task Force ASW Defense (total + dice table)}}
4. Apply the TF-search rules: rocket torpedoes kill on doubles <10; Non-Magnetic subs killed on N10 only; if you roll any two N1-2 results, upgrade your TF to Good detection (instead of Poor) (7.2.2.1).
   {{PA-BLOCK: pa3:anti-submarine-warfare-by-task-forces — Anti-Submarine Warfare by Task Forces}}
5. Resolve hits per the standard ASW procedure (Tactical Value to each die, kill threshold = sub Defense value, N1 Bastion / N10 / save sub effects) (7.2.1).
   {{PA-BLOCK: pa3:anti-submarine-warfare — Anti-Submarine Warfare (die roll table + DRMs)}}
6. The defender allocates non-N10 hits, then the attacker allocates remaining. Apply 'save' rolls for submarines that have them (6+ save).

## See also

- [On-Patrol Submarine ASW vs moving TF](./act-anytime-sub-asw-vs-tf.md)
- [On-Patrol MP attacks a crossing submarine](./act-anytime-mp-vs-sub.md)
- [Hydrophone Barrier reaction](./act-anytime-hydrophone.md)
- Related rules: (7.2), (7.2.1), (7.2.2), (7.2.2.1)

## Why and what to watch for

<!-- COACH-PASS -->
