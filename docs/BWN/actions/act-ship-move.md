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

## Why and what to watch for

<!-- COACH-PASS -->
