---
id: act-misc-launch-rorsat
title: Launch or move a RORSAT
category: misc-actions
side: soviet
usage: action
cost: 2
ruleRefs:
  - "5.4.3"
  - "2.2.4.1"
seeAlso:
  - act-air-mp-fly-attack
  - act-sub-detect
---

## When does this come up?

The Soviet player wants to extend or reposition satellite coverage. RORSATs are Soviet reconnaissance satellites used to detect NATO Task Forces. They start on the ground at Tyuratam and can be launched into space (5.4.3, 2.2.4.1).

## Procedure

1. Spend 2 OPS (Soviet only). Choose to either:
   - Launch a RORSAT from Tyuratam into a Sea Zone, or
   - Move a RORSAT already on the map to a different zone.
2. Roll a die. On a result of 1, the action fails catastrophically — the satellite is destroyed and placed in the Destroyed box (2.2.4.1).
   {{PA-BLOCK: pa2:miscellaneous — Miscellaneous (RORSAT cost, destroy-on-1, stack-at-4 rules)}}
3. On any other result, place the RORSAT in the target zone.
4. **Stacking**: RORSATs can be newly stacked together only if there are at least four already in play. Once 4+ are aloft, any further launches/moves may stack. Stacked RORSATs roll more detection dice (1 die per RORSAT present).
5. Note: RORSATs may also be lost as collateral damage to Soviet facilities (7.5.3). If Lourdes is destroyed (8.4.5), one RORSAT is permanently removed and another temporarily removed.

## See also

- [Maritime Patrol flies and attacks or detects](./act-air-mp-fly-attack.md)
- [Submarine moves and detects](./act-sub-detect.md)
- Related rules: (5.4.3), (2.2.4.1), (7.5.3), (8.4.5)

## Why and what to watch for

RORSATs are the Soviet wide-area TF detection layer. Launching from Tyuratam or moving an existing satellite costs 2 OPS, with a 10% catastrophic failure on a roll of 1 that destroys the satellite (5.4.3, 2.2.4.1). Once aloft, RORSATs roll detection automatically when ships move, free reconnaissance with no further OPS cost, which is the entire reason to invest in them early.

Take this when Soviet TF detection is weak: NATO is moving carrier groups around the Norwegian Sea and your MPs cannot reach. Stacking is the lever, RORSATs cannot newly stack until at least four are already in play (2.2.4.1), at which point stacked zones roll 1 die per RORSAT present. Until you cross that four-aloft threshold, every satellite occupies its own zone. After the threshold, concentrate stacks in the zones NATO TFs must transit (East 4, North 5-6, Med 4-5 for the southern flank).

The gotcha is the destroy-on-1 cost. Over a 6-turn game with multiple launches and repositions, the cumulative risk is real, each launch is a 10% chance of permanent loss until end-of-turn rolls clean up the Destroyed box. RORSATs are also lost to collateral damage on Soviet facility bombing (7.5.3) and to Lourdes destruction (8.4.5), losing Lourdes permanently removes one RORSAT and temporarily removes another for 3 turns. RORSATs do NOT get the same detection timing as MP on patrol (clarification on 5.4.3), they only detect when ships move, not at any other trigger.

This pairs with the broader Soviet detection chain: spy action places a Poor Detection (9.3), MP flies and adds detection (5.3, 5.3.1), RORSATs lock in passive coverage of high-traffic zones. Counter: ASAT FSPs (9.1.1), but those are NATO-suppressing, not anti-satellite, and the FSPs in question go in the ASAT system boxes preventing NATO Whitecloud/Snoopers cards. There is no in-game NATO action to shoot down a RORSAT; only collateral damage on Soviet facilities and the Lourdes attack remove them.

Example: Soviet launches a fourth RORSAT, rolls 7, success. Now stacking is unlocked. Next action launches a fifth and places it in North 5-6 (already has one RORSAT), rolls 9, now 2 RORSATs in North 5-6 rolling 2 dice per NATO TF move through. On NATO's TF move from East 4 to North 5-6, both RORSATs roll detection automatically with no further OPS cost.
