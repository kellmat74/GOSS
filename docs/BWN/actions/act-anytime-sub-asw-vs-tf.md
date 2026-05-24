---
id: act-anytime-sub-asw-vs-tf
title: On-Patrol Submarine ASW vs moving TF
category: sub-actions
side: neutral
usage: anytime
cost: null
ruleRefs:
  - "4.2.3.2"
  - "5.2.3"
  - "7.2"
  - "7.3"
seeAlso:
  - act-sub-on-patrol
  - act-ship-asw
  - act-anytime-mp-vs-sub
---

## When does this come up?

An enemy Task Force moves into a Sea Zone where you have a submarine On Patrol. The on-patrol sub can interrupt and attack the moving TF (5.2.3). The attack uses the standard 7.3 sub-vs-TF torpedo procedure.

## Procedure

1. An enemy TF moves into your On-Patrol sub's zone. Declare the reaction (5.2.3, 4.2.3.2).
2. Calculate dice from the sub's Anti-Surface value plus modifiers (Good Detection +1 die, Bad Weather -1, Fast target -1 or -2 if diesel).
   {{PA-BLOCK: pa3:submarine-vs-task-force — Submarine vs. Task Force (DRMs)}}
3. Roll attack dice, apply Tactical Value, and look up results.
   {{PA-BLOCK: pa3:submarine-attack-results — Submarine Attack Results}}
4. If hits scored, calculate TF ASW total from its component units, then resolve the TF's defensive ASW roll.
   {{PA-BLOCK: pa3:task-force-asw — Task Force ASW (per-unit values)}}
   {{PA-BLOCK: pa3:task-force-asw-defense — Task Force ASW Defense (total + dice table)}}
5. Apply remaining hits.
   {{PA-BLOCK: pa3:effects-of-hits-by-submarines — Effects of hits by Submarines}}
   {{PA-BLOCK: pa3:hit-results — Hit Results (allocation rules)}}
6. Capital ships roll on the damage table.
   {{PA-BLOCK: pa4:capital-ship-damage — Capital Ship Damage}}
7. The On-Patrol sub remains On Patrol unless the rules of the specific attack flip it (per 5.2.3, On Patrol units are not Spent by reacting unless the reaction text says so).

## See also

- [Submarine moves and goes On Patrol](./act-sub-on-patrol.md)
- [ASW in current zone (instead of moving)](./act-ship-asw.md)
- [On-Patrol MP attacks a crossing submarine](./act-anytime-mp-vs-sub.md)
- Related rules: (4.2.3.2), (5.2.3), (7.2), (7.3), (7.3.1)

## Why and what to watch for

An On-Patrol submarine reacting to an enemy TF crossing into its zone is the in-game expression of every Cold War submarine-vs-surface engagement that mattered: the boat sat silent, the target group steamed through, the boat fired. The reaction is free in OPS terms because the on-patrol stance was already paid for when the sub went On Patrol (5.2.3, 4.2.3.2), and the reaction uses the standard 7.3 sub-vs-TF combat procedure. The action is BWN's punishment for routing a TF through a known submarine zone.

Take this reaction whenever an enemy TF moves into your On-Patrol sub's zone and the math looks favorable: Good Detection gives +1 die, Bad Weather -1, Fast target -1 (or -2 if diesel attacker). On-Patrol subs are not Spent by reacting unless the reaction text says so (5.2.3), so a high Anti-Surface boat can react to multiple TF crossings in one turn. This is why On-Patrol nuclear subs in chokepoints are devastating: they get repeated free attacks.

The most common confusion is whether to react with this sub or wait for a better target. Only one On-Patrol unit per zone may react against a given moving unit (5.2.3), so a second crossing this turn might be a higher-value target (the carrier TF instead of the screening Convoy TF). If you have one On-Patrol sub, hold fire on the first TF if you can see a juicier second one coming. Second: the TF still gets its full ASW defense roll just like a normal sub-vs-TF combat (7.3.1), with Fast TF moving up one row, Bad Weather moving up one row, rocket torpedo swaps on doubles, 8+ dice discarding the sub's hits. Third: Hydrophone Barriers do not retrigger here because the TF, not the sub, is moving (the TF crossing a Hydrophone Barrier into the zone does trigger a separate Hydrophone reaction first, but that is a different action). Fourth: if the sub takes hits during the TF's ASW defense, those apply now, not at end of turn.

This pairs with [Hydrophone Barrier reaction](./act-anytime-hydrophone.md) firing first if the TF crossed a barrier and with [On-Patrol MP attacks a crossing submarine](./act-anytime-mp-vs-sub.md) when the on-patrol asset is air. [Submarine moves and goes On Patrol](./act-sub-on-patrol.md) is the setup action. Counter: the TF avoids known patrol zones, or sends ASW assets first.

A NATO Trafalgar On Patrol in Mid 7-8 watches a Good-detected Soviet TF enter. Anti-Surface 3 +1 (Good) = 4 dice, scores 2 hits on 7s. Soviet TF ASW total 10 = 3 dice + 1 Tactical, rolls 9, 6, 5, discards one hit on the 9, the other hit lands as a step loss on a Sovremenny. The Trafalgar stays On Patrol, ready to react again.
