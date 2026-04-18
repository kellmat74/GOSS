# GOSS Assistant — Project Notes

## Overview
Interactive companion app for the **GOSS (Grand Operational Simulation Series) 2020** tabletop wargame system. Built with React + TypeScript + Vite, deployed to GitHub Pages.

**Live:** https://kellmat74.github.io/GOSS/

## Architecture

### Tech Stack
- React 18 + TypeScript + Vite
- Tailwind CSS (dark mode, stone palette with amber accents)
- ReactFlow (`@xyflow/react`) for flowchart visualization
- GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

### Key Data Files
- `src/data/goss/sequence.json` — Sequence of Play phases, sub-phases, checklists, notes
- `src/data/goss/rules.json` — 595 base rule entries (sections 1.0–26.0, GOSS System Rules 2020)
- `src/data/goss/war/rules.json` — 189 Wacht am Rhein scenario rules
- `src/data/goss/hurtgen/rules.json` — 74 Hurtgen scenario rules
- `src/data/goss/lucky-forward/rules.json` — 103 Lucky Forward scenario rules
- `src/data/goss/atlantic-wall/rules.json` — 237 Atlantic Wall scenario rules
- `src/data/goss/learn.json` — merged Learn content (25 chapters, 66 decisions)
- `src/data/goss/learn-fragments/*.json` — source fragments (merge via script)
- `src/data/goss/hurtgen/learn-overlay.json` — HHF scenario-specific pedagogy
- `src/utils/mergeRules.ts` — Merges base + scenario rules (matching sections shown side-by-side, new sections inserted in sort order)
- `docs/Bx_GOSS_Rules_2020-WEB.pdf` — Source PDF (base rules)
- `docs/Bx_WaR_2020-WEB.pdf` — Source PDF (Wacht am Rhein)
- `docs/Bx_Hurtgen_2016-WEB.pdf` — Source PDF (Hurtgen)
- `docs/Bx_LuckyForward_2020-WEB.pdf` — Source PDF (Lucky Forward)
- `docs/Bx_AtlanticWall_2016-WEB.pdf` — Source PDF (Atlantic Wall)

### Views (tabs in AppShell)
1. **SoP** (`PhaseStepper`) — Step-through each SoP phase with **verbatim** descriptions + content. Tips no longer render here (migrated to Learn). Segment-level Prev/Next.
2. **Learn** (`LearnPanel`) — Pedagogical companion; one chapter per SoP phase/sub-phase. **Chapter-level Prev/Next** ("page turn") via SoP tree walk. Sidebar drives scroll + amber-ring highlight to the decision matching the current segment.
3. **Rules** (`RulesSearch`) — Searchable tree of rules, click to open modal
4. **Ask** (`AskPanel`) — AI-powered Q&A across all loaded rules
5. **Info** — About/help

Flowchart tab deprecated in v4.3 (`features.flowchart: false` in `src/data/goss/config.ts`) — content was stale. Sidebar is labeled **INDEX** and drives both SoP and Learn tabs (via `handleSidebarSelect` in `App.tsx`, which only force-switches to SoP if user is on a progress-indifferent tab like Rules/Ask/Info).

### Learn Mode System (v4.3)
- **`src/types/learn.ts`** — `LearnChapter`, `LearnDecision`, `LearnBlock` (kinds: `prose`, `callout` [why/tip/caution/gotcha], `ask`, `rule`; **no `diagram`** — user prefers text-forward), `LearnOverlay` (parallels `SequenceOverlay`).
- **`src/data/goss/learn.json`** — merged output (never hand-edit).
- **`src/data/goss/learn-fragments/*.json`** — per-area hand-authored fragments.
- **`src/data/goss/hurtgen/learn-overlay.json`** — HHF overlay (20 base mods + 27 scenario mods across 5 HHF scenarios).
- **`scripts/merge-learn-fragments.mjs`** — concatenates fragments into learn.json.
- **`scripts/compare-notes-to-learn.mjs`** — generates `docs/notes-vs-learn-comparison.md` coverage audit.
- **`docs/LEARN-MODE-AGENT-BRIEF.md`** — mandatory reading for any agent authoring Learn content.
- Five parallel agents authored the initial 25 chapters / 66 decisions covering the full SoP.
- **Content principle:** every substantive claim must cite `(X.Y.Z)`. No hypotheticals. No invented examples.
- Allied/Axis player turn chapters are written once; prefix normalization (`allied-*`/`axis-*`/`enemy-*`) + suffix normalization (`-phase`/`-segment`/`-in-*-turn`) lets one chapter match mirrored SoP ids.

### Rules Reference System
- **`RulesContext`** (`src/context/RulesContext.tsx`) — Global provider with `openRule()`, `closeRule()`, `goBack()`, `getRuleBySection()`. Modal state + history stack.
- **`RuleModal`** (`src/components/RulesReference/RuleModal.tsx`) — Portal-based overlay (z-100). Shows section badge, title, full text with parsed formatting, cross-ref "See Also" links. History navigation with back button.
- **`RuleRefBadge`** (`src/components/RulesReference/RuleRefBadge.tsx`) — Clickable `§X.Y.Z` badge. Amber = clickable (rule found), grey = not found. Uses `e.stopPropagation()` + `e.preventDefault()`.
- **`RuleInlineText`** (`src/components/RulesReference/RuleInlineText.tsx`) — Parses `(X.Y.Z)` patterns in any text into clickable rule links. Used in PhaseStepper notes/checklists/descriptions and NodeDetailPanel.

### Scenario Rules Overlay System
- **Game Selector** (`GameSelector.tsx`) — Dropdown in header: GOSS Base, Wacht am Rhein, Hurtgen, Atlantic Wall, Lucky Forward
- Selection stored in localStorage (`goss-game-module`), state in `App.tsx`
- `mergeRules()` combines base + scenario: matching sections appear side-by-side in modal (base above, scenario below with blue divider/badge), new sections inserted in sort order
- Module badge labels: short codes for tree/search (WaR, HHF, LF, AW), full names for modal dividers
- All consumers receive merged array: `RulesProvider`, `RulesSearch`, `AskPanel`

### Section ID Normalization
- `getRuleBySection` handles `.0` suffix mismatches: tries exact match, then stripped `.0`, then added `.0`. The ruleMap in context also stores alt keys.
- Scenario rule extraction must normalize section IDs to match base conventions (some PDFs use X.Y.0 where base uses X.Y, or vice versa). Automated during merge step.

### Flowchart Event Handling
- `ReactFlowChart.onNodeClick` checks `target.closest("button")` to avoid drill-down when clicking RuleRefBadge or info buttons
- FlowNode info button dispatches `CustomEvent("flownode-info")` for the detail panel

### Checklist Behavior
- Auto-clears checklist items when navigating to next/prev step
- Reset button in checklist header for manual clear
- State persisted to localStorage via `useSoPProgress` hook

### Time of Day Toggle
- Header bar has AM / PM / Night / ENA segmented toggle (replaces old Turn/Date display)
- `GameTurn` type simplified to just `{ timeOfDay: TimeOfDay }` — no turn number or date (physical board tracks that)
- ENA = Extended Night Action (scenario-dependent)
- `useSoPProgress` migrates old localStorage format automatically
- "Next Turn" button at end of sequence cycles AM→PM→Night→AM and resets to phase 1

## Lessons Learned

### Rules Data (`src/data/goss/rules.json`)
When adding or editing rule entries in `rules.json`, **always include rule section references in parenthesized format** `(X.Y.Z)` so they render as clickable links in the UI. The modal's `InlineText` parser matches both `(X.Y.Z)` in parentheses and bare `X.Y.Z` (3-part only). Bold text `**like this (3.0)**` also has refs parsed via `InlineRefs`. Examples:
- Good: `"**Artillery (Art) (5.6.0):** Art units can conduct FS missions."`
- Good: `"See 13.7.4b for the effect of Eng units on GA."`
- Bad: `"Artillery Art 5.6.0: Art units can conduct FS missions."` (missing parens/bold, won't link)

### PDF Extraction
- Large PDF extraction should use many small parallel agents (9 worked well) writing to separate fragment files, then merge
- Page boundaries cause missed sections — always verify completeness and do a follow-up pass
- Copy source PDF into the repo (`docs/`) so agents can reliably access it (iCloud paths are unreliable)
- AI-generated summaries should be avoided — user prefers rules "as written" (WAR)
- When summary == text (common for short rules), hide the summary to avoid duplication
- For large games (100+ rules), use 4-6 parallel agents splitting by page ranges with overlapping boundaries, then merge/deduplicate
- Section ID normalization must happen during merge: check both directions (strip .0 and add .0) against base rule sections

### iPad / Mobile
- `position: fixed` modals inside flex/scroll containers break on iOS Safari — use `createPortal(... , document.body)`
- `onClick` works fine on modern iPad Safari — don't add redundant `onTouchEnd` (causes double-firing)
- ReactFlow intercepts touch/click events — check `target.closest("button")` in `onNodeClick` to let badge clicks through
- Always commit and push before testing on external devices — stale cache from old deploys is the #1 "not working" cause

### Git / Deploy
- GitHub Actions deploys on push to `main` — no service worker, but browser caching can serve stale assets
- For iPad testing, use new incognito tabs after deploy (Safari caches aggressively within sessions)

### GOSS Terminology Landmines
GOSS doesn't use standard hex-and-counter conventions verbatim. Verify against `rules.json` before writing content.
- **MH = Movement Halts (7.7.0)**, the ZOC-like mechanic. GOSS has **no ZOC**. Section 7.8.0 "Adjacent Enemy Units" is a *different, lighter* rule (+1 Leg / +2 Mech MP surcharge to enter hex adjacent to enemy — does not halt).
- **ADV = Ammo Delivery Value** lives in 16.3 (Ammo Delivery Segment), NOT 16.4 (Fuel Delivery).
- The glossary (`src/data/glossary.ts`) has 22 custom entries tagged `quick ref` for acronyms not in section 26.

### QA Discipline
- `tsc --noEmit` uses stale incremental cache and can silently miss errors — use `tsc -b --force` to catch real type errors.
- After changing nav/click handlers, verify in the browser preview (click the button, read back state) before claiming "done."

## Current State (April 2026 — v4.3)
- 1,198 rules across base + 4 scenarios (GOSS 595 / WaR 189 / HHF 74 / LF 103 / AW 237)
- Learn mode: 25 chapters / 66 decisions covering full SoP, plus HHF overlay (20 base + 27 scenario mods)
- Tabs: SoP / Learn / Rules / Ask / Info (Flowchart deprecated)
- Tips migrated from SoP rendering to Learn; sequence.json `notes` arrays preserved but unrendered pending audit

## Future Work
- Learn overlays for WaR, LF, AW (HHF done)
- Delete sequence.json `notes` arrays after audit via `docs/notes-vs-learn-comparison.md`
- Second game system integration (platform architecture is ready)
- Scenario-specific sequence of play modifications for remaining modules
