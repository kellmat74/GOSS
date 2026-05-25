---
id: act-ship-move
title: Move ships in a Task Force
category: ship-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "5.1.3"
  - "4.2.1.3"
  - "5.1.3.1"
  - "5.1.3.6"
seeAlso:
  - act-ship-form-tf
  - act-misc-move-between-tfs
  - act-ship-amphib-land
---

## When does this come up?

Ships only move as a Task Force group, and only when the SHIPS event triggers on the Operations Points Record Track (4.2.1.3). When the SHIPS event fires, both sides move every Task Force per the movement rules (5.1.3) — this is the main repositioning beat of the turn.

## Procedure

1. Wait for the SHIPS event to be triggered on the OPS track (4.2.1.3). Both players' OPS markers reaching or passing the SHIPS box fires the event immediately after the current action.
2. Resolve movement in detection order: all Good Detected TFs first, then Poor Detected, then Undetected. Within each category, Soviet moves all TFs before NATO (5.1.3).
   {{PA-BLOCK: pa2:ops-track-events — OPS Track Events (Ships event movement sequence)}}
3. For each TF, move up to one Sea Zone in any direction. TFs starting in Bad Weather zones place a 'Moved' marker instead and skip movement this beat (5.1.3.1).
4. When entering or leaving a port, some or all units may move into the adjacent port instead. Bad Weather is ignored when leaving a port (5.1.3.6).
5. Place the TF counter on the new zone border close to its previous zone, so the opponent can tell where it came from (5.1.3.8).
6. If a TF is marked 'Landing', resolve the Amphibious Landing instead of moving (8.1.1). See the Amphibious Landing action.

## See also

- [Form a new Task Force](./act-ship-form-tf.md)
- [Move ships between Task Forces](./act-misc-move-between-tfs.md)
- [Prepare and resolve an Amphibious Landing](./act-ship-amphib-land.md)
- Related rules: (5.1.3), (4.2.1.3), (5.1.3.1), (5.1.3.6), (5.1.3.7)

## Coach

Manage OPS pace so SHIPS fires when weather and detection favor you, the trigger is bookkeeping but the timing is strategy (4.2.1.3). Good-detected TFs move first, then Poor, then Undetected, and Soviet moves before NATO in each tier (5.1.3), so a detected TF must telegraph its plan first. Bad Weather strands the TF in place with a Moved marker (5.1.3.1).

## Why and what to watch for

BWN deliberately keeps surface movement infrequent and synchronized. Ships do not move on demand the way subs and aircraft do, they only move when the SHIPS event fires on the OPS Track (4.2.1.3). This is the system's way of representing the long signal lag and reaction time of fleet maneuvering compared to the rapid tempo of submarine and air operations.

The trigger is bookkeeping, not a choice. When either player's OPS marker reaches or passes the SHIPS box, the event fires immediately after the current action, and both sides move every TF (5.1.3). The strategic decision is upstream: by managing your OPS expenditure rate, you control when SHIPS fires relative to weather, card play, and the opponent's detection state. A Soviet player burning OPS fast to force an early SHIPS event before NATO gets MPs aloft is a classic opening.

The detection-order rule is the rookie killer (5.1.3). Good-detected TFs move first, then Poor, then Undetected, and within each tier Soviet moves before NATO. That means if NATO has Good detection on a Soviet TF, the Soviets must move it before NATO chooses where to vector its own forces. Bad Weather zones block movement (TF gets a Moved marker but stays put per 5.1.3.1), and forgetting this strands intercepts. Note also that the TF counter goes on the new zone's border adjacent to the previous zone (5.1.3.8), giving the opponent partial track info even on Undetected forces.

This action interlocks with [Form a new Task Force](./act-ship-form-tf.md), [Move ships between Task Forces](./act-misc-move-between-tfs.md), and the Amphibious Landing prep (5.1.3.2). The opponent counters with On-Patrol subs, MPs, and Hydrophone Barrier reactions on crossings.

NATO holds Good detection on a Soviet TF in North 7-8 thanks to a US carrier's MP sweep. SHIPS fires. The Soviet TF must declare its move first (Good-detected, Soviet-before-NATO), revealing intent, and NATO then routes its own TF to intercept or evade.
