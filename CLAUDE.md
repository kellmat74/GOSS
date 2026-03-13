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
- `src/data/goss/rules.json` — 590 extracted rule entries (sections 1.0–26.0, GOSS System Rules 2020)
- `docs/Bx_GOSS_Rules_2020-WEB.pdf` — Source PDF for rule extraction

### Views (tabs in AppShell)
1. **Steps** (`PhaseStepper`) — Step-through each SoP phase with descriptions, notes, checklists
2. **Flowchart** (`SoPFlowchart` / `ReactFlowChart`) — Visual flowchart with drill-down nodes
3. **Rules** (`RulesSearch`) — Searchable list of all 590 rules, click to open modal

### Rules Reference System
- **`RulesContext`** (`src/context/RulesContext.tsx`) — Global provider with `openRule()`, `closeRule()`, `goBack()`, `getRuleBySection()`. Modal state + history stack.
- **`RuleModal`** (`src/components/RulesReference/RuleModal.tsx`) — Portal-based overlay (z-100). Shows section badge, title, full text with parsed formatting, cross-ref "See Also" links. History navigation with back button.
- **`RuleRefBadge`** (`src/components/RulesReference/RuleRefBadge.tsx`) — Clickable `§X.Y.Z` badge. Amber = clickable (rule found), grey = not found. Uses `e.stopPropagation()` + `e.preventDefault()`.
- **`RuleInlineText`** (`src/components/RulesReference/RuleInlineText.tsx`) — Parses `(X.Y.Z)` patterns in any text into clickable rule links. Used in PhaseStepper notes/checklists/descriptions and NodeDetailPanel.

### Section ID Normalization
`getRuleBySection` handles `.0` suffix mismatches: tries exact match, then stripped `.0`, then added `.0`. The ruleMap in context also stores alt keys.

### Flowchart Event Handling
- `ReactFlowChart.onNodeClick` checks `target.closest("button")` to avoid drill-down when clicking RuleRefBadge or info buttons
- FlowNode info button dispatches `CustomEvent("flownode-info")` for the detail panel

### Checklist Behavior
- Auto-clears checklist items when navigating to next/prev step
- Reset button in checklist header for manual clear
- State persisted to localStorage via `useSoPProgress` hook

## Lessons Learned

### PDF Extraction
- Large PDF extraction should use many small parallel agents (9 worked well) writing to separate fragment files, then merge
- Page boundaries cause missed sections — always verify completeness and do a follow-up pass
- Copy source PDF into the repo (`docs/`) so agents can reliably access it (iCloud paths are unreliable)
- AI-generated summaries should be avoided — user prefers rules "as written" (WAR)
- When summary == text (common for short rules), hide the summary to avoid duplication

### iPad / Mobile
- `position: fixed` modals inside flex/scroll containers break on iOS Safari — use `createPortal(... , document.body)`
- `onClick` works fine on modern iPad Safari — don't add redundant `onTouchEnd` (causes double-firing)
- ReactFlow intercepts touch/click events — check `target.closest("button")` in `onNodeClick` to let badge clicks through
- Always commit and push before testing on external devices — stale cache from old deploys is the #1 "not working" cause

### Git / Deploy
- GitHub Actions deploys on push to `main` — no service worker, but browser caching can serve stale assets
- For iPad testing, use new incognito tabs after deploy (Safari caches aggressively within sessions)

## Current State (March 2026)
- 590 rules extracted covering all 26 sections of GOSS 2020 System Rules
- 5 minor sub-sections still unresolved from crossRefs (7.12.1a-related)
- Clickable rule references in: Flowchart nodes, Flowchart info panel, Steps view (description, notes, checklists), Breadcrumb, Sidebar
- Rule modal with cross-ref navigation and history stack
- No scenario-specific rules yet (WaR, Hurtgen, Atlantic Wall, Lucky Forward) — data model supports it via `module` field

## Future Work
- Scenario-specific rules (WaR etc.) with game selector
- Rule text improvements (some extraction artifacts remain)
- Enhanced search (fuzzy matching, section tree navigation)
