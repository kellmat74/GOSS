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
5. **Info** — About page, offline export link, feedback form

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
- **Prev/Next navigation** — footer buttons + Left/Right arrow keys let users read sequentially through rules without closing and reopening the modal
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

#### The Verbatim Rule: Everything From the Rulebook Must Be As Written
This applies to **all** scenario content — inserted phases, appended content, everything. Never paraphrase, reorganize into tables, or consolidate multiple rules into a summary. If the rule says it in prose, show it in prose. If players need a quick-reference table, that's what Tips are for.

#### Inserted Phases (Entirely New SoP Phases)
When a scenario adds phases that don't exist in the base SoP (e.g., Pre-Dawn Surprise GT, Airborne Assault Stage, Amphibious Assault Stage):
- Use `action: "add"` with `insertAfter` to place the new phase in the correct SoP position
- **Parent phase content:** Set to verbatim rule text. If the rule is monolithic (one rule section covering the whole phase), put only the preamble/overview on the parent.
- **Sub-phases:** If a monolithic rule naturally divides into sub-sections (e.g., "German Mode Determination Phase... German Movement Phase... German Combat Phase"), split the verbatim text so each sub-phase gets its relevant portion. Keep the exact wording — just divide at the natural boundaries.
- **Per-section sub-phases:** When each sub-phase maps to its own rule section (e.g., AW 41.1.0, 41.2.0, 41.3.0), set each sub-phase's content to that section's verbatim text.
- Use `ruleRef` on each sub-phase so the section badge links correctly.

#### Appended Content on Existing Phases (`appendContent`)
When a scenario modifies an existing base SoP phase:
- Use `action: "modify"` with `patch.appendContent`
- Content must be **verbatim rule text** from the referenced sections
- Format: `### Rule Title (section)\n\nverbatim text`
- **One section per heading block.** Don't merge multiple rules into one block.
- **Trim to relevance.** If a monolithic rule covers mode, movement, AND combat but this step is just about movement, include only the movement portion. Still verbatim — just the relevant excerpt.
- **Duplication is OK when appropriate.** If the same rule genuinely applies to both Allied and Axis construction phases, it's fine to show it on both steps. Players shouldn't have to navigate away to see the rule that governs what they're doing.
- **Don't fabricate tables or timelines.** If the source rule uses prose ("May not conduct hasty bridge demolition until the Dec 16 PM GT"), show the prose. Don't reorganize it into a markdown table. Reorganized reference tables belong in Tips, not content.

#### Appended Tips for Scenario Advice (`appendNotes`)
- Scenario-specific tips appear in a separate section with the module badge
- Tips CAN organize, summarize, and create reference tables — this is the value-add layer
- Tips can synthesize information from multiple rules into consolidated guidance
- Always cite source sections in parenthesized format so they auto-link

#### Scenario Scope: Which Scenarios See Which Modifications
- Modifications in the base `modifications` array apply to ALL scenarios in that game module
- Use `scenarioOverrides` for modifications that only apply to specific scenarios
- If a modification applies to most but not all scenarios, put it in base modifications and use `action: "remove"` in the excluded scenario's overrides to remove it
- Example: WaR Pre-Dawn GT applies to Dec 16 scenarios (1-5) but not Dec 21+. Put it in base modifications, add a remove action in dec21 overrides.

#### Parenthesized References in Overlay JSON
Overlay content goes through the same `SoPMarkdown` → `RuleInlineText` pipeline, so references must use `(X.Y.Z)` format. Write `WAR (9.2.0)` not `WAR 9.2.0` — the prefix gives context while the parens enable auto-linking.

#### Gates for Skipped Phases
If a scenario doesn't use a phase, add a gate banner — don't remove the phase (the content is still educational).

---

## 11. Scenario Rules Extraction

### Extract ALL Scenario-Specific Sections
Don't stop at the rules that overlap with the base rulebook. Game modules typically have:
- **Overlapping sections** that modify base rules (e.g., WAR 9.2.0 modifying base 9.2.0)
- **Scenario sections** with setup, victory conditions, special rules, reinforcement schedules

Both must be extracted into the scenario's `rules.json`. Without scenario sections, rule references in overlay content (e.g., `(30.3.0)`) won't resolve as clickable links because `getRuleBySection()` won't find them.

### Typical Scenario Section Structure
Most wargames follow a pattern:
- **Scenario overview/presentation** (maps, counters, setup format)
- **Per-scenario blocks** (each with length, special rules, setup, reinforcements, victory conditions)
- **Campaign game** (combining multiple scenarios)
- **Special modules** (airborne, amphibious, strategic map — game-specific)

### Extraction Strategy for Scenarios
- Use parallel agents split by section range (e.g., one agent per scenario)
- Large modules (Airborne: 41.x, Amphibious: 42.x) may need their own agent
- Validate that every section referenced in the overlay content exists in rules.json

---

## 12. File Organization

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

## 13. User Feedback Integration

### Google Sheets via Apps Script
The Info tab includes a Submit Feedback form that posts directly to a Google Sheet — no backend required.

**Architecture:**
```
User fills form → fetch(APPS_SCRIPT_URL, { mode: "no-cors" }) → Google Apps Script → Google Sheet
```

**Setup:**
1. Create a Google Sheet with columns: Timestamp, Name, Type, Feedback
2. Create a Google Apps Script web app that accepts POST and appends rows
3. Deploy the script as a web app with "Anyone" access
4. Set `VITE_FEEDBACK_URL` as an environment variable (local `.env` for dev, GitHub Actions variable for prod)
5. Add `.env` to `.gitignore` — never commit the Apps Script URL

**Why `no-cors`?** Apps Script redirects POST responses, which causes CORS errors in the browser. Using `mode: "no-cors"` makes the response opaque (unreadable), but the POST still goes through and the row is appended. The UI shows a success message unconditionally after the fetch resolves — the user sees "Thanks for your feedback!" without needing to read the response.

**Form fields:** Name (optional), feedback type dropdown (Bug, Feature Request, Question, Other), free-text description. Keep it minimal — users abandon long forms.

---

## 14. Per-Scenario Overlay Tiers

Some game modules have scenarios at different complexity levels, each with different SoP modifications. The overlay system handles this with per-scenario overrides.

### Example: Atlantic Wall Scenario Tiers
AW has three tiers of scenario complexity:

**Introductory (Scenarios 1-3):** Drastically simplified SoP
- Airborne and Amphibious stages removed (gate banners explain why)
- Many standard phases gated ("Ignore GOSS (3.2.0) thru (3.5.0) and (9.0)")
- Simplified logistics, fire support, movement, construction rules
- Each scenario has unique air points, weather, bridges, victory conditions

**Intermediate (Scenarios 4-5):** Most rules in effect
- Airborne and Amphibious stages still removed (no D-Day landing)
- Full SoP but some sub-phases skipped or modified
- Simplified logistics (no full Logistics Table, no Strategic Map)
- Each scenario has unique logistics values, reinforcement schedules

**Full (Scenario 6 / Campaign):** All rules
- Both Airborne and Amphibious stages active
- Full SoP with all phases
- Scenario-specific values for air, naval, weather, logistics

### Implementation Pattern
```json
{
  "modifications": [
    // Base game-module mods that apply to ALL scenarios
  ],
  "scenarioOverrides": {
    "scenario-1-goodwood": {
      "label": "Scenario 1: Operation Goodwood",
      "modifications": [
        // Gate banners for removed phases
        { "target": "aw-airborne-assault-stage", "action": "gate",
          "gate": "Airborne Assault Stage is not used in introductory scenarios (AW (31.0))." },
        // Per-scenario rules as appendContent
        { "target": "joint-air-allocation-phase", "action": "modify",
          "patch": { "appendContent": "### Air Points (32.3.0)\n\nverbatim rule text..." } }
      ]
    }
  }
}
```

### Gate Banner Content
Gate banners should use verbatim rule text explaining why the phase is skipped, not AI-generated explanations. Example: the AW introductory gate says "Ignore GOSS (3.2.0) thru (3.5.0) and (9.0)" — that's the actual text from AW 31.1.0.

---

## 15. Common Pitfalls (Lessons Learned)

### AI-Generated Content Creep
The most insidious issue: AI assistants will paraphrase, reorganize, and "improve" rule text without being asked. This manifests as:
- **Summarized tables** replacing prose rules (e.g., "Allied may not demolish until Dec 16 PM" becomes a timeline table)
- **Consolidated blocks** merging multiple scattered rules into one tidy paragraph
- **Added context** like "this is a major complexity increase" that isn't in the source
- **Checklists** that are duplicative of the rules text

**Checklists are especially problematic.** AI-generated checklists in overlay content duplicate the rules in a reformatted way, which creates a maintenance burden and risks divergence from the source. Remove them — the verbatim rules are the checklist. The base SoP `checklist` arrays are fine since those come from the PAC, but scenario overlays should not add new checklists.

**Prevention:** After any AI-assisted content generation, audit every `content` and `appendContent` field against the source rules. Use a script to compare overlay text against `rules.json` entries. Tips/notes are the ONLY place for AI-original content.

### Monolithic Rules Need Splitting
Some rule sections (e.g., WAR 30.2.0) cover an entire special GT in one block — mode determination, movement, AND combat all in one section. When this maps to multiple sub-phases in the SoP, split the verbatim text at natural boundaries. Each sub-phase gets its relevant portion; the parent gets the preamble.

### Full Rule Text on Wrong Steps
When the same rule section applies to multiple SoP phases, don't dump the entire rule on every step. Excerpt the relevant portion for each step. Still verbatim — just the part that matters for that specific phase.

### Missing Scenario Rules Break Links
If overlay content references `(30.3.0)` but that section doesn't exist in the scenario's `rules.json`, it renders as grey (unclickable) text. Always extract ALL scenario rule sections — not just the ones that overlap with base rules.

---

## 16. Order of Battle Visualizer

### Per-Scenario OOB Data
The OOB visualizer shows military organizational hierarchy as a collapsible tree. Data is keyed by scenario ID so each scenario shows only its relevant formations.

```json
{
  "all": {
    "allied": { "label": "Allied Forces", "children": [...] },
    "german": { "label": "German Forces", "children": [...] }
  },
  "scenario-1": {
    "allied": { "label": "Allied Forces", "children": [...] },
    "german": { "label": "German Forces", "children": [...] }
  }
}
```

Each node: `{ "id": "...", "label": "...", "type": "army-group|army|corps|division", "children": [...] }`

### Unit Structure Reference Tab
A third tab shows the generic military hierarchy (AG → Army → Corps → Div → Rgt/Bde → Bn → Co/Bty → Plt) with distinct color badges per level. This is educational — many players are unfamiliar with military organizational structure.

Lower-unit types (regiment, battalion, company, platoon) use their own badge colors (violet, cyan, rose, stone) distinct from the upper-hierarchy colors (amber, blue, emerald, stone).

### Data Source: Scenario Rules Only
OOB data should be extracted from scenario setup rules, reinforcement schedules, and activation lists — **not** from general military knowledge. Only include formations explicitly confirmed in the rules text. AI-generated "typical division assets" should not be included.

### Future Enhancement
Scenario reinforcement schedules contain detailed unit-to-formation attachment information (e.g., "79th VG Div {11 units}, Attached; 1 x AT BU Co."). This could be used to add an attached assets layer to the OOB tree, showing which support units are assigned to each formation.

---

## 17. Quick Reference Sidebar

### Pattern
A narrow floating icon strip on the right edge of the viewport with buttons for frequently-referenced game data (TEC, Stacking Limits, OOB). Each opens a portal-based modal.

### Data Sources
- **Stacking Limits:** Extracted from rules JSON (sections 6.0-6.7.0) — fully available in rules PDFs
- **TEC (Terrain Effects Chart):** Often NOT in the rules PDF — exists only on physical Player Aid Cards. May require a scan/photo of the physical PAC to extract. The rules text says "see TEC" without including the actual table.
- **OOB:** Extracted from scenario setup/reinforcement rules (see section 16)

### Lazy Loading
OOB data is lazy-loaded per game module via dynamic `import()`. The OOB button only appears when the selected game module has an `oob.json` file. TEC and Stacking are always available (base game data).

---

## 18. Persistent SoP Panel

The PhaseOverview sidebar should remain visible across all tabs (Steps, Rules, Ask, Flowchart, Info) so players can always see where they are in the sequence. Clicking a step from a non-Steps tab switches to the Steps view and navigates to that step.

---

## 19. Ask Panel Enhancements

### Module/Scenario Boosting in Search
The `searchRules` function must include the `module` field in scoring. When a query mentions a game name (e.g., "Atlantic Wall", "AW"), all rules with matching `module` field get a score boost. Without this, scenario-specific rules rank too low and the LLM says "I don't have those rules."

Map game name aliases to module IDs: "atlantic wall"/"aw" → "atlantic-wall", "wacht am rhein"/"war"/"bulge" → "war", etc.

### Q&A History Persistence
Store messages in localStorage so they survive page reloads. Add a History modal for browsing past Q&A with search/filter capability. Session grouping by date helps organization.

### Copy Button
Include both the question AND answer when copying an assistant message. Format cleanly for pasting into email/text.

---

## 20. HTML Nesting: Avoid `<button>` Inside `<button>`

Clickable rule references (`RuleRefBadge`, `RuleInlineText`) are used inside clickable containers (sidebar buttons, accordion headers). HTML doesn't allow `<button>` nested inside `<button>`.

**Solution:** Use `<span role="button" tabIndex={0}>` with `onClick` and `onKeyDown` handlers (Enter/Space). This provides identical behavior and accessibility without the nesting violation. The `e.stopPropagation()` pattern ensures the inner click doesn't trigger the outer container's handler.

---

## 21. Versioning

- Increment sub-version on every push (v2.4 → v2.5)
- Major version only on explicit request
- Version displayed in sidebar header
- Track changelog in project memory files, not in-app
