import type { SearchConfig } from "../../utils/rulesSearch";

/**
 * BWN-specific search behavior. Synonyms expand naval-warfare and acronym
 * shorthand to terms actually used in the rule text.
 */
export const bwnSearchConfig: SearchConfig = {
  synonyms: {
    // Common acronym ↔ full-term pairs
    "tf":           ["task force"],
    "asw":          ["anti-submarine warfare", "anti submarine warfare"],
    "asuw":         ["anti-surface warfare"],
    "mp":           ["maritime patrol"],
    "sam":          ["surface-to-air missile", "surface to air missile"],
    "asm":          ["anti-ship missile", "anti ship missile"],
    "ssbn":         ["ballistic missile submarine", "boomer"],
    "ssn":          ["nuclear submarine", "nuclear sub"],
    "ssk":          ["diesel submarine", "diesel sub"],
    "fsp":          ["first strike point"],
    "ftr":          ["fighter"],
    "stk":          ["strike"],
    "tkr":          ["tanker"],
    "cap":          ["combat air patrol"],
    "aew":          ["airborne early warning"],
    "sead":         ["suppression of enemy air defenses"],
    // Plain-English mappings
    "boomer":       ["ssbn", "ballistic missile submarine"],
    "carrier":      ["capital ship", "cv"],
    "convoy":       ["convoy", "convoys"],
    "weather":      ["bad weather", "weather zone"],
    "fighter":      ["ftr", "cap", "interception"],
    "missile":      ["asm", "missile attack", "cruise missile"],
    "nuke":         ["nuclear", "first strike", "fsp"],
    "nukes":        ["nuclear", "first strike", "fsp"],
  },
  // Module aliases — only one module today (Atlantic). Pacific added when Compass ships it.
  moduleAliases: [
    ["atlantic",  "atlantic"],
  ],
};
