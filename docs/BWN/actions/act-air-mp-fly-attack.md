---
id: act-air-mp-fly-attack
title: Maritime Patrol flies and attacks or detects
category: air-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "5.3"
  - "5.3.1"
  - "5.3.2"
  - "6.1"
  - "7.2"
seeAlso:
  - act-air-mp-on-patrol
  - act-anytime-mp-vs-sub
  - act-sub-detect
---

## When does this come up?

A Maritime Patrol unit flies a one-shot mission into a Sea Zone within its range — either to hunt a known submarine (ASW) or to attempt detection of an enemy Task Force (5.3, 5.3.1). The MP must be Fresh and the action costs 1 OPS per flying unit (escorting fighters and tankers fly free, see [Air Strike](./act-air-strike.md)).

## Procedure

1. Spend 1 OPS and select one Fresh MP unit at a base.
2. Trace the route from the base to the destination Sea Zone — must remain within range (5.3.2).
   {{PA-BLOCK: pa5:air-units-transit-to-a-zone — Air Units · Transit to a Zone}}
3. Check the route TO the target zone for enemy interceptions (On Patrol fighters, en-route carrier CAP), then resolve any interception in the target zone itself (5.3.2, 5.3.3.1).
   {{PA-BLOCK: pa5:air-units-intercepted-when — Air Units Intercepted when:}}
4. Resolve CAP from carriers or land bases protecting the target (5.3.3.2).
   {{PA-BLOCK: pa5:cap-may-roll-to-attack-when — CAP may roll to attack when:}}
5. If the MP survives, resolve its chosen mission:
   - **ASW vs known submarine**: roll ASW dice per the standard ASW procedure (7.2.1). MP units suffer -2 dice in Bad Weather.
     {{PA-BLOCK: pa3:anti-submarine-warfare — Anti-Submarine Warfare (die roll table + DRMs)}}
   - **TF detection attempt**: roll for detection per 6.1.
     {{PA-BLOCK: pa4:detection-of-tfs — Detection of TFs (by MP, RORSAT, Tattletale)}}
6. **Free follow-on**: if the detection was placed or upgraded, the active player may take one further action of any type — but it must result in an attack against the newly detected TF (5.3.1).
7. Mark the MP unit 'Spent' and return it to base.

## See also

- [MP or Fighter goes On Patrol](./act-air-mp-on-patrol.md)
- [On-Patrol MP attacks a crossing submarine](./act-anytime-mp-vs-sub.md)
- [Submarine moves and detects](./act-sub-detect.md)
- Related rules: (5.3), (5.3.1), (5.3.2), (5.3.3), (6.1), (7.2)

## Why and what to watch for

Maritime Patrol is the one-shot version of BWN's air search-and-strike loop. Send the MP to the zone, take one swing (ASW or detection), and the unit goes home Spent. The design captures that long-range maritime aviation finds its target, attacks once, and recovers, there is no loiter, no second pass (5.3, 5.3.1).

Take this when you have a known sub to attack but no shipboard ASW in the zone, or when you need detection on a TF that has slipped your other sensors. The free follow-on after a successful detection upgrade is the headline reason to fly an MP (5.3.1): if you place or improve a detection marker, the active player may immediately take any other action that ends in an attack on that TF, paid for by its own OPS. That chain is how NATO converts a tentative contact into a missile strike before the carrier moves again.

The trap is forgetting the en-route interception sequence (5.3.2). Check the path TO the target for On-Patrol fighters and en-route carrier CAP, then resolve any interception in the target zone itself, then CAP from the defender, all before the MP rolls its mission dice. A Bear D flying into a US carrier zone gets attacked by F-14s before it ever rolls detection (7.1.2). Bad Weather costs the MP 2 ASW dice (7.2.1), not 1. And (N) subs are only killed by an MP on a natural 10.

Pair this with On-Patrol assets already in zone for the free die during the action chain. Carrier CAP defends every TF in its Sea Zone and every land facility adjacent to that zone (5.3.3.2), so flying MP through a known carrier sea zone is a step-loss factory. The Soviet Bear-F variant and NATO P-3 are the workhorses here. Counter: a fighter On Patrol in the MP's transit zone forces a Fighters vs MP roll at printed dice minus 2 (7.1.2).

Example: a Soviet Bear D flies from Kola into East 4 hunting a NATO TF with a Poor detection. It transits East 6, where a UK Tornado on Patrol intercepts, fails to kill but pings detection. Bear arrives, no carrier CAP, and rolls TF detection at the printed dice minus 1 (Detected by Interceptors flips against it in the next zone, not this roll). On success the Soviet upgrades to Good and immediately follows on with a Backfire strike from the Kola airbase.
