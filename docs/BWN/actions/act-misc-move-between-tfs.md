---
id: act-misc-move-between-tfs
title: Move ships between Task Forces
category: misc-actions
side: neutral
usage: action
cost: 1
ruleRefs:
  - "5.1.1.2"
seeAlso:
  - act-ship-form-tf
  - act-ship-move
---

## When does this come up?

Two Task Forces are in the same Sea Zone and you want to shuffle units between them — typically to consolidate damaged ships, peel off escorts, or break apart a force without spending the 2 OPS to form a brand new TF (5.1.1.2).

## Procedure

1. Spend 1 OPS. Select source and destination Task Forces — they must be in the same Sea Zone (5.1.1.2).
2. Move any units from the source TF to the destination TF (or to multiple destination TFs) as desired.
3. **Detection propagation**: a unit moved from a detected force grants the detection status of the originating TF to the destination TF — unless the destination already has a higher status.
4. Each remaining TF must still contain at least one Surface Unit (5.1.2). Empty TF markers return to the Task Force display.
5. The TFs may become Slow or Fast depending on whether (S) slow units are present after the swap.

## See also

- [Form a new Task Force](./act-ship-form-tf.md)
- [Move ships in a Task Force](./act-ship-move.md)
- Related rules: (5.1.1.2), (5.1.2), (5.1.2.1)

## Coach

Use this to consolidate damaged ships or peel off escorts for 1 OPS instead of 2, but the detection moves with the unit, you cannot launder a Good detection by shifting that ship into a Fresh TF (5.1.1.2). Every remaining TF still needs one Surface Unit (5.1.2). Adding an (S) Convoy or Amphib turns the destination Slow on the swap, with downstream ASW defense consequences.

## Why and what to watch for

Two TFs in the same Sea Zone can shuffle ships between them for 1 OPS, modeling underway transfers of escorts, breaking off damaged ships, or restructuring a force without the full 2 OPS overhead of creating a brand-new TF (5.1.1.2). The 1 OPS price reflects the lower friction: ships in the same zone are already steaming in formation, so the staff work is minimal compared to forming a TF from scratch (5.1.2).

Take this action when a damaged capital ship needs to break off to a sister TF heading home, when a fast strike group wants to drop its slow Convoy with another TF for escort duty, or when you need to consolidate ASW assets into a single hunter group while keeping a separate fast missile-shooter group nearby. It is also the right move when a TF has multiple Amphibs and you want to land them in shifts.

The trap is detection propagation. A unit moved from a Good-detected TF carries that status with it: the destination TF upgrades to Good (or Poor, if that is the source status), unless its existing status was higher (5.1.1.2). New players try to launder a Good detection by shifting the Good-detected ship into a fresh TF, but the detection moves with the unit. Second gotcha: every remaining TF must still contain at least one Surface Unit (5.1.2), so you cannot empty a TF down to just an escort sub or a Convoy. Third: the Slow status updates on the swap. A swap that introduces an (S) Amphib or Convoy turns the destination Fast TF Slow immediately, with downstream effects on next turn's ASW defense rolls.

Pair with [Form a new Task Force](./act-ship-form-tf.md) when the goal is genuinely separating forces (e.g., damaged carrier retiring). [Move ships in a Task Force](./act-ship-move.md) does the actual repositioning later.

A NATO carrier TF in Mid 5-6 takes two missile hits and the carrier is Damaged. The NATO player spends 1 OPS to move the damaged carrier plus one escort frigate into a nearby Convoy escort TF heading west, freeing the strike TF to push north without dragging a hobbled carrier.
