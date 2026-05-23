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

<!-- COACH-PASS -->
