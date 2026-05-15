import type { SearchConfig } from "../../utils/rulesSearch";

/** GOSS-specific search behavior: wargaming-term synonyms + scenario aliases. */
export const gossSearchConfig: SearchConfig = {
  synonyms: {
    "zoc":          ["movement halt", "adjacent enemy", "zone of control"],
    "zocs":         ["movement halt", "adjacent enemy", "zone of control"],
    "zone":         ["movement halt", "adjacent"],
    "retreat":      ["retreat", "withdraw", "displacement"],
    "overrun":      ["overrun", "exploitation"],
    "cas":          ["ground support", "gs mission"],
    "interdiction": ["supply interdiction", "ground interdiction"],
    "arty":         ["artillery", "art"],
    "ammo":         ["ammunition", "ammo depletion", "ammo replenishment"],
    "hq":           ["headquarters", "command"],
    "recon":        ["reconnaissance"],
    "mech":         ["mechanized", "mech"],
    "gens":         ["general supply"],
    "ohs":          ["on hand supply"],
  },
  moduleAliases: [
    ["battle of the bulge", "war"],
    ["wacht am rhein", "war"],
    ["atlantic wall", "atlantic-wall"],
    ["hurtgen forest", "hurtgen"],
    ["hell's forest", "hurtgen"],
    ["lucky forward", "lucky-forward"],
    ["hurtgen", "hurtgen"],
    ["bulge", "war"],
    ["war", "war"],
    ["hhf", "hurtgen"],
    ["aw", "atlantic-wall"],
    ["lf", "lucky-forward"],
  ],
};
