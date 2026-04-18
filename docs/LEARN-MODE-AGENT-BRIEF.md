# Learn Mode — Agent Brief (Shared Guidance)

You're authoring pedagogical "Learn" content for the GOSS 2020 wargame companion app. Multiple agents are working in parallel on different SoP sections; you were assigned one section.

## Your goal

Produce a single JSON file that teaches a new player how to navigate the assigned SoP phase(s). Tone: like a terse friend at the table who knows the rules and explains *what to do and why*. Not a recitation of the rulebook.

## Inputs

1. **Rules data**: `src/data/goss/rules.json` — 595 entries, sections 1.0–26.0. Each entry has `section`, `title`, `summary`, `text`, `crossRefs`. Read the sections relevant to your assignment **before writing anything**.
2. **SoP data**: `src/data/goss/sequence.json` — the canonical sequence structure with existing `notes` arrays (user's hand-written tips — use these for tone calibration and for "what users found confusing").
3. **Glossary**: `src/data/glossary.ts` — defines common acronyms (GTRT, ADV, AP, TP, etc.). Use the exact acronyms; they auto-tooltip.
4. **Source PDF** (fallback only if rules.json is unclear): `docs/Bx_GOSS_Rules_2020-WEB.pdf`

## Your output

**One JSON file** at `src/data/goss/learn-fragments/<your-area>.json`, conforming to this schema (derived from `src/types/learn.ts`):

```jsonc
{
  "chapters": [
    {
      "id": "kebab-case-id",                    // e.g., "air-allocation"
      "title": "Human Title",                   // e.g., "Air Allocation Phase"
      "phaseRef": "sop-phase-id",               // matches id in sequence.json
      "ruleRef": "X.Y",                         // primary rule section
      "intro": "1-3 sentence overview explaining what the phase accomplishes and why it matters. Plain language. No recitation.",
      "decisions": [
        {
          "id": "decision-id",
          "title": "Player-Facing Decision Title",
          "when": "Context: when in the SoP this decision occurs. Include the rule ref in parens (X.Y.Z).",
          "ruleRefs": ["X.Y", "X.Y.Z"],        // key rule sections (rendered as clickable chips)
          "blocks": [
            { "kind": "prose", "text": "Markdown-ish text. Use **bold**. Inline refs in parens (X.Y.Z) become clickable." },
            { "kind": "prose", "text": "### Steps\n\n1) First step (X.Y.Z).\n2) Second step (X.Y.Z).\n3) Third step, with note on why." },
            { "kind": "callout", "variant": "gotcha", "text": "One sentence on a common mistake (X.Y.Z)." },
            { "kind": "ask", "items": ["Question 1 → action if yes", "Question 2 → action if yes"] },
            { "kind": "rule", "ruleRef": "X.Y.Z", "text": "Short pointer: 'Full procedure is in X.Y.Z — worth reading once.'" }
          ]
        }
      ]
    }
  ]
}
```

### Block kinds (pick what fits; do not overuse)

- **`prose`** — your main content. Markdown-ish: `**bold**`, `### headings`, numbered lists `1)` `2)`, bullets `-`. Inline `(X.Y.Z)` becomes a clickable rule badge. Keep paragraphs tight.
- **`callout`** — a single highlighted paragraph. Variants:
  - `gotcha` (orange) — a rule trap people miss
  - `why` (indigo) — designer intent or interaction explanation
  - `caution` (rose) — consequence warning ("if you skip this...")
  - `tip` (amber) — tactical advice
  - Use **sparingly**. 1–3 per decision. If you have 5+ gotchas, the decision is too broad — split it.
- **`ask`** — "Ask Yourself" bullet list. Each item is a question → decision guide. Good for synthesizing a decision.
- **`rule`** — a pointer to a rule ref with a one-line note. Use at the end of a decision to say "for the formal procedure, see X.Y.Z".
- **DO NOT USE `diagram`** — we're keeping v1 text-forward per user feedback. Numbered steps > diagrams.

## Content principles (hard rules)

1. **Every substantive claim must cite a rule ref in `(X.Y.Z)` format.** No "according to the rules" fluff — give the citation.
2. **DO NOT fabricate.** If you're not sure whether a rule says X, read the rule. If still unclear, omit the claim rather than guess.
3. **DO NOT hypothesize or invent examples.** ("Imagine you have 3 corps…" — NO.)
4. **Steps are prominent, visuals are not.** Numbered lists with rule refs are the backbone. Reserve prose paragraphs for explaining *why* a step exists.
5. **Match user's existing tip tone** — terse, practical, player-facing. Read the `notes` arrays in `sequence.json` for calibration. Second person ("you"). Active voice.
6. **Use the glossary acronyms as-is** (GTRT, ADV, TP, AP, etc.) — they auto-tooltip. Don't re-define them.
7. **One decision per meaningful choice point.** Not one per rule. If a segment has no real choice (just "roll a die"), it may only need one prose block, not a full decision.

## Good vs bad examples

**Bad (ad-libbed, vague):**
> "The designer wanted to simulate realistic supply chains, so ammo flows from depots through corps to formations in a cascade. The magic number is 3."

**Good (specific, cited):**
> "APs allocated to GI during the AM GT remain in effect for both AM and PM GTs — you only roll once per GD (20.3.1). If the modified AP count falls between two column values on the Interdiction Value Table, use the lower column; don't round up (20.3.1)."

**Bad (diagram-first):**
> Pretty 5-stage SVG pipeline with colored boxes.

**Good (steps-first):**
> ```
> ### Steps
> 1) Determine AP assigned to GI (20.3.1).
> 2) Adjust for atmospheric conditions (19.3.0).
> 3) Resolve enemy ASup missions. GI player cannot escort (20.3.1).
> 4) Adjust AP based on any ASup results.
> 5) Locate adjusted AP on top row of Interdiction Value Table. If between columns, use lower.
> 6) Roll 1d10, apply weather DRM: −1 POvr, −2 POvr w/rain or Ovr, −3 Ovr w/rain.
> 7) Cross-index DR with AP. Left value = Leg; right value = Mech (20.3.1).
> ```

## Scope discipline

- **~3–7 decisions per chapter.** More = split. Fewer = you under-covered.
- **Chapter `intro`: 1–3 sentences.** Not a mini-essay.
- **Each `prose` block: under 150 words.** If you need more, split into multiple blocks with sub-headings.
- **Pre-existing user tips** (the `notes` arrays in sequence.json) are your FIRST PASS of content. Rewrite them into the learn structure; don't duplicate them.

## Player-turn note

Allied and Axis player turns mirror each other structurally. Write ONE chapter per phase (e.g., "Movement Phase") and note asymmetries via prose/callout. Don't produce duplicate Allied and Axis chapters.

## Final check before you write output

- [ ] Did I actually read the rules, or am I paraphrasing my assumptions?
- [ ] Every `(X.Y.Z)` in my output corresponds to a real rule entry.
- [ ] I used callouts sparingly (≤3 per decision).
- [ ] No hypothetical scenarios.
- [ ] No diagram blocks.
- [ ] JSON is valid (run it through a linter mentally — commas, brackets).
