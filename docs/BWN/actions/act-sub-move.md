---
id: act-sub-move
title: Submarine move
category: sub-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "5.2"
  - "5.2.1"
  - "5.2.2"
seeAlso:
  - act-sub-attack
  - act-sub-detect
  - act-sub-on-patrol
  - act-sub-ssbn-escort
---

## When does this come up?

Repositioning a single fresh submarine. Submarine actions all cost 1 OPS unless specified and use a single submarine that must be fresh (5.2). A submarine that takes an action is marked 'Spent' (or 'On Patrol' if it took the patrol action) for the rest of the turn.

## Procedure

1. Spend 1 OPS and select one Fresh submarine.
2. Move the submarine according to its type:
   - Diesel (D): 1 zone only, no Fast move (5.2.2).
   - Small slow Diesel (S): 1 zone only.
   - Nuclear-powered: 2 zones, or 3 zones via a Fast move (5.2.1).
   {{PA-BLOCK: pa2:submarines — Submarines (action menu + movement allowances)}}
3. A moving Soviet SSBN may take one non-diesel submarine with it for no extra cost. Both are marked 'Spent'. See [Soviet SSBN takes a nuclear sub along](./act-sub-ssbn-escort.md) (5.2.2, 2.2.7.1).
4. If the submarine crosses a Hydrophone Barrier, the opposing player may resolve a Hydrophone reaction (2.3.6). See [Hydrophone Barrier reaction](./act-anytime-hydrophone.md).
5. After movement, mark the submarine 'Spent'.

## See also

- [Submarine moves then attacks a TF](./act-sub-attack.md)
- [Submarine moves and detects](./act-sub-detect.md)
- [Submarine moves and goes On Patrol](./act-sub-on-patrol.md)
- [Soviet SSBN takes a nuclear sub along](./act-sub-ssbn-escort.md)
- Related rules: (5.2), (5.2.1), (5.2.2), (2.3.6), (2.2.7.1)

## Why and what to watch for

Submarines are the heart of BWN combat, and the bare move action is the building block of every sub campaign. A 1 OPS reposition models a submarine running quiet from one operating area to another, with movement allowances calibrated to capture the real difference between nuclear and diesel propulsion: nuclear runs at sustained speed for days, diesels crawl while submerged (5.2, 5.2.1, 5.2.2).

Take a bare move action when the sub needs to get somewhere but neither attack nor patrol fits the current zone. Common cases: a Soviet diesel sortieing from the Baltic to Mid 7-8 over multiple turns; a NATO SSN moving from Holy Loch into the GIUK gap to set up next turn's On Patrol; an SSBN repositioning into a First Strike zone. Save the Fast move (3 zones for nuclear) for when you genuinely need the reach because Fast moves are typically more detectable downstream via reaction events.

The most common mistake is forgetting Hydrophone Barriers (2.3.6). Crossing one triggers a possible reaction roll by the opponent. NATO's CAESAR-style chains in the GIUK gap and Soviet SOSUS-equivalent arrays in the Bastion catch unwary subs. Second: diesel (D) subs only move 1 zone and cannot Fast-move (5.2.2), so plotting a multi-turn diesel sortie requires patience. Third: small-and-slow (S) subs are even more restricted, and their MOVE-OR-ATTACK rule means a sortie burns one of those choices. Fourth: a moving Soviet SSBN may take one non-diesel attack sub along for no extra cost (5.2.2, 2.2.7.1), which is almost always worth doing because of the SSBN evasion escort rule (2.3.5.1).

Pairs with [Submarine moves and detects](./act-sub-detect.md) (use detect when the destination has an enemy you want to upgrade), [Submarine moves and goes On Patrol](./act-sub-on-patrol.md) (use Patrol when the destination is a chokepoint), and [Soviet SSBN takes a nuclear sub along](./act-sub-ssbn-escort.md). Opponents counter with on-patrol MPs at barrier crossings.

A NATO Los Angeles-class spends 1 OPS to move from Holy Loch into North 5-6, crossing the Iceland-Faroes Hydrophone Barrier. The Soviet player rolls the barrier reaction, gets a 3, and places a Poor detection on the sub: future Soviet attacks against it will get +1 die.
