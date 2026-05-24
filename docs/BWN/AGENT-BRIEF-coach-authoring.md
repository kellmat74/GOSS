# BWN AI Coach Authoring Brief

> Read this end-to-end before producing any content. This is the source of truth
> for voice, length, sources, and output schema across all 5 parallel author
> agents. Generated 2026-05-24.

## Mission

Author the **AI Coach** ("Why and what to watch for" / "coachNotes" /
"coachContent") sections for every BWN surface a player consults during play:

| Surface | Count | Output goes to |
|---|---|---|
| SoP (phases + subPhases) | 14 | `src/data/blue-water-navy/sequence.json` → new `coachContent` field on each |
| Actions | 36 | `docs/BWN/actions/*.md` → fill the existing `## Why and what to watch for` section |
| Cards | 110 | `src/data/blue-water-navy/cards.json` → new `coachNotes` field on each card |
| Scenarios | 6 | `src/data/blue-water-navy/scenario-book.json` → new `coachNotes` field on each |

The audience is a new-to-intermediate BWN player. They have the rules in front of them.
What they need from the Coach is **why this exists, when to use it, what to watch out
for, what it pairs with**, and **a concrete play-beat example** that lands the point.

## Voice rules — strict

1. **Authoritative single voice.** No "I think", no "you'll find". Direct: "Form a
   TF early when…"; "The biggest mistake here is…"; "Pair this with…".
2. **No designer attribution in prose.** Don't write "Stuart Tonge clarified that…"
   or "the designer mentions…". Forum-derived insight is woven into the voice as if
   it's the app speaking.
3. **Rules-first.** Source is `rules.json` (verbatim rule text + clarifications) +
   play-aid markdowns + existing procedure-step prose in the action markdowns. The
   forum corpus is consulted for **gotchas** (Tier 2 = common confusion) and
   **design intent** (Tier 1 = designer canonical), but you cite rules, not posts.
4. **Cite rules `(X.Y.Z)` in v1.17 numbering.** The renderer makes these clickable.
   Don't cite original 2020 section numbers — they're stale.
5. **Verbatim where it matters.** Direct quotes from rules text are fine for the
   actual mechanic clause. Coach prose is paraphrase.
6. **No platitudes.** "Use this action strategically" is banned. Every paragraph
   must be specific enough to be wrong.
7. **No emoji.** Per org instructions.
8. **No em-dashes in output.** Per org instructions.

## Format — 5-paragraph shape (~300 words per Action and SoP entry)

```
[Paragraph 1 — Design intent]
Why does this action / phase exist in BWN? What problem is it trying to model?
What's the historical or operational analog the rule is reproducing? Keep
this brief (~2 sentences).

[Paragraph 2 — When to take it]
What game state makes this the right call? Concrete signals: detection level,
weather, OPS remaining, opponent's posture. Mention specific values where the
rule cares (e.g. Good vs Poor detection, Fast vs Slow TF).

[Paragraph 3 — Gotchas + edge cases]
What do new players get wrong? What rules interaction is easy to miss? What
DRM stacks? Pull from rule clarifications and (mined from forum Tier 2 / Q&A)
the common confusion points. Be specific.

[Paragraph 4 — Synergies + counters]
What other actions or cards pair well with this? What does the opponent do
to defend? Reference related actions by their kebab-id title.

[Paragraph 5 — Example beat]
One concrete tactical example, 2-3 sentences. Set a scene: "A Soviet diesel
sub in North 7-8 detects a Good-detected NATO TF. Spending 1 OPS to attack
nets…" Make it feel like real play.
```

**Length: ~300 words total per Action and SoP entry.** Don't pad to hit it;
don't cut content to fit. If a topic genuinely needs 200 words, write 200.
If it needs 400 for a complex topic like Air Strike, write 400.

## Format — Cards (tighter)

110 cards × 300 words would be 33,000 words. Cards are reference data — the
existing card `text` already explains the rule. Coach for cards is **tight**:

```
[~60-100 words total — one paragraph or two short ones]

When is this card worth playing for its event vs spending it for OPS?
What's the strategic intent? One specific gotcha or pairing if relevant.

If the card has both an ops event AND a reaction event with distinct uses,
cover the strategic choice between them in a sentence.
```

Output field: `coachNotes` (single string, markdown).

## Format — Scenarios (richer, ~400 words each)

Scenarios cover whole-game strategy. Author at ~400 words with these beats:

```
[Paragraph 1 — Strategic shape]
What is this scenario really about? What's the dominant axis of play
(NATO defending Convoys; Soviets racing First Strike; etc.)?

[Paragraph 2 — NATO priorities]
What does NATO need to do in the first few turns? What units are critical?

[Paragraph 3 — Soviet priorities]
Same for Soviet. Where's the opportunity, where's the trap?

[Paragraph 4 — Decision points]
1-2 specific decisions the scenario turns on. Concrete and specific.

[Paragraph 5 — Pitfalls]
Common ways either side throws the game. Pull from forum corpus + Q&A.
```

Output field: `coachNotes` (single string, markdown).

## Sources — in priority order

1. **`src/data/blue-water-navy/rules.json`** — verbatim rules + `clarifications[]` (designer Q&A already attached per rule). 238 v1.17 sections.
2. **`docs/BWN/play-aids/*.md`** — Matt's edited play-aid pages with H2 chunks per workflow topic + trailing `(X.Y)` ruleRefs.
3. **`docs/BWN/actions/*.md`** — existing action markdowns already have grounded `## When does this come up?` and `## Procedure` sections. Read these to avoid contradicting yourself in the Coach section.
4. **`src/data/blue-water-navy/forum-knowledge.json`** — 3.6 MB curated BGG forum corpus.
   - **Tier 1** (designer-canonical): 1,257 posts by `stuuk` (Stuart Tonge) and `chezhinkle` (Mathew Hinkle). Use for design-intent insight.
   - **Tier 2** (designer-engaged community): 2,057 posts in threads where designer responded. Use for the **common-confusion mining** — these are the questions players actually asked.
   - **Tier 3** (community-vetted): 383 posts. Use sparingly.
5. **`docs/BWN/QA_BWN_V2.0.pdf`** — most already in rules.json clarifications, but check for anything missing.

## Output schema by surface

### SoP — `sequence.json` patch

Each phase or subPhase entry gains a new field:

```json
{
  "id": "convoy-placement",
  "name": "Convoy Placement",
  ...existing fields...,
  "coachContent": "[markdown — ~300 words, 5-paragraph shape]"
}
```

For subPhases (like `ops-event-fast`, `eot-cleanup`), the `coachContent` lives at the subPhase level too.

### Actions — markdown file edits

Each `docs/BWN/actions/act-*.md` currently has:

```markdown
## Why and what to watch for

<!-- COACH-PASS -->
```

Replace the `<!-- COACH-PASS -->` line with the authored Coach content (no leading
heading; the `## Why and what to watch for` heading stays).

### Cards — `cards.json` patch

Each card gains a `coachNotes` field. The renderer will display it below the card text.

```json
{
  "id": "soviet-1",
  ...existing fields...,
  "coachNotes": "[markdown — ~60-100 words]"
}
```

If multiple cards share identical ops + reaction events (common — e.g. all the
Spy Trawler cards), the agent should write the Coach once for the unique
combination and use it for every card with matching titles. Note this in the
agent's output.

### Scenarios — `scenario-book.json` patch

Each scenario in `scenarios[]` gains a `coachNotes` field.

```json
{
  "id": "boomer-bastion",
  ...existing fields...,
  "coachNotes": "[markdown — ~400 words, 5-paragraph shape]"
}
```

## Skeptical-student gotcha mining

For Actions and complex SoP entries, before writing the Coach, the author agent
should briefly search the forum corpus for the relevant topic ("ASW",
"submarine torpedo", "amphibious landing"), pull 3-5 Tier 2 questions / common
confusions, and bake those answers into Paragraph 3 (Gotchas). This is the
single most important value-add: address the questions players actually ask.

Tactic: `jq '.posts[] | select(.tier == 2 and (.text | test("submarine torpedo"; "i")))' src/data/blue-water-navy/forum-knowledge.json | head -20` (or similar regex).

## Verification before finishing

- [ ] Every targeted entry has Coach content (no skips)
- [ ] All rule citations are valid v1.17 sections (cross-check against `rules.json`)
- [ ] No "Stuart Tonge", "the designer", or "BGG" mentions in prose
- [ ] No em-dashes in output (use commas, periods, or parens instead)
- [ ] No emojis
- [ ] Word counts roughly in the target range
- [ ] Each Action's Coach is consistent with its existing Procedure section

## What NOT to do

- Don't author for the Rules tab — the user explicitly excluded it.
- Don't change existing fields (rules.json, action procedures, card text). Coach is **additive only**.
- Don't author Coach for any other game (GOSS, Next War). BWN only.
- Don't duplicate rule text verbatim — paraphrase, then cite the section.
- Don't author Coach for the AI Coach tab as a feature — that tab doesn't exist for BWN (features.learn = false). Per-action Coach lives inline in the Actions tab; SoP Coach lives inline in the SoP tab.
