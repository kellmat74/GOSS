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

<!-- COACH-PASS -->
