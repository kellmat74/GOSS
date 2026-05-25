---
id: act-anytime-mp-vs-sub
title: On-Patrol MP attacks a crossing submarine
category: air-actions
side: neutral
usage: anytime
cost: null
ruleRefs:
  - "4.2.3.2"
  - "5.3.4.1"
  - "7.2"
  - "7.2.1"
seeAlso:
  - act-air-mp-on-patrol
  - act-anytime-mp-vs-tf
  - act-ship-asw
---

## When does this come up?

An enemy submarine moves into or through a Sea Zone where you have an MP On Patrol. The MP can interrupt the move and roll a full ASW attack against the submarine (5.3.4.1). After reacting, the MP flips to Spent and returns to base.

## Procedure

1. An enemy submarine moves into or through the MP's patrol zone. Declare the MP is reacting (5.3.4.1).
2. Resolve a standard ASW attack: roll the MP's ASW dice, add Tactical Value, apply DRMs (Bad Weather -2 for MP, Arctic ice -1, Hydrophones +1). Each die ≥ the target submarine's Defense value causes a step loss. (N) submarines are only killed on a natural 10 when an MP is rolling (7.2.1).
   {{PA-BLOCK: pa3:anti-submarine-warfare — Anti-Submarine Warfare (die roll table + DRMs)}}
3. Apply N10 effects (option to detect a TF in zone, destroy any sub step, etc.).
4. The defender applies non-N10 hits first, then the attacker allocates the rest. Apply sub 'save' rolls.
5. Flip the MP's On Patrol marker to Spent and return it to base (5.3.4.1).

## See also

- [MP or Fighter goes On Patrol](./act-air-mp-on-patrol.md)
- [On-Patrol MP attempts Task Force detection](./act-anytime-mp-vs-tf.md)
- [ASW in current zone (instead of moving)](./act-ship-asw.md)
- Related rules: (4.2.3.2), (5.3.4.1), (7.2), (7.2.1)

## Coach

React almost reflexively when a sub crosses your MP's patrol zone, you already paid 1 OPS and get a free full ASW attack (5.3.4.1, 7.2). Exception: if the sub is in a Hydrophone Barrier zone, the +1-die free reaction (2.3.6) may be better since it does not Spend the MP. The MP can react to a sub OR a TF this turn, not both, and goes Spent either way. Bad Weather is -2 dice for MP, and (N) subs only die on natural 10 (7.2.1).

## Why and what to watch for

An On-Patrol MP that catches an enemy sub in transit is BWN's most efficient ASW play in OPS terms, you paid 1 OPS to deploy the patrol, and now you get a full ASW attack for free against a moving submarine (5.3.4.1, 7.2). The design captures airborne ASW catching boats moving submerged through known chokepoints, without using the action turn that would otherwise be spent flying.

Take it almost reflexively when a target sub moves through your patrol zone, the alternative is letting it pass. The exception is when the sub is already inside a Hydrophone Barrier that you'd rather react with (free single die, no Spent), or when burning the MP now leaves a higher-value TF detection undone later this turn. Once the MP reacts, it flips to Spent and returns to base; it cannot also detect a TF the same turn (5.3.4.1).

The DRM stack matters. Bad Weather costs MP -2 dice (not -1 like non-MP), Arctic ice -1 die, Hydrophones +1 die. (N) submarines are only killed by an MP on a natural 10, non-magnetic boats are hard for air to detect (7.2.1). Natural 10s give the rolling player one of three outcomes: detect a TF in the same zone, kill any sub step, or (Soviet nuclear sub only) trigger an SSBN Hunt roll. The defender allocates non-N10 hits first (worst-to-best), the attacker then allocates the rest. Save submarines roll 6+ saves on every hit. NATO subs in the Bastion taking a natural 1 themselves cause a step loss (one max), but only NATO subs not MPs are exposed to that.

This pairs with [Hydrophone Barrier reaction](./act-anytime-hydrophone.md) (the +1-die DRM line in the ASW table is the Hydrophone interruption row). Counter: route subs around the patrol zone, or send a strike to bomb the MP's base before the sub move (heavy damage grounds patrol units). Soviet (N) subs (Sierra, Akula) significantly reduce MP threat.

Example: a Soviet Akula moves from East 6 to East 4. NATO has a US P-3 On Patrol in East 4 with Tactical Value 2 and 3 ASW dice printed. P-3 reacts, rolls 3 dice + 2 TV, but Akula is (N) so only a natural 10 hits. P-3 rolls 7, 9, 4, no kill (no natural 10). The P-3 still flips to Spent and returns home.
