import type { GlossaryConfig } from "../glossary";

/**
 * BWN-specific glossary configuration. Pulls entries from §12 Glossary and
 * §13 Military Acronyms, plus a small set of extras for terms that appear in
 * rule text but aren't formally defined in either reference section.
 */
export const bwnGlossaryConfig: GlossaryConfig = {
  // BWN Glossary is at §12, Military Acronyms at §13.
  sectionPrefixes: ["12", "13"],
  // Common English words that match too broadly without an abbreviation context.
  skipFullTerms: [
    "Action", "Range", "Soviet", "Turn", "Active", "Reserve", "Boomer",
    "Bridge", "Stability", "Fresh", "Spent",
  ],
  // Terms used in BWN rules body but not defined in §12 or §13.
  extras: [
    { term: "On Patrol", definition: "A status indicating a unit is positioned to react to enemy movement into or through its Sea Zone (subs 5.2.3, aircraft 5.3.4)." },
    { term: "On-Patrol", definition: "See On Patrol." },
    { term: "Fresh", abbr: undefined, definition: "A unit that has not yet activated this turn — opposite of Spent (2.2.6)." },
    { term: "Spent", definition: "A unit that has activated this turn and cannot activate again until refreshed (2.2.6)." },
    { term: "First Strike Point", abbr: "FSP", ruleRef: "9.1.1", definition: "Points the Soviet player can accumulate to enable a Soviet Nuclear First Strike. NATO actions can also award FSPs." },
    { term: "Task Force", abbr: "TF", ruleRef: "5.1.2", definition: "A unit or formation of surface ships and up to one nuclear submarine counter, moving and fighting as one." },
    { term: "Reaction Event", definition: "An event card played from hand at no OPS cost in response to a specific trigger; the bottom event on a card (4.2.1)." },
    { term: "Operations Event", definition: "The top event on a card, requiring the card's OPS value to play (4.2.1)." },
    { term: "Strike Aircraft", definition: "Air units carrying strike munitions designed to attack ships or land targets — distinct from MP, FTR, and TKR types (2.2.3)." },
    { term: "Convoy", definition: "Cargo ship formations carrying supplies that NATO must protect from Soviet attack (5.1.4)." },
    { term: "Convoy Massacre", definition: "A high-result attack that removes an entire convoy and additional NATO losses (5.1.4.1)." },
    { term: "Capital Ship", definition: "A large named warship (carrier, battleship, or major cruiser) with its own damage track (5.1.5)." },
    { term: "Baltic Sea", definition: "Special Sea Zone with restricted unit-type access (2.3, 7.4)." },
    { term: "Sevastopol", definition: "Soviet Black Sea port and strategic target (8.4, NATO card #55)." },
    { term: "Keflavik", definition: "Major NATO airfield in Iceland (2.3.8, 8.4.4)." },
    { term: "Kola Peninsula", definition: "Soviet northern fleet base region with special bombing rules (7.5.4)." },
    { term: "Bastion", definition: "The Soviet Boomer Bastion — fortified Sea Zone protecting Soviet SSBNs (2.3.4)." },
  ],
};
