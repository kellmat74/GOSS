# BWN Play Aid Transcriptions

Markdown transcriptions of the play aid pages from Compass Games' Blue Water Navy.
Source PNGs at `public/assets/bwn/play-aid-*.png`. Source PDF at
`docs/BWN/Blue Water Navy Play Aids.pdf`.

These files are **human-editable working drafts** for review. They will be:
1. Reviewed and corrected by Matt against the physical play aids
2. Parsed into smaller per-action chunks for the workflow tools
3. Wired into the Actions tab and contextual help (e.g. when a player picks "Sub action", surface the relevant sub-attack procedure)

## What's NOT in this folder

- **Page 1 (Unit ID guide)** — not transcribed; the image (`play-aid-1.png`)
  is surfaced directly via the QuickRefBar "Units" button. Counter anatomy
  doesn't transcribe well to text.
- **Turn Sequence portion of page 2** — was originally included but the
  authoritative turn sequence lives in `sequence.json` (sourced from rules
  §3.2–§3.5). The action-catalog portion of page 2 is preserved in `02-…md`
  for future decomposition into Actions tab workflows.

## File index

| # | File | Topic |
|---|---|---|
| 2 | [02-actions-and-turn-sequence.md](./02-actions-and-turn-sequence.md) | Action catalog (Subs/Air/Ships/Misc), Use-When-Active, Use-Anytime |
| 3 | [03-attacks-on-and-by-submarines.md](./03-attacks-on-and-by-submarines.md) | ASW, ASW by TFs, sub-launched missiles, sub torpedo attack on TF |
| 4 | [04-task-force-combat.md](./04-task-force-combat.md) | TF detection, missile attacks vs TF, SAM resolution, capital ship damage, hit selection |
| 5 | [05-fighters-cap-interception.md](./05-fighters-cap-interception.md) | Interception rules, CAP, fighter combat vs MP / strike / fighter, escorted strikes |
| 6 | [06-attacking-land-targets.md](./06-attacking-land-targets.md) | Bombing, SAM suppression, cruise missile, collateral damage, Kola, facility damage, port capabilities |
| 7 | [07-convoys-mines-tracks-repair-nukes.md](./07-convoys-mines-tracks-repair-nukes.md) | Convoys, mines (CAPTOR, port), war tracks, capital-ship repair, nukes at sea, NATO losses, SAM ammo |
| 8 | [08-soviet-specific.md](./08-soviet-specific.md) | NATO boomer hunting, spies, FSP, first-strike subs, amphibious invasions, troop landing, capturing, Soviet tech |

## Structure conventions

Each file uses **H2 (`##`) as a workflow-chunk boundary**. Sub-procedures use H3.
When we later structure these for the Actions tab / workflow tools, splitting on
H2 will produce the right granularity. Examples:

- "Submarine Anti-Surface Attack" workflow → pull H2 §"Submarine vs. Task Force"
  from `03-attacks-on-and-by-submarines.md`
- "Air strike against land target" workflow → pull H2 §"Air Units Bombing Land
  Targets" + §"Cruise Missile Attacks Vs. Land Targets" from `06-…`
- "Card resolution: amphibious invasion" → pull H2 §"Amphibious Invasions" from
  `08-soviet-specific.md`

## Known transcription quirks

- Margin annotations (handwritten "Blue" / "Brown" / "Grey" and section refs)
  are noted in each file's preamble — these appear to be Matt's personal
  cross-reference key, not part of the official play aid.
- A few characters that were ambiguous in the scan (e.g. die-roll symbols,
  small icons) are notated descriptively. Matt to verify against the
  physical card.
- v1.17 / 2020 rule-reference numbers (e.g. §17.8) where visible in the
  printed play aid are preserved next to the relevant section.

## Review checklist

When reviewing each file, watch for:

- [ ] Tabular content — die-roll ranges and result columns
- [ ] DRMs and order-of-application notes
- [ ] Marker conventions ('Spent', 'On Patrol', 'Detected', etc.)
- [ ] Optional rules marked with ◆ or ★
- [ ] Cross-game references (Bastion-only, Arctic-only, Baltic-only)
