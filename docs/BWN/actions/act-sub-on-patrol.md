---
id: act-sub-on-patrol
title: Submarine moves and goes On Patrol
category: sub-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "5.2.1"
  - "5.2.3"
seeAlso:
  - act-anytime-sub-asw-vs-tf
  - act-anytime-sub-asw-vs-sub
  - act-anytime-mp-vs-sub
  - act-air-mp-on-patrol
---

## When does this come up?

A submarine moves to a zone where the opponent is likely to send units later in the turn, then sets up to react. Going On Patrol arms the sub to interrupt enemy movement through its zone for the remainder of the turn (5.2.3).

## Procedure

1. Spend 1 OPS and select one Fresh submarine.
2. Move the sub to a zone within its movement allowance instead of attacking (5.2.3). Resolve any Hydrophone Barrier crossings (2.3.6).
3. Place the 'On Patrol' marker on the submarine.
4. For the remainder of the turn, this On Patrol sub can be triggered as a Use-At-Any-Time reaction:
   {{PA-BLOCK: pa2:use-at-any-time — Use At Any Time (reactions available to On-Patrol units)}}
   - Interrupt a moving enemy submarine and roll ASW against it, staying On Patrol afterward. See [On-Patrol Submarine ASW vs moving Sub](./act-anytime-sub-asw-vs-sub.md).
   - Roll a torpedo attack against a moving TF entering the zone, flipping to Spent afterward. See [On-Patrol Submarine ASW vs moving TF](./act-anytime-sub-asw-vs-tf.md).
5. Only one On Patrol unit per zone may react against a given moving unit (5.2.3).

## See also

- [On-Patrol Submarine ASW vs moving TF](./act-anytime-sub-asw-vs-tf.md)
- [On-Patrol Submarine ASW vs moving Sub](./act-anytime-sub-asw-vs-sub.md)
- [On-Patrol MP attacks a crossing submarine](./act-anytime-mp-vs-sub.md)
- [MP or Fighter goes On Patrol](./act-air-mp-on-patrol.md)
- Related rules: (5.2.1), (5.2.3), (4.2.3.2)

## Coach

Reacting against a moving submarine does not flip the boat to Spent (5.2.3), so one high-ASW boat in a chokepoint can fire on multiple crossing subs across the turn. Reacting against a moving TF does flip it to Spent, so save that one for the target that matters. Only one On-Patrol unit per zone may react against a given moving unit (5.2.3), so two SSNs in the same zone waste overlap unless multiple enemies cross.

## Why and what to watch for

Going On Patrol is the submarine's standing-guard posture: the boat sits in a Sea Zone with sonar up, ready to react when something walks through (5.2.3). It models the actual operational pattern of Cold War submarine deployments, with NATO SSNs lurking in the GIUK gap and Soviet boats in choke points waiting for the next transit. Unlike a single attack action, On Patrol is investment: it commits the sub for the rest of the turn but yields multiple potential reactions.

Take this action when you can position a sub in a zone the opponent must move through and you do not have a current target. Classic uses: a NATO SSN On Patrol in North 7-8 to intercept Soviet sorties from the Bastion; a Soviet diesel On Patrol in the GIUK gap to ambush Convoys; an On-Patrol nuclear sub covering an amphibious approach route. The action is especially strong with high Anti-Surface and high ASW boats because the same sub can react to either a TF (torpedo) or a sub (ASW) crossing.

The biggest miss is treating both reaction types the same. Per 5.2.3, reacting against a moving submarine does **not** flip the reactor to Spent, so one sub can fire on multiple subs crossing across a turn. Reacting against a moving TF **does** flip it to Spent, ending its patrol duty for the turn. Players also forget the limit: only one On-Patrol unit per zone may react against a given moving unit (5.2.3). So having two SSNs On Patrol in the same zone wastes overlap unless multiple enemies cross. Second: On Patrol does not protect the sub from being attacked itself. An enemy can still send forces to ASW the zone. Third: the action also covers MP-style ASW vs subs crossing, but the sub uses ASW dice, not torpedo dice, when targeting another sub. Fourth: at end of turn the sub is normally marked Spent regardless of how many reactions it made, so it cannot patrol two turns in a row without coming off Spent first.

Pair with [On-Patrol Submarine ASW vs moving TF](./act-anytime-sub-asw-vs-tf.md) and [On-Patrol Submarine ASW vs moving Sub](./act-anytime-sub-asw-vs-sub.md) (the two reaction types) and [Hydrophone Barrier reaction](./act-anytime-hydrophone.md) layered before. Counter: enemy routes around your patrol zone, or uses on-patrol MPs to soften the sub before crossing.

Soviet Turn 3: a Charlie II spends 1 OPS to move into Mid 9-10 and go On Patrol, anticipating NATO's reinforcement Convoy. A transiting NATO SSN crosses first, and the Charlie reacts with an ASW roll, staying On Patrol. Later in the turn NATO's SHIPS event fires and the Convoy TF tries to cross the same zone; the Charlie reacts again with a torpedo attack, and this time flips to Spent.
