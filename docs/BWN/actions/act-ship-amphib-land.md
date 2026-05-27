---
id: act-ship-amphib-land
title: Prepare and resolve an Amphibious Landing
category: ship-actions
side: neutral
usage: action
cost: null
ruleRefs:
  - "5.1.3.2"
  - "8.1"
  - "8.1.1"
  - "8.1.4"
seeAlso:
  - act-ship-move
  - act-ship-form-tf
---

## When does this come up?

A Task Force carrying Amphibious units sits in a zone with an Amphibious Landing symbol on the map. To get the troops ashore, the TF skips a movement beat to mark itself 'Landing', then resolves the landing on its next chance to move (5.1.3.2, 8.1.1). NATO does not use this for normal troop delivery — NATO delivers into friendly ports (5.1.3.5, 8.1.2) — except for Soviet-occupied Iceland (8.4.4).

## Procedure

1. **Place the Landing marker.** During movement, instead of moving, place a 'Landing' marker on a TF in a zone with an Amphibious Landing symbol (5.1.3.2).
2. Roll a free Task Force Detection roll against each TF marking itself 'Landing' (5.1.2.1, 8.1.1).
   {{PA-BLOCK: pa4:detection-of-tfs — Detection of TFs (Poor / Good states)}}
3. In Bad Weather, place a 'Moved' marker first; on the next chance to move you may choose to move normally or place the Landing marker (8.1.1).
4. **Next chance to move: resolve the landing.** Any submarines in port at the invaded location may sortie immediately and roll torpedo attacks vs the TF (7.3). Each rolling submarine costs the owning player 1 OPS and is marked Spent (8.1.1).
5. Determine dice and resolve the invasion sequence: cross-reference landing location × current turn for dice count, apply DRMs (Soviet troops ashore, damaged base), roll, and resolve threats starting with the lowest result (FACs → Ships → Missile/Air → Mines → Guns). Each threat can be cancelled by expending missiles, SAMs, or a step loss (8.1.1).
   {{PA-BLOCK: pa8:amphibious-invasions — Amphibious Invasions}}
6. Determine troops landed by cross-referencing each Amphib's hit count (1-2 hits = 2 troops, 3-4 = 1, 5+ = 0). Place troops on the Invasion Track at the landing location (8.1.1, 8.1.4).
   {{PA-BLOCK: pa8:landing-troops — Landing Troops}}
7. Resolve airfield captures: roll one die per troop landed against the facility (needing 8+ to reduce damage by a level) (8.1.4, 8.4.4).
   {{PA-BLOCK: pa8:capturing-facilities — Capturing Facilities}}
8. Remove the Amphib unit(s) from the map.

## See also

- [Move ships in a Task Force](./act-ship-move.md)
- [Form a new Task Force](./act-ship-form-tf.md)
- Related rules: (5.1.3.2), (5.1.3.3), (5.1.3.4), (5.1.3.5), (8.1), (8.1.1), (8.1.3), (8.1.4)

## Coach

Placing the Landing marker triggers a free Detection roll on the TF (5.1.2.1, 8.1.1), so soften the zone first with strikes and time it around good weather, Bad Weather forces a Moved marker and delays a full turn. Subs already in the invaded port sortie immediately and roll torpedoes at 1 OPS each (8.1.1). Each Amphib's hits drive troops landed (1-2 hits = 2 troops, 3-4 = 1, 5+ = 0 per 8.1.4).

## Why and what to watch for

Amphibious landings model the largest naval operation possible: putting troops on a hostile shore. BWN treats this with a two-beat sequence (mark Landing this turn, resolve next move chance) to capture the real-world reality that an amphibious assault is a vulnerable, telegraphed operation. The Soviets use it to grab Norway, Denmark, or Iceland; NATO normally delivers through friendly ports (5.1.3.5), with the Iceland recapture as the major exception (8.4.4).

Take this action when your Amphib-carrying TF reaches a zone with the Amphibious Landing symbol and you can afford to sit through one turn of detection and counterattack. The window matters: Bad Weather forces a Moved marker first (8.1.1), so weather rolls in the target zone delay the assault by an entire turn. Time Landings around favorable weather and a low NATO ASW posture, ideally after softening the defenses with prior strikes.

The biggest gotcha is the free Detection roll on placing the Landing marker (5.1.2.1, 8.1.1). The TF declares itself for the world to see, and a Poor or Good detection here invites every On-Patrol sub, MP, and reaction card the defender has. Second: submarines already in the invasion port may sortie immediately and roll torpedo attacks (8.1.1), each costing the owner 1 OPS and marking the sub Spent. Soviets often forget that landing in a port-bearing zone means the NATO SSNs there get a free attack window. Third: troop conversion is hit-count-driven (1-2 hits = 2 troops, 3-4 = 1, 5+ = 0 per 8.1.4), so an Amphib taking three hits delivers half its troops, not zero.

Pair with prior Air Strikes against the landing zone's airfield (8.1.4, 8.4.4 for Iceland), card events that suppress detection, and on-patrol Soviet subs covering the approach. The defender pre-positions hydrophones, on-patrol MPs, and base SAMs.

Soviet Turn 2: a TF with two Ivan Rogov Amphibs marks Landing in Norway invasion zone. NATO rolls detection, gets a Poor, then a UK SSN already in Bergen sorties (-1 OPS to NATO) and rolls a torpedo attack, scoring two hits on one Amphib. Next move, the landing resolves and delivers half-strength troops onto the Invasion Track.
