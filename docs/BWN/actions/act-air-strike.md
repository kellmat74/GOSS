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
  - "7.5.2"
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
8. **vs land target with bombs**: each remaining Strike step gets one bombing die (US CAGs also get 1 free SEAD die per 2 CAGs). Allocate to SEAD vs bombing, resolve SAM suppression, then SAM attack, then bombing.
   {{PA-BLOCK: pa6:air-units-bombing-land-targets — Air Units Bombing Land Targets}}
   {{PA-BLOCK: pa6:sam-suppression-vs-bombing — SAM Suppression (SEAD) · vs Bombing}}
   {{PA-BLOCK: pa6:sam-attack-vs-bombing — SAM Attack · vs Bombing}}
   {{PA-BLOCK: pa6:bombing — Bombing (air-to-ground)}}
9. **vs land target with cruise missiles (Soviet)**: instead of bombing, Soviet strike units (ship black & yellow missiles, all submarine missiles, all air) may attack a land target with cruise missiles (7.5.2). Dice rolled depend on the number of missiles fired, not the number of steps, and Soviet green-background missiles may fly 2 zones to the target. Allocate to SEAD vs the missile attack, resolve SAM suppression, then SAM attack, then the cruise missile attack itself.
   {{PA-BLOCK: pa6:cruise-missile-attacks-vs-land-targets — Cruise Missile Attacks Vs. Land Targets}}
   {{PA-BLOCK: pa6:sam-suppression-vs-cruise-missiles — SAM Suppression (SEAD) · vs Cruise Missiles}}
   {{PA-BLOCK: pa6:sam-attack-vs-cruise-missiles — SAM Attack · vs Cruise Missiles}}
   {{PA-BLOCK: pa6:cruise-missile-attack — Cruise Missile Attack}}
10. Apply collateral step losses, facility damage cumulative effects, and Kola First Strike Points if applicable (7.5.3, 7.5.4).
   {{PA-BLOCK: pa6:collateral-damage — Collateral Damage}}
   {{PA-BLOCK: pa6:facility-damage — Facility Damage · Effects cumulative}}
   {{PA-BLOCK: pa6:the-kola-peninsula — The Kola Peninsula}}
11. Mark Strike units, escorting Fighters, and Tankers 'Spent'. Apply Cruise Missiles Fired markers per 9.5.3.

## See also

- [Fire missiles with a Task Force](./act-ship-fire-missiles.md)
- [Nuclear submarine missile attack](./act-sub-missile-3-zones.md)
- [On-Patrol Fighter intercepts enemy air](./act-anytime-fighter-vs-air.md)
- [CAP attacks a strike on its base](./act-anytime-cap.md)
- Related rules: (5.3.5), (5.3.6), (7.1.4), (7.4.1.3), (7.5.1), (7.5.3), (7.5.4)

## Coach

Drive detection to Good before launching, and flip Missiles or Steps Bombing markers BEFORE CAP rolls so N10 (and N9 on bombs-only) kills resolve cleanly before weapons release (7.1.4.1). Defender rolls fighters against escorts first with kills going to escorts except on N10 (7.1.4.4). Save rolls use the firing fighter's base detection state, not the strike's (7.1.4.3). Tankers escort free but losing one collapses range mid-mission (5.3.6).

## Why and what to watch for

Air Strike is BWN's high-leverage action and its most rules-heavy. The price is 1 OPS per Strike step flown (escorting fighters and tankers ride free), and the payoff is missiles on a TF or bombs on a facility (5.3.5, 5.3.6, 7.4.1.3, 7.5.1). The design layers defenses in order, en-route interception, target-zone interception, CAP, SAMs, missile/SAM defense, hit selection, to model the layered nature of a modern strike package against a defended target.

Take this when you have a Good detection on a TF (missile salvos against undetected ships are wasted) or when a facility damage step would change the strategic picture: heavy damage on a NATO airbase strips its CAP to one die per unit and freezes Spent markers (2.3.8.4), heavy damage on a Soviet port adds +1 OPS to TF formation. For Soviet strikes against the Kola Peninsula, NATO trades carefully because every hit on Kola is one First Strike Point to the Soviet player (7.5.4).

The biggest mistake is mis-sequencing the air-to-air resolution. The defender rolls fighters against escorts first, allocating kills to escorts except on natural 10s, and only then resolves fighter-vs-strike (7.1.4.4). Natural 10 by CAP kills a strike step before missiles launch; natural 9 also kills if the strike is bombing only (7.1.4.1), so flip Missiles or Steps Bombing markers BEFORE CAP rolls, otherwise the bookkeeping breaks. F-14 natural 1s and 2s shoot down that number of incoming missiles (7.1.4.2). Strikes split: units from different bases fly separate strikes; carriers in the same Sea Zone fly as one strike. Different targets in the same zone are separate strikes (5.3.5). Save rolls against CAP kills go by the detection state of the firing fighter's base, not the strike's base (7.1.4, 7.1.4.3).

Pair this with [MP fly and attack](./act-air-mp-fly-attack.md) to drive detection up to Good before launch, with [Fire missiles](./act-ship-fire-missiles.md) for combined-arms salvos that overwhelm SAMs, and with the OPS-card Strike events that grant bonus tactical value. Counter: [CAP](./act-anytime-cap.md) layered with [interceptors](./act-anytime-fighter-vs-air.md), Hydrophones on the way home are irrelevant (no return interceptions, 5.3.2), but losing the tanker mid-strike collapses range immediately (5.3.6).

Example: two Soviet Backfires plus one Foxhound escort fly from Kola through North 5-6 to attack a NATO carrier in East 4. F-14 CAP on the carrier rolls 4 dice (printed) +1 for "detected by interceptors" from an earlier MP fight, scores a natural 10 (kill before launch, one Backfire step lost), then natural 1 and 2 from F-14 anti-missile shoots down 3 incoming missiles. The remaining 5 missiles roll against the TF SAMs before any hit selection.
