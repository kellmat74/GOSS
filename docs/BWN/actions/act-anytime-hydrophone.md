---
id: act-anytime-hydrophone
title: Hydrophone Barrier reaction
category: misc-actions
side: nato
usage: anytime
cost: null
ruleRefs:
  - "4.2.3.4"
  - "2.3.6"
  - "7.2"
seeAlso:
  - act-anytime-mp-vs-sub
  - act-ship-asw
---

## When does this come up?

An enemy submarine crosses a Hydrophone Barrier shown on the map: the GIUK Gap (East 6, East 9-10, North 3-4), the English Channel (East 4), or the Strait of Gibraltar (Med 1-2). NATO can react with whatever Fresh or On-Patrol unit happens to be sitting in the entered or exited zone (2.3.6). This is the SOSUS feature in game terms.

## Procedure

1. A submarine crosses a Hydrophone Barrier. Declare the reaction (2.3.6, 4.2.3.4).
2. Choose one of three options:
   - **Option 1 — Free single die**: a Fresh or On-Patrol friendly unit in the entered/exited zone rolls one die on the ASW table against the submarine, adding the unit's Tactical Value. **No** Spent marker applied — this is free.
   - **Option 2 — Full ASW attack**: the same unit rolls a normal ASW attack with **+1 die** as though attacking the sub. After resolving, mark the unit Spent.
   - **Option 3 — Local helo asset** (English Channel and Strait of Gibraltar only): use the permanent 2-dice helo asset, rolling as though it were an MP unit (apply Bad Weather and (N) modifiers normally). Used **instead of** one of the other two options.
3. Apply Bad Weather: weather in the zone the submarine is moving INTO matters (not the one moving out of). Option 3's helo asset is reduced to zero dice in Bad Weather.
4. Resolve the ASW roll per 7.2.1 — the "Hydrophone Interruption" line in the ASW DRM table applies here (+1 die or roll 1 die and not spent, optional always-one-die for submarines).
   {{PA-BLOCK: pa3:anti-submarine-warfare — Anti-Submarine Warfare (Hydrophone Interruption DRM in DRM table)}}
5. A single sub can be re-rolled against by each different Fresh unit in the zone using Option 1 — every Fresh unit gets a free shot.

## See also

- [On-Patrol MP attacks a crossing submarine](./act-anytime-mp-vs-sub.md)
- [ASW in current zone (instead of moving)](./act-ship-asw.md)
- Related rules: (4.2.3.4), (2.3.6), (7.2), (7.2.1)

## Why and what to watch for

Hydrophone Barriers are SOSUS in game form: the GIUK Gap (East 6 / East 9-10 / North 3-4 borders), the English Channel (East 4 border), and the Strait of Gibraltar (Med 1-2 border) (2.3.6). When an enemy sub crosses one, NATO gets a free reaction, but only with a Fresh or On-Patrol friendly unit in the entered or exited zone. The design models cold-war passive acoustic detection at chokepoints, layered on top of NATO's active ASW posture.

Take this every single time a Soviet sub crosses a barrier. The Option 1 single-die-no-Spent is the headline play, each Fresh unit in the zone gets a free single die at the sub, with the unit's full Tactical Value applied (2.3.6). Use Option 2 (full ASW attack with +1 die, then Spent) only when you're committed to killing this sub THIS reaction, usually for a known high-value target like an Akula or Typhoon. Use Option 3 (the permanent helo asset in English Channel or Gibraltar only, 2 dice rolling as MP) when no good Fresh unit is in zone but you need a swing.

The gotchas pile up here. Task Forces can NEVER use Hydrophone reactions, nor can anything inside a TF, escort subs are too busy escorting (2.3.6 clarification). The unit must be Fresh (or On-Patrol with the MP-vs-sub reaction stacking from 5.3.4.1), Spent units in zone don't react. Bad Weather applies if it's in the zone the sub is moving INTO, not out of. The English Channel and Gibraltar local helo assets reduce to ZERO dice in Bad Weather (not -2). Every different Fresh unit in zone gets its own Option 1 free die, so a sub crossing the GIUK gap with three NATO Fresh units in East 6 takes three free Option 1 rolls. And the +1 die DRM is the "Hydrophones" line on the standard ASW DRM table (7.2.1).

This pairs with [MP On Patrol](./act-air-mp-on-patrol.md) keeping a Fresh asset in the barrier zones, and with [On-Patrol MP attacks a crossing submarine](./act-anytime-mp-vs-sub.md) (which can stack with the +1-die DRM). Counter: route Soviet subs around the barriers if possible, use (N) subs to make MP-based detection rolls need natural 10s, or strike the NATO base whose units guard the barrier to ground them.

Example: a Soviet Victor III moves from North 7-8 across the SOSUS line into and through East 6. NATO has a Fresh Tornado at UK base flying CAP and a Fresh Nimrod also On Patrol in East 6. NATO declares Option 1 with the Nimrod: rolls 1 die at the Victor + Nimrod TV +1 Hydrophone DRM, natural 9 = hit, Victor takes a step loss. Nimrod NOT Spent. NATO can still declare Option 2 with the Tornado for another full ASW attack at +1 die, but probably saves it for the next sub crossing.
