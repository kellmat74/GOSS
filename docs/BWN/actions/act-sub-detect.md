---
id: act-sub-detect
title: Submarine moves and detects
category: sub-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "5.2.1"
  - "6.1"
  - "6.1.1"
seeAlso:
  - act-sub-move
  - act-sub-attack
  - act-air-mp-fly-attack
---

## When does this come up?

A submarine moves into a zone with an Undetected (or Poor-detected) enemy TF and uses its sensors to upgrade the detection state — typically as a setup for a follow-up attack by the same submarine (via the move-then-attack action) or another unit that needs a Good detection (5.2.1).

## Procedure

1. Spend 1 OPS and select one Fresh submarine.
2. Move into the target zone using the sub's movement allowance (5.2.2). Resolve Hydrophone Barrier reactions if any (2.3.6).
3. Attempt detection on the enemy TF in the zone. Subs detect TFs only during an ASW attack via a natural 10 (see 7.2.1's N10 option 1). For a pure detection action, resolve per the detection procedure for the sub type.
   {{PA-BLOCK: pa4:detection-of-tfs — Detection of TFs (by MP, RORSAT, Tattletale)}}
4. If detection succeeds, place a Poor Detection marker, or upgrade an existing Poor to Good (6.1.1).
5. Mark the submarine 'Spent'.

## See also

- [Submarine move](./act-sub-move.md)
- [Submarine moves then attacks](./act-sub-attack.md)
- [Maritime Patrol flies and attacks or detects](./act-air-mp-fly-attack.md)
- Related rules: (5.2.1), (6.1), (6.1.1), (7.2.1)

## Coach

Spend this OPS to set up a follow-up strike, Good detection adds +1 die to torpedo and missile attacks (7.3.1, 7.4.1.1), and surface missile launches against a Poor target need Fast or 6+ ASuW (7.4.1.2). Subs do not have a clean dedicated detection roll, they primarily upgrade TFs via N10 during an ASW attack (7.2.1), so read your sub type's detection rule before committing. The sub is Spent even if detection fails.

## Why and what to watch for

Submarines can use their sonar suites to find and refine the picture on enemy surface forces, modeling the role boats actually played as scouts and shadowers in the Cold War (5.2.1, 6.1, 6.1.1). The dedicated detection action exists because the game wants you to be able to invest a sub's turn in setup work without having to also fire torpedoes, which is critical for the kill chain where one boat finds and a second boat (or a TF, or a missile salvo) finishes.

Take this action when you have a sub in (or able to reach) a zone with an Undetected or Poor-detected enemy TF and your follow-up plan needs Good detection: surface missile launches against a Poor target need Fast or 6+ ASuW (7.4.1.2), and Good detection adds +1 die to torpedo and missile attacks (7.3.1, 7.4.1.1). It is also the right call when you want to keep tabs on a force without committing to combat that would mark you Spent attacking and leave the zone uncovered.

The key constraint is that submarines do not have a clean dedicated detection roll in the same way MPs and RORSATs do (6.1). Subs primarily detect TFs during an ASW attack via an N10 result (option 1 of 7.2.1's N10), so a pure detection action against a TF leans on the sub's available detection procedure for its type, not a generic roll. Read the rule carefully before spending OPS expecting a guaranteed Poor placement. Second: the sub becomes Spent after the action even if no upgrade happened, so a failed detect still costs you the turn. Third: like every move-based sub action, Hydrophone Barriers reactions trigger on the way in (2.3.6).

Pair with [Submarine moves then attacks](./act-sub-attack.md) by a second sub or with [Fire missiles with a Task Force](./act-ship-fire-missiles.md) in the same zone, exploiting the Good detection you just placed. [Maritime Patrol flies and attacks or detects](./act-air-mp-fly-attack.md) is a parallel detector with different strengths (air can detect from adjacent zones, sub can only detect in zone).

A Soviet Victor III spends 1 OPS into Mid 5-6 where a Poor-detected NATO Convoy TF sits. The detect attempt succeeds and upgrades to Good. Next action, a Charlie II 1 OPS away launches missiles into the now-Good target, getting 2 dice on its launch roll instead of 1.
