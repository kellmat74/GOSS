---
id: act-ship-fire-missiles
title: Fire missiles with a Task Force
category: ship-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "5.1.1.3"
  - "7.4"
  - "7.4.1.2"
  - "7.4.2"
seeAlso:
  - act-sub-missile-3-zones
  - act-sub-missile-coordination
  - act-air-strike
---

## When does this come up?

When a Task Force wants to attack a detected enemy TF with its ship-launched anti-ship missiles. White, red, and NATO blue ship-launched missiles do not use this action — those go only via card play (5.1.1.3). This is the action for the Soviet black 'Sandbox' and yellow 'Shipwreck' weapons firing.

## Procedure

1. Spend 1 OPS and declare the attacking TF and the target TF, which must be in the same Sea Zone (7.4.1.2).
2. Resolve launch eligibility by missile color and detection level (7.4.1.2):
   - Soviet yellow/black: fire vs NATO Good-detected TF in same zone, or vs Poor-detected if the Soviet TF is Fast (or 6+).
   - Soviet white/red: card play only (Baltic exception applies).
   {{PA-BLOCK: pa4:missile-attacks-on-tfs-vs-task-forces — Missile Attacks on TFs}}
3. Defender resolves SAMs — count SAM points, apply the SAM-shots-allowed limit based on incoming missile count, then roll one die per SAM with DRMs (missile color, weather, etc.) (7.4.2.1).
   {{PA-BLOCK: pa4:sam-resolution — SAM Resolution}}
4. Resolve any remaining missiles: roll one die per 2 missiles, plus one for a remaining single (7.4.2.2).
   {{PA-BLOCK: pa4:incoming-missile-resolution — Incoming Missile Resolution}}
5. Allocate hits using the hit-selection sequence (N9/N10 first by attacker, then alternating per side's allocation cadence) (7.4.2).
   {{PA-BLOCK: pa4:missile-hit-selection — Missile Hit Selection}}
6. Apply hit effects: non-capital ships take one step loss per hit; Amphibs and Convoys take two hits per hit; capital ships roll on the damage table (7.4.2.3).
   {{PA-BLOCK: pa4:capital-ship-damage — Capital Ship Damage}}
7. Mark expended ammunition: ships with (L) cruise/anti-ship missiles get a 'Cruise Missiles Fired' or 'AntiShip Missiles Fired' marker (9.5.3, 9.5.4).

## See also

- [Nuclear submarine missile attack](./act-sub-missile-3-zones.md)
- [Multi-submarine missile coordination](./act-sub-missile-coordination.md)
- [Air Strike](./act-air-strike.md)
- Related rules: (5.1.1.3), (7.4), (7.4.1.2), (7.4.2), (7.4.2.4)

## Why and what to watch for

Surface-launched anti-ship missiles model the Soviet doctrine of long-range, mass-saturation strikes from cruisers and destroyers. The Cold War threat that kept US carrier captains awake was a Kirov-led surface action group ripple-firing yellow Shipwrecks and black Sandboxes. This action is the in-game expression of that doctrine, and the OPS-cost-1 trigger reflects that surface missile launches are routine combat events for the Soviet side, not card-driven specials (5.1.1.3, 7.4).

Take this action when you have a Good-detected NATO TF in the same Sea Zone as a Soviet TF carrying yellow or black missiles (7.4.1.2). Poor detection works too, but only if the firing TF is Fast (or has 6+ ASuW). Save the action for when you can stack hits: more missiles in one launch means a worse SAM ratio for the defender because SAM shots scale slower than incoming missile count (7.4.2.1).

The most-missed rule is that white, red, and NATO blue ship-launched missiles are card-only (5.1.1.3), except for the Baltic exception where one ship may fire with NATO blue or Soviet white/red. Players reach for a Soviet white missile and reflexively spend 1 OPS, but those launches require the matching Soviet-1 / Townsend card. Second: hit allocation. N9 and N10 hits go first by attacker (the launching player), then NATO allocates every 2nd hit and Soviets every 3rd (7.4.2). New Soviet players forget that the slower allocation cadence is a real disadvantage unless Missile Technology is unlocked. Third: ammunition. The Cruise Missiles Fired / AntiShip Missiles Fired markers (9.5.3, 9.5.4) are permanent for the turn, so plan reload via port returns.

Pair with [Multi-submarine missile coordination](./act-sub-missile-coordination.md) or [Nuclear submarine missile attack](./act-sub-missile-3-zones.md) for a layered strike. NATO defends with F-14s, SAM-heavy TFs, and CAP.

A Soviet TF with Kirov and three Sovremennys sits in North 7-8 with a Good-detected NATO carrier TF. 1 OPS launches 12 yellow Shipwrecks. NATO gets 13 SAM shots, knocks down 6, the remaining 6 roll 3 dice and score 4 hits, two go to the carrier as N9 attacker-allocated capital ship damage rolls.
