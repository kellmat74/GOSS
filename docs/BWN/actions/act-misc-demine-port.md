---
id: act-misc-demine-port
title: De-Mine a Port
category: misc-actions
side: neutral
usage: action
cost: 2
ruleRefs:
  - "5.4.2"
seeAlso:
  - act-misc-repair
---

## When does this come up?

A friendly port has been mined and you need to clear it to allow ship traffic. Spending 2 OPS attempts to step the minefield down one level. Heavy mining → Light mining → Unmined (5.4.2).

## Procedure

1. Spend 2 OPS and select one mined friendly port.
2. Roll a die. Required result depends on facility damage:
   - **Undamaged facility**: 5+ succeeds.
   - **Damaged facility**: 7+ succeeds.
   {{PA-BLOCK: pa2:miscellaneous — Miscellaneous (de-mine roll thresholds)}}
   {{PA-BLOCK: pa7:port-mines — Port Mines (what the minefield does)}}
3. On success, reduce the minefield by one level. Remove the Mine marker entirely if the port reaches Unmined.
4. On failure, the action is wasted but may be retried on a future activation.

## See also

- [Repair a facility](./act-misc-repair.md)
- Related rules: (5.4.2)

## Why and what to watch for

De-Mining is the slow recovery from card-driven port mining. Mines only get placed by cards (5.4.2 clarification), so this action specifically counters that one threat vector. The design models minesweeping as a multi-turn operation: Heavy mining steps down to Light, Light down to Unmined, and the roll difficulty climbs if the facility itself is also damaged.

Take this when a mined port is critical for the next few turns of operations. The mine marker on a port restricts movement (it does not affect amphibious landings, which work off a different marker, see 5.4.2 clarifications) and once placed it does not auto-clear. NATO usually de-mines its convoy receiving ports first; the Soviet player de-mines its sub egress ports first. Note that the Danish Strait mine counter is for moving through the strait, not for landing troops in Denmark, pay attention to which mine type is on the map.

The gotcha is the damage modifier on the roll: 5+ on an undamaged facility, 7+ on a damaged one (5.4.2). A damaged port is twice as hard to de-mine, so the standard repair sequence is: repair the facility first (5.4.1), then de-mine. A 7+ roll on a single die is only a 40% success rate, expect to spend 2 OPS multiple times before the mine field clears. On failure you still lose the 2 OPS; you cannot retry the same action without spending the OPS again. Heavy mining must drop to Light before Light can drop to Unmined, there is no double-step clear.

This pairs with [Repair a facility](./act-misc-repair.md) on combined facilities (most major ports are combined port + airfield). Counter: there is no direct opponent counter to a de-mine roll once it's been declared, but the card play that placed the mines in the first place can be re-applied if the opponent has another minelaying card in hand or deck.

Example: a Soviet card lays Heavy mines on Bergen, which already has Light port damage. NATO spends 2 OPS on De-Mine, rolls a 6 against a 7+ target (because the port is damaged). Failed: still Heavy mining. Next turn NATO spends 2 OPS on Repair, rolls a 6, restores Bergen to Undamaged. Following turn NATO de-mines again, this time at 5+, rolls 8, Heavy drops to Light. One more 5+ de-mine roll and Bergen is clear.
