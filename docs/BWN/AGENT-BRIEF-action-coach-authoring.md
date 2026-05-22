# BWN Action + Coach Authoring — Agent Brief

> **Read this before doing any authoring work on BWN action markdowns or AI Coach content.**
> Decisions captured 2026-05-21. Refreshed when scope changes.

## What this work is

Author one markdown file per BWN action at `docs/BWN/actions/<action-id>.md`. These become the source of truth for the rich per-action pages in the Actions tab. Each file is later merged by a yet-to-be-built script into `src/data/blue-water-navy/actions.json` for runtime consumption.

The per-action page is the **single surface** for BWN action pedagogy — there is NO separate AI Coach tab for BWN (`features.learn: false`). All Coach content for unit actions lives in these per-action markdowns. The 3 phase chapters (Convoy Placement, Reinforcement, End of Turn substeps) get inline Coach content in `sequence.json` instead — that's a separate, smaller task.

## Authoring voice rules

1. **Rules-first.** Source is `src/data/blue-water-navy/rules.json` (238 v1.17 sections). Forum corpus (`forum-knowledge.json`) is used ONLY for gap-filling outliers and edge cases the rules don't cover.
2. **No designer attribution in prose.** Do NOT write "Stuart Tonge clarified that…" or "the designer said…". Just state the rule as the consistent authoritative voice of the app. Forum URLs can be cited as footnote-style links beneath a paragraph if absolutely needed, never as in-line attribution.
3. **Verbatim where it matters.** Direct quotes from `rules.json` for the actual mechanic. Coach prose for "why this exists" and "what to watch for" is paraphrase.
4. **Rule refs**: clickable `(X.Y.Z)` form (v1.17 numbering). The renderer auto-links them.

## Per-action markdown structure

```markdown
---
id: sub-torpedo-attack-vs-tf
title: Submarine Torpedo Attack vs Task Force
category: submarine-actions
side: both
type: action
usage: action          # "action" | "active" | "anytime"
cost: 1
ruleRefs:
  - "7.3"
  - "5.2.1"
seeAlso:
  - asw-by-tf
  - sub-missile-coordination
---

## When does this come up?

One short paragraph derived from rules.json. Narrative — what game state
triggers this decision. Cite rule refs inline.

## Procedure

1. Detect the TF first. Submarine torpedo attacks require Good detection
   on the target TF (7.3).
2. Spend 1 OPS to declare the attack.
3. Roll the attack dice and resolve.
   {{PA-BLOCK: ??? — Submarine vs. Task Force attack table (Play Aid 3)}}
4. Defender may offer ASW defense.
   {{PA-BLOCK: ??? — Task Force ASW table (Play Aid 3)}}
5. Apply hit effects.
   {{PA-BLOCK: ??? — Effects of hits by Submarines (Play Aid 3)}}

## Why and what to watch for

> LEAVE EMPTY OR STUB. This Coach section is authored in a separate later
> pass once play aids are validated AND the forum corpus has been cross-
> referenced for common confusion points.

## See also

- [ASW by Task Forces](./asw-by-tf.md)
- [Submarine Missile Coordination](./sub-missile-coordination.md)
- Related rules: (7.3), (7.3.1), (5.2.1), (5.2.3)
```

## Placeholder syntax for play-aid block refs

Inside `## Procedure` steps, wherever an inline play-aid table belongs, write:

```
{{PA-BLOCK: ??? — short descriptive label of what goes here}}
```

The `???` is intentional — the real block ID is `pa<N>:<slug>` (e.g. `pa3:submarine-vs-task-force`) but those slugs are only finalized after Matt finishes editing the play-aid markdowns and we run the merge script. Once that happens, we global-replace `???` with the real ID.

## Coverage scope — all actions

### Existing in `src/data/blue-water-navy/actions.json` (18 entries)

| Category | id | title |
|---|---|---|
| Ship | act-ship-form-tf | Form a new Task Force |
| Ship | act-ship-move | Move ships in a Task Force |
| Ship | act-ship-fire-missiles | Fire missiles with TF |
| Ship | act-ship-asw | ASW in current zone (instead of moving) |
| Ship | act-ship-amphib-land | Prepare/resolve Amphibious Landing |
| Submarine | act-sub-move | Submarine move |
| Submarine | act-sub-attack | Submarine moves and attacks a TF |
| Submarine | act-sub-detect | Submarine moves and detects |
| Submarine | act-sub-on-patrol | Submarine goes On Patrol |
| Submarine | act-sub-missile-3-zones | Nuclear sub fires missiles from up to 3 zones |
| Air | act-air-mp-fly-attack | Maritime Patrol flies and attacks or detects |
| Air | act-air-mp-on-patrol | MP or fighter goes On Patrol |
| Air | act-air-strike | Air Strike |
| Misc | act-misc-repair | Repair a facility |
| Misc | act-misc-move-between-tfs | Move ships between TFs |
| Misc | act-misc-launch-rorsat | Launch or move a RORSAT |
| Misc | act-misc-attack-cuba | NATO may attack Cuba |
| Misc | act-misc-pass | Pass |

### To add: missing standard actions

| Category | id (proposed) | title | Rule | Cost |
|---|---|---|---|---|
| Misc | act-misc-demine-port | De-Mine a Port | 5.4.2 | 2 |
| Submarine | act-sub-missile-coordination | Multi-sub missile coordination (2-3 subs) | 5.2.4 | varies |
| Submarine | act-sub-ssbn-escort | Soviet SSBN takes a nuclear sub | 2.2.7.1 stacking exception + 5.2 | — |
| Submarine | act-sub-attack-then-move | Submarine attack then move | 5.2.1 | 1 |

### To add: "Use When Active" (non-action decisions — `usage: active`)

| Category | id (proposed) | title | Rule |
|---|---|---|---|
| Misc | act-active-fsp | Spend a First Strike Point | 9.1.1 |
| Misc | act-active-soviet-spy | Use a Soviet Spy | 9.3 |
| Misc | act-active-ops-card-event | Use event on your OPS card | 4.2.1 |
| Misc | act-active-hand-card-event | Play event from hand (+2 cost) | 4.2.1 |
| Air | act-active-return-on-patrol-air | Return On-Patrol Air Unit to base | 5.3.4 |

### To add: "Use At Any Time" (reactions — `usage: anytime`)

| Category | id (proposed) | title | Rule |
|---|---|---|---|
| Misc | act-anytime-reaction-event | Play a Reaction event from hand | 4.2.1 |
| Air | act-anytime-fighter-vs-air | On-patrol Fighter intercepts | 5.3.3.1 |
| Air | act-anytime-mp-vs-sub | On-patrol MP attacks crossing sub | 5.2.3 |
| Air | act-anytime-mp-vs-tf | On-patrol MP attempts TF detection | 5.3 |
| Submarine | act-anytime-sub-asw-vs-tf | On-patrol Sub ASW vs moving TF | 7.2 |
| Air | act-anytime-cap | CAP attack on strike on base | 5.3.3.2 |
| Submarine | act-anytime-hydrophone | Hydrophone reaction on barrier crossing | 2.3.6 |
| Misc | act-anytime-draw-card | Draw card if hand <3 | 4.2 |
| Misc | act-anytime-spy-fs-evasion | Soviet Spy for First Strike evasion | 9.3 |

### Grand total

≈ 18 existing + 4 standard adds + 5 active + 9 anytime = **~36 markdowns** to author.

## Process order

1. **EXPAND catalog first.** Edit `src/data/blue-water-navy/actions.json` to add stubs for ALL missing actions (id, title, side, cost or `null`, usage flag, ruleRefs). Just the metadata — no body text yet.

2. **DRAFT per-action markdowns.** Create `docs/BWN/actions/<id>.md` for every action in the catalog (existing + new). Each file includes:
   - Frontmatter (YAML)
   - `## When does this come up?` (one paragraph from rules)
   - `## Procedure` (numbered steps with `{{PA-BLOCK: ??? — label}}` placeholders)
   - `## See also` (cross-links to related actions + rule refs)
   - `## Why and what to watch for` — **leave as stub** with comment `<!-- COACH-PASS -->`

3. **STOP and hand off** — Matt continues editing play-aid markdowns.

4. **(Later) Build merge scripts** (post play-aid validation):
   - `scripts/merge-bwn-play-aids.mjs` → `src/data/blue-water-navy/play-aid-blocks.json` (H2 sections of each `.md` keyed `pa<N>:<slug>`)
   - `scripts/merge-bwn-actions.mjs` → richer `src/data/blue-water-navy/actions.json` (frontmatter + section markdown)

5. **(Later) Replace placeholders.** Global-replace `???` in action markdowns with real `pa<N>:<slug>` block IDs.

6. **(Later) Update renderer.** Modify `src/components/Actions/ActionsPanel.tsx` to render the rich detail pane from the new schema with play-aid blocks resolved inline.

7. **(Later) Coach pass.** Fill in all `## Why and what to watch for` sections, sourcing from rules + designer Q&A clarifications + forum corpus gap-fills.

8. **(Later) SoP Coach inline.** Add `coachContent` field to relevant entries in `sequence.json` for the 3 phase chapters and 6 End-of-Turn substeps. Update `PhaseStepper` to render below existing content.

## Rule-section-to-action mapping (jumpstart for authoring)

Use this when looking up rule refs for each action's frontmatter. Verify against `rules.json` since these are from memory.

| Action | Primary rule | Secondary refs |
|---|---|---|
| Form Task Force | 5.1.2 Task Forces | 5.1.2.1 Detection of new TF |
| Move TF | 5.1.3 TF movement | 5.1.3.1 Weather, 5.1.3.2 Amphib, 5.1.3.6 Port |
| Fire missiles (TF) | 7.4 Missile Attacks on TF | 7.4.1 Launching, 7.4.2 Resolving |
| TF ASW | 7.2 ASW | 7.2.2 ASW by TFs |
| Amphibious Landing | 8.1 Amphib Landing Units | 8.1.1 Process, 8.1.2 NATO Delivery |
| Sub move | 5.2 Subs | 5.2.2 Movement allowance |
| Sub attack | 5.2.1 Applicable Sub actions | 7.3 Sub torpedo on TF, 7.3.1 procedure |
| Sub detect | 6.2 Submarine Detection | 5.2.1 |
| Sub on patrol | 5.2.3 On Patrol status | |
| Sub missile (nuclear, 3 zones) | 5.2.1 (sub actions) | 7.4 missile launch |
| Sub missile coordination | 5.2.4 Missile coordination | 7.4.1 launching |
| SSBN escort | 2.2.7.1 Stacking exception | 5.2 |
| MP fly + attack/detect | 5.3 Aircrafts, 5.3.2 Movement | 6.1 TF Detection, 7.3 (MP can ASW) |
| MP/Fighter on patrol | 5.3.4 On Patrol Status | 5.3.4.1, 5.3.4.2 |
| Air strike | 5.3.5 Strike units Fly and Attack | 7.5 Attacks on Land, 5.3.3 Interception, 5.3.6 Tankers |
| Repair facility | 5.4.1 Repair a Facility | |
| De-Mine port | 5.4.2 De-Mine a Port | |
| Launch RORSAT | 5.4.3 Launch or Move a RORSAT | |
| NATO attack Cuba | 5.4.4 | 8.4.5 Cuba |
| Pass | 5.4.5 Pass | 4.2 OPS phase |
| Spend FSP | 9.1.1 First Strike Points | |
| Soviet Spy | 9.3 Soviet Spies | |
| Card event (ops card) | 4.2.1 Events | |
| Card event (hand) | 4.2.1 Events | |
| Reaction event | 4.2.1 Events | |
| Return on-patrol air | 5.3.4 On Patrol | |
| Fighter intercept (anytime) | 5.3.3.1 Interception | 7.1.2-4 fighter combat |
| MP vs sub (anytime) | 5.2.3 + 7.2 | |
| MP vs TF detection (anytime) | 5.3 | 6.1 |
| Sub ASW vs TF (anytime) | 7.2 | 5.2.3 |
| CAP attack on base (anytime) | 5.3.3.2 CAP | |
| Hydrophone reaction (anytime) | 2.3.6 Hydrophone Barriers | |
| Draw card | 4.2 | |
| Soviet Spy FS evasion | 9.3 + 9.1.1 | |

## Key sources to consult while drafting

- **`src/data/blue-water-navy/rules.json`** — 238 v1.17 rule entries, each with `section`, `title`, `text` (verbatim), `clarifications[]` (designer Q&A), `legacyRef` (2020 original ref)
- **`docs/BWN/play-aids/*.md`** — Matt is editing these; they define the play-aid blocks. Names will firm up later.
- **`src/data/blue-water-navy/forum-knowledge.json`** — 3,697 curated posts. Used SPARINGLY for gap-filling only.
- **`docs/BWN/Revised Rules v1.17.pdf`** — source PDF if you need to verify
- **`docs/BWN/QA_BWN_V2.0.pdf`** — official Q&A doc (most already extracted into rules.json clarifications)

## Verification checklist before completing

- [ ] Every action in the expanded catalog has a corresponding markdown file
- [ ] All `ruleRefs` in frontmatter are real v1.17 sections (validate against `rules.json`)
- [ ] Every `## Procedure` step is grounded in a specific rule citation
- [ ] No prose says "Stuart Tonge", "the designer", "Compass Games" by name except in URL footnotes
- [ ] All `{{PA-BLOCK: ??? — ...}}` placeholders have a descriptive label so future-replace is unambiguous
- [ ] `## Why and what to watch for` is empty/stubbed across all files (LATER pass)
- [ ] `## See also` cross-links use actual existing action ids (no dangling refs)

## When to stop

Stop after drafting all action markdowns. Don't:
- Build the merge scripts (blocked on play-aid finalization)
- Try to resolve `???` placeholders to real block IDs yet
- Author `## Why and what to watch for` content
- Modify the ActionsPanel renderer
- Touch SoP coach inline content

Hand back to Matt for play-aid validation, then resume with merge scripts.

## File naming

`docs/BWN/actions/<action-id>.md` where `<action-id>` matches the JSON `id`. Lowercase kebab-case. Examples:
- `docs/BWN/actions/sub-torpedo-attack-vs-tf.md`
- `docs/BWN/actions/act-misc-demine-port.md`

(Note: the `act-` prefix is on existing JSON ids — keep that convention for the filenames too to ensure 1:1 mapping.)
