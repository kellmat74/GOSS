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
   {{PA-BLOCK: pa4:missile-attacks-on-tfs — Missile Attacks on TFs}}
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

<!-- COACH-PASS -->
