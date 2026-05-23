---
id: act-air-strike
title: Air Strike
category: air-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "5.3.5"
  - "5.3.6"
  - "7.1.4"
  - "7.4.1.3"
  - "7.5.1"
seeAlso:
  - act-ship-fire-missiles
  - act-sub-missile-3-zones
  - act-anytime-fighter-vs-air
  - act-anytime-cap
---

## When does this come up?

One or more Strike units fly to a target TF or facility and attack with missiles, bombs, or both. Fighters fly as escort and Tankers extend range — both fly free of OPS cost when part of an air strike (5.3, 5.3.5, 5.3.6).

## Procedure

1. Spend 1 OPS per Strike unit being flown (Fighters and Tankers fly free with the strike).
2. Group strikes: units from different bases fly separate strikes (carriers in the same zone may fly as one strike). Strikes against different targets in the same zone are separate strikes (5.3.5).
3. Trace the path from base to target zone, respecting unit range. Tankers may extend a Strike's range: each 2-step Tanker extends one Strike by 2 zones or two Strikes by 1 zone; a 1-step Tanker extends one by 1 (5.3.6).
   {{PA-BLOCK: pa5:air-units-transit-to-a-zone — Air Units · Transit to a Zone}}
4. Resolve all en-route interceptions in order along the path TO the target (5.3.2, 5.3.3.1).
   {{PA-BLOCK: pa5:air-units-intercepted-when — Air Units Intercepted when:}}
5. Resolve CAP defending the target (carrier-based fighters defend every TF in zone + adjacent land facilities; land fighters defend their bases).
   {{PA-BLOCK: pa5:cap-may-roll-to-attack-when — CAP may roll to attack when:}}
6. Resolve the air-to-air resolution based on the strike type:
   - Unescorted strike: each defending Fighter rolls air-to-air dice per Strike unit (7.1.4).
     {{PA-BLOCK: pa5:fighters-vs-strike-aircraft — Fighters vs. Strike Aircraft (CAP & Intercept)}}
   - Escorted strike: roll defending fighters against escorts first, allocate kills to escorts first except N10 (7.1.4.4).
     {{PA-BLOCK: pa5:escorted-air-strikes — Escorted Air Strikes}}
     {{PA-BLOCK: pa5:fighters-vs-fighters — Fighters vs. Fighters (and escorted strikes)}}
   - Apply Interceptor "detected" status forward and CAP-kill save rolls.
     {{PA-BLOCK: pa5:interceptors — Interceptors}}
     {{PA-BLOCK: pa5:saves-against-cap-kills — Saves Against CAP Kills}}
7. **vs TF target**: surviving Strike units launch missiles automatically (7.4.1.3). Defender resolves SAMs, then incoming missile resolution, then hit selection, then damage.
   {{PA-BLOCK: pa4:sam-resolution — SAM Resolution}}
   {{PA-BLOCK: pa4:incoming-missile-resolution — Incoming Missile Resolution}}
   {{PA-BLOCK: pa4:missile-hit-selection — Missile Hit Selection}}
   {{PA-BLOCK: pa4:capital-ship-damage — Capital Ship Damage}}
8. **vs land target**: each remaining Strike step gets one bombing die (US CAGs also get 1 free SEAD die per 2 CAGs). Allocate to SEAD vs bombing, resolve SAM suppression, then SAM attack, then bombing.
   {{PA-BLOCK: pa6:air-units-bombing-land-targets — Air Units Bombing Land Targets}}
   {{PA-BLOCK: pa6:sam-suppression-sead-bombing — SAM Suppression (SEAD) · vs Bombing}}
   {{PA-BLOCK: pa6:sam-attack-bombing — SAM Attack · vs Bombing}}
   {{PA-BLOCK: pa6:bombing-air-to-ground — Bombing (air-to-ground)}}
9. Apply collateral step losses, facility damage cumulative effects, and Kola First Strike Points if applicable (7.5.3, 7.5.4).
   {{PA-BLOCK: pa6:collateral-damage — Collateral Damage}}
   {{PA-BLOCK: pa6:facility-damage — Facility Damage · Effects cumulative}}
   {{PA-BLOCK: pa6:the-kola-peninsula — The Kola Peninsula}}
10. Mark Strike units, escorting Fighters, and Tankers 'Spent'. Apply Cruise Missiles Fired markers per 9.5.3.

## See also

- [Fire missiles with a Task Force](./act-ship-fire-missiles.md)
- [Nuclear submarine missile attack](./act-sub-missile-3-zones.md)
- [On-Patrol Fighter intercepts enemy air](./act-anytime-fighter-vs-air.md)
- [CAP attacks a strike on its base](./act-anytime-cap.md)
- Related rules: (5.3.5), (5.3.6), (7.1.4), (7.4.1.3), (7.5.1), (7.5.3), (7.5.4)

## Why and what to watch for

<!-- COACH-PASS -->
