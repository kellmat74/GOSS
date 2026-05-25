---
id: act-anytime-cap
title: CAP attacks a strike on its base
category: air-actions
side: neutral
usage: anytime
cost: null
ruleRefs:
  - "4.2.3.3"
  - "5.3.3.2"
  - "7.1.1.2"
  - "7.1.4"
seeAlso:
  - act-anytime-fighter-vs-air
  - act-air-strike
---

## When does this come up?

Every Fighter unit at home base is always performing a CAP (Combat Air Patrol) mission, even when 'Spent' — except for On-Patrol interceptors elsewhere (4.2.3.3). When an enemy strike arrives in a zone protected by CAP, the defending fighter rolls air-to-air dice without spending OPS.

## Procedure

1. An enemy Strike (or in some cases MP or interceptor) arrives in a zone protected by your CAP. Determine eligibility (5.3.3.2):
   - **Land-based fighters** protect land bases in their own zone (but not TFs at sea).
   - **Carrier-based fighters** defend every TF in the carrier's Sea Zone and every land facility adjacent to that zone (the carrier itself does not have to be the target).
   {{PA-BLOCK: pa5:cap-may-roll-to-attack-when — CAP may roll to attack when:}}
2. Resolve CAP per the air-to-air procedure. One Fighter unit may roll its printed air-to-air dice for each enemy Strike unit. Apply mission modifiers (CAP Spent -2 dice, Detected by Interceptors +1, base damage, damaged CV, etc.) (7.1.1.2, 7.1.4).
   {{PA-BLOCK: pa5:fighters-vs-strike-aircraft — Fighters vs. Strike Aircraft (CAP & Intercept)}}
3. Add the fighter's Tactical Value to each die. Apply the Soviet 'Air to Air Missile' Technology DRM if held. Resolve natural rolls: N10 kills a Strike step before weapon delivery; N9-10 kills before bomb release; F-14 N1-2 shoots down enemy missiles.
4. Apply save rolls based on the detection state of the firing fighter's base (8+ for Poor-detected carrier CAP if not at strike location; 6+ otherwise) (7.1.4.3).
   {{PA-BLOCK: pa5:saves-against-cap-kills — Saves Against CAP Kills}}
5. Surviving enemy Strike units proceed to deliver weapons.
6. CAP fighters are NOT marked Spent by performing CAP — they remain available to fight the next strike that arrives at the same base.

## See also

- [On-Patrol Fighter intercepts enemy air](./act-anytime-fighter-vs-air.md)
- [Air Strike](./act-air-strike.md)
- Related rules: (4.2.3.3), (5.3.3.2), (7.1.1.2), (7.1.4), (7.1.4.1), (7.1.4.2)

## Coach

CAP is free standing defense and never gets Spent by resolving combat (4.2.3.3). Eligibility: land fighters defend their own base only, carrier fighters defend every TF in their Sea Zone plus adjacent land facilities (5.3.3.2). A strike passing through without attacking does not trigger CAP, that is interception (5.3.3.1). Carrier CAP defending a TF that is NOT the strike's target uses Poor-detection saves of 8+ (7.1.4.3), and heavy base damage drops CAP to 1 die per unit.

## Why and what to watch for

CAP is the free standing defense over every base and TF. Fighters at home base are always performing CAP, even when their counter shows Spent (4.2.3.3, 5.3.3.2). The design models air defense as a baseline, the fighter doesn't have to take an action to defend its own ship or airbase, and CAP is never spent by resolving combat (the unit's eligibility to roll the next time a strike arrives is unchanged).

CAP fires when an enemy strike attacks a location it protects. Land-based fighters protect their own land base only, they do NOT protect TFs at sea. Carrier-based fighters defend every TF in the carrier's Sea Zone (the carrier doesn't have to be the target) AND every land facility adjacent to that zone (5.3.3.2). The "adjacent land facility" reach is what makes a carrier in East 4 a defensive anchor for the UK home islands.

The biggest mistake is missing the eligibility filter. If a strike merely passes through a Sea Zone containing a carrier without attacking anything in it, no CAP reaction triggers (5.3.3.2 clarification, interception is a different ruleset, 5.3.3.1). If a strike attacks a TF in zone, ALL eligible CAP defenses are simultaneous and resolved as one CAP defense. Spent CAP rolls at -2 dice; light base damage -1 die; heavy base damage drops to 1 die only (7.1.4). Carrier-based CAP defending a TF that is NOT the target uses Poor detection saves (8+, 7.1.4). Strike steps killed by natural 10 are killed before missile launch; natural 9 kills are also pre-launch if the strike is bombing only (7.1.4.1). F-14 anti-missile shoots down incoming on natural 1s and 2s (7.1.4.2).

This pairs with [On-Patrol Fighter intercepts](./act-anytime-fighter-vs-air.md), interception in transit zones layered with CAP at the target stacks two waves of fighter fire on the same strike, and the +1 "Detected by Interceptors" die carries forward (7.1.4.3). Counter: heavy bomb-strike damage to the CAP's base reduces it to 1 die per unit (2.3.8.4), so striking the airfield first weakens defenses for the follow-up.

Example: a Soviet Backfire strike attacks a NATO carrier in East 4. Two F-14 units are CAP, one on the target carrier (Good detection, 6+ saves apply against its kills), one on a nearby NATO TF in the same zone with a Poor detection (8+ saves apply since it's not at the strike location). Both roll printed dice per Backfire step. The first F-14 rolls natural 10, Backfire step lost before missiles launch. The second F-14 rolls natural 1, shoots down 1 incoming missile.
