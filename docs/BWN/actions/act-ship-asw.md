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

1. Spend 1 OPS and declare the TF is conducting ASW in its current zone (7.2.2).
2. Mark the TF with a Poor Detection marker immediately (7.2.2.1).
3. Calculate the TF's ASW total from its component ships: each ship adds its Anti-Submarine value; each carrier adds +2 (0 in Bad Weather); each MP On Patrol in zone adds its ASW value; any escorting submarine contributes its ASW value ×3 (7.3.1 table also applies here for the TF total).
   {{PA-BLOCK: ??? — Task Force ASW total table}}
4. Look up the ASW total to determine number of dice + Tactical Value. Move up one row in Bad Weather; move up one row if the TF is Fast (note: ignore the Fast modifier on the ASW total table for this action, per 7.2.2).
   {{PA-BLOCK: ??? — ASW dice and DRMs}}
5. Roll the dice and apply Tactical Value to each. Each die ≥ enemy sub's Defense value causes a step loss. Apply N10 effects and special results (rocket torpedoes, Bastion penalties, etc.) per the ASW procedure (7.2.1).
   {{PA-BLOCK: ??? — ASW natural rolls + DRM table}}
6. The defender allocates non-N10 hits, then the attacker allocates remaining. Apply 'save' rolls for submarines that have them (6+ save).
7. If the TF rolled any two N1 or N2 results during the attack, upgrade its Poor Detection to Good Detection (7.2.2.1).

## See also

- [On-Patrol Submarine ASW vs moving TF](./act-anytime-sub-asw-vs-tf.md)
- [On-Patrol MP attacks a crossing submarine](./act-anytime-mp-vs-sub.md)
- [Hydrophone Barrier reaction](./act-anytime-hydrophone.md)
- Related rules: (7.2), (7.2.1), (7.2.2), (7.2.2.1)

## Why and what to watch for

<!-- COACH-PASS -->
