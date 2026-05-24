---
id: act-anytime-fighter-vs-air
title: On-Patrol Fighter intercepts enemy air
category: air-actions
side: neutral
usage: anytime
cost: null
ruleRefs:
  - "4.2.3.2"
  - "5.3.3.1"
  - "5.3.4.2"
  - "7.1.4"
seeAlso:
  - act-air-mp-on-patrol
  - act-anytime-cap
  - act-air-strike
---

## When does this come up?

An enemy Air Unit (Strike, escorted Strike, MP, or fighter) enters or passes through a zone where you have a Fighter unit On Patrol. The on-patrol fighter rolls air-to-air dice to attack without being marked Spent (5.3.3.1, 5.3.4.2). This trigger fires automatically whenever the enemy's path crosses your patrol zone (5.3.2 transit sequencing).

## Procedure

1. The enemy declares an air mission. When their path enters your On-Patrol fighter's zone (en route to or arriving at the target), pause to resolve interception (5.3.2, 5.3.3.1).
   {{PA-BLOCK: pa5:air-units-intercepted-when — Air Units Intercepted when:}}
2. Resolve based on the target type:
   - **vs MP**: roll printed dice minus 2 (min 1). Step loss on 9+ vs plane (N10 = step + no search); 6+ vs helo (N8-10 = step + no search) (7.1.2).
     {{PA-BLOCK: pa5:fighter-combat-vs-maritime-patrol — Fighter Combat vs Maritime Patrol (MP)}}
   - **vs unescorted Strike**: roll printed air-to-air dice per Strike unit, applying mission/damage modifiers. N10 kills before weapon delivery; N9 also kills if bombs-only; F-14 N1-2 shoots down enemy missiles (7.1.4, 7.1.4.1, 7.1.4.2).
     {{PA-BLOCK: pa5:fighters-vs-strike-aircraft — Fighters vs. Strike Aircraft (CAP & Intercept)}}
     {{PA-BLOCK: pa5:interceptors — Interceptors}}
   - **vs escorted Strike**: defender rolls fighters against escorts first; kills go to escorts first except N10. Then resolve fighter-vs-fighter (7.1.4.4).
     {{PA-BLOCK: pa5:escorted-air-strikes — Escorted Air Strikes}}
     {{PA-BLOCK: pa5:fighters-vs-fighters — Fighters vs. Fighters (and escorted strikes)}}
   - **vs Fighter** (no strike): both sides declare avoid-or-engage in order; if engaged, resolve simultaneously (7.1.3).
3. Apply hits and proceed to the next interception zone (if any), then CAP at the target (5.3.2).
4. The intercepting fighter is NOT marked Spent — interception is free (5.3.4.2).

## See also

- [MP or Fighter goes On Patrol](./act-air-mp-on-patrol.md)
- [CAP attacks a strike on its base](./act-anytime-cap.md)
- [Air Strike](./act-air-strike.md)
- Related rules: (4.2.3.2), (5.3.3.1), (5.3.4.2), (7.1.2), (7.1.3), (7.1.4)

## Why and what to watch for

Interception is the standing reaction that makes On-Patrol Fighters terrifying. Any enemy air mission that enters or transits the patrol zone gets attacked, and the fighter is not marked Spent (5.3.3.1, 5.3.4.2). The design models a CAP barrier at sea: the patrolling fighter has the gas to keep fighting, and successive waves all run the same gauntlet.

This trigger fires automatically whenever an enemy path crosses your patrol zone, both en-route to a target and at the target itself (5.3.2). You don't choose to intercept; you must. The right call is forward, keep On-Patrol fighters at the chokepoints the opponent must use: Kola exit zones, Denmark/Turkey overflight zones (where the War Track Symbols add interception dice anyway), or the Sea Zones over carrier groups. Send your better fighter (higher air-to-air, higher Tactical Value) to the zone the enemy strike package must transit.

The most common confusion is the CAP-vs-Interception distinction (5.3.3.1 vs 5.3.3.2). CAP defends a location and is keyed to the target type (TF in zone, adjacent land facility for carrier CAP, own land base for land fighters). Interception is keyed to transit: an On-Patrol fighter in any zone the strike crosses gets a free swing. Both can hit the same strike. Apply mission modifiers carefully: Intercepting fighter -1 die, Detected by Interceptors +1 die (this is what gets stacked forward, 7.1.4.3), CAP Spent -2 dice, base damage stacks (-1 light, =1 die heavy). Natural 10 kills before missile launch; natural 9 also kills if the strike is bombing only (7.1.4.1). F-14 natural 1s and 2s shoot down enemy missiles (7.1.4.2). Soviet +1 DRM if they hold the Air-to-Air Missile Tech marker (10.1).

This pairs with [On Patrol](./act-air-mp-on-patrol.md), without patrol there is no interceptor reaction. Counter: route around the patrol zone if possible, or send a heavily escorted strike to force the interceptor into Fighters-vs-Fighters and accept losses (7.1.3, 7.1.4.4). Tankers can sometimes detour a strike past an interception zone (5.3.6).

Example: a Soviet escorted strike (2 Backfires + 1 Foxhound) flies Kola → North 5-6 → East 4. A NATO Tornado is On Patrol in North 5-6. Interception fires: 1 fighter rolls (vs escort first, then strike), -1 die for Intercepting, kills the Foxhound step on a natural 10. Foxhound returns to base Spent, the Backfires continue toward East 4 marked "Detected by Interceptors", the carrier CAP at East 4 now rolls at +1 die.
