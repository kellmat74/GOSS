---
id: act-sub-attack
title: Submarine moves then attacks a Task Force
category: sub-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "5.2.1"
  - "7.3"
  - "7.3.1"
  - "7.3.2"
seeAlso:
  - act-sub-attack-then-move
  - act-sub-missile-3-zones
  - act-sub-detect
---

## When does this come up?

A submarine moves into a Sea Zone containing a detected enemy TF and resolves a torpedo attack against it (5.2.1, 7.3). The target TF must already be detected — Poor or Good — since submarine torpedo attacks need a known TF to engage.

## Procedure

1. Spend 1 OPS and select one Fresh submarine.
2. Move the submarine into the target TF's zone using its normal movement allowance (5.2.2). Resolve any Hydrophone Barrier reactions on crossing (2.3.6).
3. Announce the target TF (must be detected) and calculate dice using the submarine's Anti-Surface value plus modifiers (+1 die for Good Detection, -1 for Bad Weather, -1 for Fast TF, -2 if diesel attacker vs Fast TF) (7.3.1).
   {{PA-BLOCK: ??? — Submarine vs TF die modifiers}}
4. Roll the dice, adding the submarine's Tactical Value. Apply (T) super-heavy torpedo upgrades if applicable.
   {{PA-BLOCK: ??? — Submarine vs TF attack results table}}
5. If no hits, combat ends — the sub failed to contact. Otherwise, set the hit dice aside and proceed.
6. **Escort submarine handling**: dice high enough to kill an escort sub may be spent now to do so (escort still gets save rolls). Then, if the attacking sub rolled a double and has SSM capability, it may launch a missile attack — all US/UK nuclear subs and (with Torpedo Technology) Soviet nuclear subs qualify.
7. Calculate the TF's ASW total: each ship's ASW value + escort sub ×3 + each carrier +2 (0 in Bad Weather) + each MP On Patrol's ASW value (1 in Bad Weather) (7.3.1).
   {{PA-BLOCK: ??? — Task Force ASW total table}}
8. Look up the TF's ASW dice + Tactical Value. Move up one row in Bad Weather; move up one row if TF is Fast.
   {{PA-BLOCK: ??? — TF ASW dice table}}
9. Roll TF ASW dice. Each die ≥ submarine's Defense value causes a step loss; (N) subs only die on a natural 10. Apply rocket torpedo special (TF may swap a double to an '8' if any ship has (R) and not Bad Weather).
10. For each TF ASW die ≥ 8, the TF may select and discard one of the submarine's hit dice — denying the hit (7.3.1 step 9).
11. Resolve remaining submarine hits: 'Hit' → step loss on a non-PM non-capital ship; 'PM/Amph/Convoy Hit' → any non-capital (or capital if only those remain); N10 → any target (this is how you sink capitals).
    {{PA-BLOCK: ??? — Effects of hits by Submarines}}
12. Apply step losses. UK Illustrious carriers have an 8+ save against any torpedo hit (7.3.3).
13. Mark the submarine 'Spent'.

## See also

- [Submarine attacks then moves](./act-sub-attack-then-move.md)
- [Nuclear submarine missile attack](./act-sub-missile-3-zones.md)
- [Submarine moves and detects](./act-sub-detect.md)
- Related rules: (5.2.1), (7.3), (7.3.1), (7.3.2), (7.3.3)

## Why and what to watch for

<!-- COACH-PASS -->
