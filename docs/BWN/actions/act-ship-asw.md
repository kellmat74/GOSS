---
id: act-ship-asw
title: ASW in current zone (instead of moving)
category: ship-actions
side: neutral
usage: action
cost: null
phase: ships
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

A Task Force that wants to hunt a known submarine in its zone may conduct ASW instead of moving during the SHIPS event, rolling ASW dice from its component ships (7.2.2). It costs no OPS; it replaces that TF's move. Doing so is loud: the TF is auto-marked with at least a Poor Detection and may even upgrade itself to Good Detection (7.2.2.1).

## Procedure

1. During the SHIPS event, declare the TF is conducting ASW in its current zone instead of moving (7.2.2). Mark the TF with a Poor Detection marker immediately (7.2.2.1).
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

## Coach

Hunting marks your TF Poor immediately, and rolling any two N1-2 results auto-upgrades you to Good detection (7.2.2.1), so only hunt when killing the sub beats the cost of being seen. The Fast TF row shift is ignored on this action unlike the defensive ASW roll (7.2.2), do not pad your dice by habit. Stack carriers (+2 each, 0 in Bad Weather) and any escort sub at ASW x3.

## Why and what to watch for

A TF that stops moving to actively hunt a submarine is the game's expression of dedicated ASW search operations: sonar pings, MAD runs, distributed sonobuoy patterns. It costs no OPS (it is a SHIPS-event substitution for moving), but the automatic Poor Detection (7.2.2.1) captures the doctrinal reality that hunting subs makes the hunter loud and locatable. You traded mobility and concealment for the chance to kill the threat below you.

Take this action when you know (or strongly suspect via Hydrophone reactions, MP detections, or card events) a hostile submarine is in your zone and the cost of letting it live exceeds the cost of being self-marked Poor. Carriers benefit you here because each adds +2 ASW (0 in Bad Weather), and any escorting sub triples its own ASW value. This is the move when a NATO carrier TF wants to clear a Soviet diesel out of GIUK chokepoints before sending Convoys through.

The Fast TF modifier is **ignored** for this action's ASW dice (7.2.2), unlike the defensive ASW roll against a sub attack (7.3.1) where Fast still moves you up a row. New players move up a row out of habit and get free dice they should not have. Second gotcha: rolling any two N1-2 results upgrades your TF from Poor to **Good** detection (7.2.2.1) instead of just Poor, a real penalty if you are NATO holding the Soviets at arm's length. Third: rocket torpedoes kill on doubles less than 10, but only outside Bad Weather (7.2.2.1). Fourth: Non-Magnetic (N) subs only die on a natural 10.

This action pairs with [On-Patrol MP attacks a crossing submarine](./act-anytime-mp-vs-sub.md) layered on top (the MP's ASW value adds to the TF total) and with [Hydrophone Barrier reaction](./act-anytime-hydrophone.md) earlier in the turn to soften the target. Counter: the Soviet sub goes On Patrol or moves out of the zone before the TF acts.

A NATO carrier TF in Mid 5-6 detects a Soviet Victor III via MP overflight. Carrier (+2), two ASW frigates (3+3), and one On-Patrol P-3C MP (2) totals 10 ASW. That gives 3 dice + 1 Tactical. The roll hits twice but rolls a double 2, auto-upgrading the TF to Good detection: the price of the kill.
