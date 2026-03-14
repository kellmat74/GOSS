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
- `src/data/war/rules.json` — 189 Wacht am Rhein scenario rules
- `src/data/hurtgen/rules.json` — 74 Hurtgen scenario rules
- `src/data/lucky-forward/rules.json` — 103 Lucky Forward scenario rules
- `src/data/atlantic-wall/rules.json` — 237 Atlantic Wall scenario rules
- `src/utils/mergeRules.ts` — Merges base + scenario rules (matching sections shown side-by-side, new sections inserted in sort order)
- `docs/Bx_GOSS_Rules_2020-WEB.pdf` — Source PDF (base rules)
- `docs/Bx_WaR_2020-WEB.pdf` — Source PDF (Wacht am Rhein)
- `docs/Bx_Hurtgen_2016-WEB.pdf` — Source PDF (Hurtgen)
- `docs/Bx_LuckyForward_2020-WEB.pdf` — Source PDF (Lucky Forward)
- `docs/Bx_AtlanticWall_2016-WEB.pdf` — Source PDF (Atlantic Wall)

### Views (tabs in AppShell)
1. **Steps** (`PhaseStepper`) — Step-through each SoP phase with descriptions, notes, checklists
2. **Flowchart** (`SoPFlowchart` / `ReactFlowChart`) — Visual flowchart with drill-down nodes
3. **Rules** (`RulesSearch`) — Searchable tree of rules, click to open modal
4. **Ask** (`AskPanel`) — AI-powered Q&A across all loaded rules

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

## Current State (March 2026)
- 595 base GOSS rules covering all 26 sections, zero unresolved crossRefs
- All 4 scenario rule sets extracted and wired in:
  - **Wacht am Rhein**: 189 rules (100 overlap base, 89 WaR-only)
  - **Hurtgen**: 74 rules (28 overlap base, 46 HHF-only)
  - **Lucky Forward**: 103 rules (44 overlap base, 59 LF-only)
  - **Atlantic Wall**: 237 rules (87 overlap base, 150 AW-only) — largest, includes reorganized logistics (15.0/16.0) and strategic map module (27.0)
- Game selector dropdown enables switching between base and any scenario
- Combined modal view shows base + scenario rules side-by-side for overlapping sections
- Clickable rule references in: Flowchart nodes, Flowchart info panel, Steps view (description, notes, checklists), Breadcrumb, Sidebar
- Rule modal with cross-ref navigation and history stack

## Future Work
- Time-of-day-aware phase filtering (skip/highlight phases based on AM/PM/Night/ENA)
- Enhanced search (fuzzy matching, section tree navigation)
- Scenario-specific sequence of play modifications (some games alter the SoP)
- Sections 40.0-42.0 (Airborne/Amphibious Assault Stages) from Atlantic Wall — not in the exclusive rules pages, may be in scenario sections
