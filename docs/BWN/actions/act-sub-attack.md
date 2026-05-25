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
3. Announce the target TF (must be detected) and calculate dice using the submarine's Anti-Surface value plus modifiers (Good Detection +1 die, Bad Weather -1 die, Fast target -1 die or -2 if diesel attacker).
   {{PA-BLOCK: pa3:submarine-vs-task-force — Submarine vs. Task Force (DRMs)}}
4. Roll the dice, adding the submarine's Tactical Value. Apply (T) super-heavy torpedo row shifts. Look up results on the attack table.
   {{PA-BLOCK: pa3:submarine-attack-results — Submarine Attack Results}}
5. If no hits, combat ends — the sub failed to contact. Otherwise, set the hit dice aside and proceed.
6. **Escort submarine handling**: dice high enough to kill an escort sub may be spent now to do so (escort still gets save rolls). Then, if the attacking sub rolled a double and has SSM capability, it may launch a missile attack — all US/UK nuclear subs and (with Torpedo Technology) Soviet nuclear subs qualify.
7. Calculate the TF's ASW total from its component units (each ship's ASW value, +2 per carrier (0 in Bad Weather), each MP On Patrol's ASW value, escort sub ASW ×3).
   {{PA-BLOCK: pa3:task-force-asw — Task Force ASW (per-unit values)}}
8. Look up the ASW total to get dice + Tactical Value. Move up one row in Bad Weather; move up one row if TF is Fast (7.3.1).
   {{PA-BLOCK: pa3:task-force-asw-defense — Task Force ASW Defense (total + dice table)}}
9. Roll TF ASW dice. Each die ≥ submarine's Defense value causes a step loss; (N) subs only die on a natural 10. Apply rocket torpedo special (TF may swap a double to an '8' if any ship has (R) and not Bad Weather).
10. For each TF ASW die ≥ 8, the TF may select and discard one of the submarine's hit dice — denying the hit (7.3.1 step 9).
11. Resolve remaining submarine hits: triage each by target type, then apply step loss / capital-ship damage roll as appropriate.
    {{PA-BLOCK: pa3:effects-of-hits-by-submarines — Effects of hits by Submarines}}
    {{PA-BLOCK: pa3:hit-results — Hit Results (allocation rules)}}
12. Capital-ship hits roll on the damage table. UK Illustrious carriers also get an 8+ save against any torpedo hit (7.3.3).
    {{PA-BLOCK: pa4:capital-ship-damage — Capital Ship Damage}}
13. Mark the submarine 'Spent'.

## See also

- [Submarine attacks then moves](./act-sub-attack-then-move.md)
- [Nuclear submarine missile attack](./act-sub-missile-3-zones.md)
- [Submarine moves and detects](./act-sub-detect.md)
- Related rules: (5.2.1), (7.3), (7.3.1), (7.3.2), (7.3.3)

## Coach

Set up Good Detection before launching, it is worth +1 die (7.3.1). Diesels against Fast TFs eat -2 dice; only nuclear boats should chase Fast strike groups. TF ASW dice rolling 8+ each cancel one of your hit dice, and N10 is the only way to sink a capital ship outright via the damage table (7.3.2). Non-Magnetic subs die only on a natural 10.

## Why and what to watch for

The torpedo attack is the iconic submarine engagement and the centerpiece of BWN's sub-vs-TF model. A boat moves quietly into firing range and shoots, then absorbs the defender's frantic ASW counter-search (7.3, 7.3.1). The two-stage resolution (sub rolls anti-surface first, defender responds with ASW) reproduces the actual sequence of a Cold War torpedo engagement: the attack reveals the attacker, and the screen reacts.

Take this action when an enemy TF is detected (Poor or Good is required, since torpedo attacks need a known target) and your sub can reach. Good Detection is worth +1 die and is almost always worth setting up first via MP, RORSAT, or [Submarine moves and detects](./act-sub-detect.md). The math heavily favors attacking Slow TFs because a Fast target is -1 die, and a diesel sub vs Fast TF eats -2 dice (7.3.1). Diesels should attack Slow Convoys and damaged carriers; nuclear boats can chase Fast strike groups.

The doubles mechanic is where players miss damage. If the attacking sub rolls a double 1-6, US and UK nuclear boats (and Soviets with Torpedo Technology) may immediately resolve it as a hit. A double 7-10 resolves as PM/Amph/Convoy. Separately, if the sub has SSM capability and rolled a double, it may also launch a missile attack: this stacks on top of the torpedo damage. Second gotcha: rocket torpedoes (R) on the TF let the defender swap a double to an 8 (and discard the other) outside Bad Weather (7.3.1). Third: Non-Magnetic (N) subs die only on a natural 10 (N10), and saved (white circle Defense) subs ignore hits on a 6+. Fourth: TF ASW dice rolling 8+ may discard one of the sub's hit dice each, so a Good ASW screen erases damage even after the attack lands. Fifth: the N10 capital ship rule (7.3.2) means a single N10 hit on a Carrier or Big/Huge Target triggers a damage roll, not an automatic step loss.

This action's sibling is [Submarine attacks then moves](./act-sub-attack-then-move.md), useful when you start the turn already in the target zone. Pair with [Submarine moves and detects](./act-sub-detect.md) to upgrade detection first. Defender counters with [On-Patrol MP attacks a crossing submarine](./act-anytime-mp-vs-sub.md) and [Hydrophone Barrier reaction](./act-anytime-hydrophone.md).

A Soviet Akula spends 1 OPS, crosses the GIUK barrier (no reaction), enters Mid 7-8 where a Good-detected NATO carrier TF sits. Anti-Surface 3 +1 (Good) = 4 dice, rolls 8, 8, 6, double 8s. The double resolves as PM/Amph/Convoy, plus a missile attack if the Akula has SSMs. NATO's 12 ASW total gives 3 dice + 1 Tactical, rolls a 9 and discards one of the hit dice, then the remaining hits resolve.
