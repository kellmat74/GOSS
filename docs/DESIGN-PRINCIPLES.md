# Wargame Assistant App — Design Principles

A guide for building interactive companion apps for complex tabletop wargame systems, distilled from the GOSS Assistant project. Use this alongside the GOSS codebase as a seed for new game system assistants.

---

## 1. Architecture Overview

### Tech Stack
- **React 18+ / TypeScript / Vite** — fast builds, type safety, hot reload
- **Tailwind CSS** — dark mode first, utility classes, stone palette with amber accents
- **ReactFlow** (`@xyflow/react`) — optional flowchart visualization for Sequence of Play
- **GitHub Pages** via GitHub Actions — zero-cost static hosting, auto-deploy on push
- **Cloudflare Worker** — lightweight API proxy for AI Ask feature (free tier: 100k req/day)
- **vite-plugin-singlefile** — produces a self-contained HTML for offline/iPad use

### Core Views (tabs)
1. **Steps** — Walk through the Sequence of Play phase by phase with content, checklists, tips
2. **Flowchart** — Visual SoP flowchart with drill-down nodes (optional, high effort)
3. **Rules** — Searchable tree of all extracted rules with modal detail view
4. **Ask** — AI-powered Q&A grounded in the actual rule text
5. **Info** — About page, offline export link

### Data Flow
```
Source PDFs → Extract to JSON → App loads JSON → Merge overlays → Render
                                                  ↑
                                          Game selector + Scenario selector
```

---

## 2. The Rules Data Model

### Structure (`RuleEntry`)
```typescript
interface RuleEntry {
  id: string;           // unique, e.g., "goss-3.2.1"
  section: string;      // hierarchical, e.g., "3.2.1"
  title: string;        // short descriptive title
  summary: string;      // 1-2 sentence summary
  text: string;         // full verbatim rule text
  crossRefs: string[];  // related section IDs
  module?: string;      // undefined = base rules, "war" = scenario-specific
}
```

### Key Principle: Verbatim Text, Always
**Never paraphrase or summarize the rules in the `text` field.** Copy them word-for-word from the source material. Players need the exact wording for dispute resolution and edge cases. AI-generated summaries should be avoided — users trust the Rules As Written (RAW).

When `summary` equals `text` (common for short rules), the UI should hide the summary to avoid duplication.

### Section ID Normalization
Section numbering varies between PDFs (some use `3.2.0`, others `3.2`). The lookup system must handle both:
- Try exact match first
- Try stripping trailing `.0`
- Try adding `.0`
- Store both variants in the lookup map

### Cross-References as Clickable Links
Always write rule references in parenthesized format: `(3.2.1)`. The `RuleInlineText` component parses these into clickable links that open the rule modal. This works everywhere: notes, descriptions, content, tips.

**Good:** `"Artillery units can conduct FS missions (5.6.0)."`
**Bad:** `"Artillery units can conduct FS missions — see rule 5.6.0."` (won't auto-link)

---

## 3. The Sequence of Play Data Model

### Structure (3-level hierarchy)
```
Phase → SubPhase → Segment
```

Each level has:
```typescript
interface SubPhase {
  id: string;             // kebab-case, e.g., "allied-movement-segment"
  name: string;           // display name
  ruleRef?: string;       // link to governing rule section
  timing?: PhaseTiming;   // "every-turn" | "am-only" | "night-only" | etc.
  player: Player;         // "both" | "phasing" | "non-phasing" | etc.
  description: string;    // brief description of what happens
  content?: string;       // verbatim PAC markdown (procedures, tables)
  notes: string[];        // gameplay tips (value-add layer)
  checklist: string[];    // step-by-step items to check off
  subPhases?: SubPhase[]; // nested segments
}
```

### Content vs. Notes: Two Distinct Layers

**`content`** = Verbatim text from the Player Aid Cards (PACs) / reference sheets. Procedures, tables, step-by-step instructions exactly as published. Rendered with `SoPMarkdown` which supports headings, bold, lists, tables, and clickable rule refs.

**`notes`** (Tips) = Original value-add content written for new players. Decision guidance, common mistakes, cross-phase awareness, timing advice. This is where the assistant provides unique value beyond the rulebook.

**Never mix these.** Content is authoritative reference material. Tips are advisory. They have different visual treatments (content is neutral, tips have amber accent styling with 💡 icon).

---

## 4. The Overlay System (Game Modules)

Wargame systems often have a base rulebook plus scenario-specific rules. The app handles this with two parallel overlay systems:

### Rules Overlay (`mergeRules`)
- Base rules always appear in their section position
- Scenario rules with matching sections appear **after** the base rule (side-by-side in modal)
- New scenario-only sections are inserted in sort order
- Module badge (e.g., "WaR", "HHF") identifies scenario-specific content

### Sequence Overlay (`mergeSequence`)
More complex — uses a modification-based approach:
```typescript
interface SequenceOverlay {
  module: string;           // e.g., "hurtgen"
  moduleLabel: string;      // e.g., "HHF"
  modifications: SequenceModification[];
  scenarioOverrides?: Record<string, ScenarioOverride>;
}

interface SequenceModification {
  target: string;           // item id to modify
  action: "modify" | "add" | "remove" | "gate";
  gate?: string;            // blue callout banner text
  patch?: {
    appendContent?: string; // scenario content below base content
    appendNotes?: string[]; // scenario tips appended to base tips
  };
  item?: SubPhase;          // for "add": full item to insert
  insertAfter?: string;     // for "add": sibling id
}
```

**Actions:**
- **`gate`** — Adds a blue info banner (e.g., "This phase is NOT used in Scenario 1")
- **`modify`** — Appends scenario-specific content/notes to existing item
- **`add`** — Inserts a new sub-phase/segment
- **`remove`** — Removes a phase/segment entirely

### Per-Scenario Overrides
Within a game module, individual scenarios can have different rules. The overlay supports a `scenarioOverrides` map:
```json
{
  "modifications": [ /* base game-module mods, apply to all scenarios */ ],
  "scenarioOverrides": {
    "scenario-1": {
      "label": "Scenario 1: Learning",
      "modifications": [ /* additional mods for this scenario only */ ]
    }
  }
}
```

Application order: base modifications first, then scenario-specific on top. The `mergeSequence` function accepts an optional scenario ID parameter.

### UI: Game Selector + Scenario Selector
- Primary dropdown: game module (base, WaR, HHF, LF, AW)
- Secondary dropdown: appears only when a game is selected and has >1 scenario
- "All Scenarios" option shows only the base game-module overlay
- Selections persisted in localStorage
- Changing game resets scenario to null

---

## 5. The Ask Panel (AI Q&A)

### Architecture
```
User question → searchRules() + searchSequence()
              → Build system prompt with relevant context
              → Send to LLM via Cloudflare Worker proxy
              → Render response with clickable rule refs
```

### Key Design Decision: Search-then-Prompt
**Do NOT send the entire rulebook to the LLM.** Even with large context windows, this wastes tokens and degrades quality. Instead:

1. **`searchRules(query, rules, maxResults=20)`** — Keyword search with field-weighted scoring (title=10, section=5, summary=3, text=1). Stop words filtered. Returns top matches.
2. **`searchSequence(query, phases, maxResults=5)`** — Same approach for SoP content/tips (name=8, notes=3, content=2).
3. **`buildSystemPrompt(topRules, summaryRules, sequenceItems)`** — Top 5 rules get full text, next 15 get summaries only, plus top 5 sequence matches.

This keeps the context window focused and the responses accurate.

### Cloudflare Worker Proxy
The Ask panel calls an LLM API. Since the app is a static site (GitHub Pages), API keys can't be embedded. Solution: a Cloudflare Worker that:
- Holds the API key as a secret (`wrangler secret put ANTHROPIC_API_KEY`)
- Accepts POST requests with the system prompt and user message
- Proxies to the LLM API and returns the response
- CORS allows localhost (dev) and the production domain
- Uses a fast/cheap model (Haiku) since the context is pre-filtered

### Response Rendering
LLM responses render through the same `RuleInlineText` component, so any `(X.Y.Z)` references in the AI's response become clickable links to the rule modal. The system prompt explicitly instructs the LLM to cite sections in parenthesized format.

---

## 6. PDF Extraction Strategy

Extracting rules from game PDFs is the most labor-intensive step. Lessons learned:

### Parallelization is Essential
- Split large PDFs by page range (e.g., 6 agents covering 40 pages each)
- Each agent writes to a separate fragment JSON file
- A merge step combines fragments, deduplicates, and sorts
- For 500+ rules, expect 2-3 extraction passes

### Page Boundaries Cause Missed Sections
Rules that span page boundaries are frequently missed by extraction agents. Always do a completeness audit:
1. Count extracted sections vs. expected (from table of contents)
2. Run a follow-up pass targeting gaps
3. Verify cross-references resolve

### Copy Source PDFs Into the Repo
Store PDFs in `docs/` within the repo. Cloud storage paths (iCloud, Google Drive) are unreliable for agent access. Having the PDF in-repo ensures reproducible extraction.

### Section ID Consistency
Different PDFs use different numbering conventions. Normalize during extraction:
- Base rules: `3.2.1` (no trailing `.0` for sub-sections)
- Some scenario PDFs: `3.2.0` for the same section
- The merge system handles both, but consistent extraction prevents confusion

---

## 7. UI/UX Patterns

### Modal System for Rules
- Portal-based (`createPortal`) to avoid z-index and scroll issues on mobile
- History stack with back button for cross-reference navigation
- Escape to close (or go back through history)
- Shows base + scenario rules side-by-side when both exist

### Clickable Rule References Everywhere
The `RuleInlineText` component is used in: step descriptions, notes/tips, checklists, flowchart nodes, flowchart detail panel, breadcrumbs, sidebar, scenario gate banners, and AI responses. Amber = rule found and clickable, grey = not found.

### Scenario Gate Banners
When a phase is modified or skipped by a scenario, a blue banner appears at the top of the step with the scenario badge and explanation. This is non-destructive — the base content remains visible below.

### Dark Mode First
Most wargame sessions are long (8+ hours). Dark mode reduces eye strain. The stone palette with amber accents provides good readability without harshness.

### iPad / Mobile Considerations
- `position: fixed` modals must use `createPortal(…, document.body)` — iOS Safari breaks otherwise
- `onClick` works on modern iPad Safari — don't add redundant `onTouchEnd` (causes double-firing)
- ReactFlow intercepts touch events — check `target.closest("button")` in `onNodeClick` to let badge clicks through
- Scroll-to-top on step navigation prevents users from landing mid-page after Next/Prev

### Checklist State
- Auto-clears when navigating to next/prev step (deliberate — forces re-verification each turn)
- Manual reset button available
- State persisted to localStorage

---

## 8. Deployment & Testing

### GitHub Actions Pipeline
```yaml
on: push to main → npm ci → npm run build → upload to GitHub Pages
```

Also builds a single-file HTML (`vite-plugin-singlefile`) for offline use. The single-file build is copied into the dist as `GOSS-Assistant.html`.

### Testing on External Devices
- Always commit and push before testing on iPad/phone
- Safari caches aggressively — use new incognito tabs after deploy
- Stale cache from old deploys is the #1 "not working" cause

---

## 9. Project Bootstrapping Checklist

When starting a new game system assistant:

1. **Copy the GOSS codebase** as a template
2. **Extract base rules** from the rulebook PDF into `src/data/{game}/rules.json`
   - Use parallel extraction agents (5-9 depending on PDF size)
   - Verify completeness against table of contents
   - Normalize section IDs
3. **Build the sequence of play** in `src/data/{game}/sequence.json`
   - 3-level hierarchy: Phase → SubPhase → Segment
   - Add `content` fields with verbatim PAC text
   - Leave `notes` arrays empty initially
4. **Extract scenario rules** for each game module
   - One `rules.json` per scenario in `src/data/{scenario}/`
   - Overlay JSON for sequence modifications
5. **Populate tips** after content is complete
   - Reference specific tables, procedures, section numbers
   - Focus on decision guidance and common mistakes
   - No limit per item — some phases merit 10+ tips
6. **Set up the Cloudflare Worker** for the Ask panel
   - Clone the worker template from `worker/`
   - Update CORS origins for the new domain
   - Set API key as a Worker secret
7. **Wire game/scenario selectors** in the UI
   - Define game options and scenario lists in `GameSelector.tsx`
   - Create overlay JSONs for each game module
8. **Deploy and test on target devices**

---

## 10. Content Principles

### Rules Text
- **Verbatim.** Copy exactly from the source. Include all sub-clauses, exceptions, and edge cases.
- **Parenthesized references.** Always `(X.Y.Z)` so they auto-link.
- **Bold key terms.** Use `**bold**` for important terms that the parser will render.

### Tips (Notes)
- **Practical.** "Do X because Y" not "Rule Z says..."
- **Specific.** Reference exact tables, procedures, and section numbers.
- **Cross-phase aware.** "Plan this now because it affects Phase X later."
- **New-player focused.** Assume they've read the rule but don't yet see the implications.
- **No game-specific content in base tips.** Tips should reference only the base rules system, not scenario-specific rules. Scenario tips go in the overlay.

### Scenario Content
- **Gates for skipped phases.** If a scenario doesn't use a phase, add a gate banner — don't remove the phase (the content is still educational).
- **Appended content for modifications.** Scenario-specific procedures appear below base content with a blue divider and module badge.
- **Appended tips for scenario advice.** Scenario-specific tips appear in a separate blue-accented section.

---

## 11. File Organization

```
src/
  data/
    {base-game}/
      rules.json              # base rules (verbatim from rulebook)
      sequence.json           # SoP with content + tips
    {scenario-1}/
      rules.json              # scenario-specific rules
      sequence-overlay.json   # SoP modifications + per-scenario overrides
    {scenario-2}/
      ...
  components/
    Layout/
      AppShell.tsx            # shell with sidebar, header, tabs
      GameSelector.tsx        # game + scenario dropdowns
    SequenceOfPlay/
      PhaseStepper.tsx        # main step-by-step view
      PhaseOverview.tsx       # sidebar navigation
      SoPMarkdown.tsx         # markdown renderer with rule links
    RulesReference/
      RulesSearch.tsx         # searchable rules tree
      RuleModal.tsx           # portal-based rule detail modal
      RuleRefBadge.tsx        # clickable §X.Y.Z badge
      RuleInlineText.tsx      # inline (X.Y.Z) parser
    Ask/
      AskPanel.tsx            # AI Q&A with search-then-prompt
    Flowchart/
      SoPFlowchart.tsx        # ReactFlow visualization
  context/
    RulesContext.tsx           # global rules provider + modal state
  hooks/
    useSoPProgress.ts         # step navigation + checklist state
  utils/
    mergeRules.ts             # base + scenario rules merge
    mergeSequence.ts          # base + overlay SoP merge
    rulesSearch.ts            # keyword search for rules + sequence
  types/
    goss.ts                   # all TypeScript interfaces
docs/
  *.pdf                       # source PDFs (keep in repo)
worker/
  src/index.ts                # Cloudflare Worker proxy
  wrangler.toml               # Worker config
```

---

## 12. Versioning

- Increment sub-version on every push (v2.4 → v2.5)
- Major version only on explicit request
- Version displayed in sidebar header
- Track changelog in project memory files, not in-app
