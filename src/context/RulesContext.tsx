import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { RuleEntry } from "../types/goss";
import type { ErrataFile, ErrataEntry, ModuleConfig } from "../types/platform";

export interface ErrataForSection {
  asOf: string;
  entries: ErrataEntry[];
}

interface RulesContextValue {
  rules: RuleEntry[];
  openRule: (sectionOrId: string) => void;
  closeRule: () => void;
  goBack: () => void;
  goNext: () => void;
  goPrev: () => void;
  activeRule: RuleEntry | null;
  history: RuleEntry[];
  getRuleBySection: (sectionId: string) => RuleEntry | undefined;
  /** Get all rules for a section (base + any scenario overlays) */
  getRulesForSection: (section: string) => RuleEntry[];
  /** Whether there's a next/prev rule to navigate to */
  hasNext: boolean;
  hasPrev: boolean;
  /** Get errata entries for a rule section, or null if none */
  getErrataForSection: (section: string) => ErrataForSection | null;
  /** Set of section keys that have errata (lowercase) — for tree indicators */
  sectionsWithErrata: Set<string>;
  /** Short label for a module id (e.g. "war" → "WaR"). Falls back to the id. */
  getModuleShortLabel: (moduleId: string) => string;
  /** Long label for a module id (e.g. "war" → "Wacht am Rhein"). Falls back to the id. */
  getModuleLabel: (moduleId: string) => string;
  /** Get BGG forum "hive mind" mentions for a given rule section, or null if none. */
  getForumMentions: (section: string) => ForumMention[] | null;
}

/** One designer-canonical (Tier 1) BGG post that references a specific rule. */
export interface ForumMention {
  author: string;
  createdAt: string | null;
  snippet: string;
  postUrl: string | null;
  threadTitle: string;
  threadUrl: string;
}

const RulesContext = createContext<RulesContextValue | null>(null);

export function useRules() {
  const ctx = useContext(RulesContext);
  if (!ctx) throw new Error("useRules must be used within RulesProvider");
  return ctx;
}

interface RulesProviderProps {
  rules: RuleEntry[];
  baseErrata?: ErrataFile | null;
  moduleErrata?: ErrataFile | null;
  /** Module configs from the active game — drives moduleId → label lookups. */
  modules?: ModuleConfig[];
  /** Curated BGG forum knowledge with per-rule mentions index (from forum-knowledge.json) */
  forumContext?: unknown;
  children: ReactNode;
}

export function RulesProvider({ rules, baseErrata, moduleErrata, modules, forumContext, children }: RulesProviderProps) {
  const [activeRule, setActiveRule] = useState<RuleEntry | null>(null);
  const [history, setHistory] = useState<RuleEntry[]>([]);

  // Build lookup maps for fast access
  const { sectionMap, idMap, sectionMultiMap } = useMemo(() => {
    const sMap = new Map<string, RuleEntry>();
    const iMap = new Map<string, RuleEntry>();
    const multiMap = new Map<string, RuleEntry[]>();
    for (const r of rules) {
      iMap.set(r.id.toLowerCase(), r);
      // Multi-map: all rules per section
      const key = r.section.toLowerCase();
      const list = multiMap.get(key) ?? [];
      list.push(r);
      multiMap.set(key, list);
      // For section lookup, prefer base rules (first occurrence = no module)
      if (!sMap.has(key) || !r.module) {
        sMap.set(key, r);
      }
      // Also index without trailing .0
      const alt = r.section.replace(/\.0$/, "");
      if (alt !== r.section) {
        const altKey = alt.toLowerCase();
        const altList = multiMap.get(altKey) ?? [];
        altList.push(r);
        multiMap.set(altKey, altList);
        if (!sMap.has(altKey) || !r.module) {
          sMap.set(altKey, r);
        }
      }
    }
    return { sectionMap: sMap, idMap: iMap, sectionMultiMap: multiMap };
  }, [rules]);

  const getRuleBySection = useCallback(
    (sectionId: string): RuleEntry | undefined => {
      const key = sectionId.toLowerCase().trim();
      const exact = sectionMap.get(key);
      if (exact) return exact;
      const stripped = key.replace(/\.0$/, "");
      if (stripped !== key) return sectionMap.get(stripped);
      return sectionMap.get(key + ".0");
    },
    [sectionMap]
  );

  const getRulesForSection = useCallback(
    (section: string): RuleEntry[] => {
      const key = section.toLowerCase().trim();
      return sectionMultiMap.get(key) ?? sectionMultiMap.get(key + ".0") ?? [];
    },
    [sectionMultiMap]
  );

  // Build errata map: section key → merged entries from base + module errata
  const { errataMap, sectionsWithErrata } = useMemo(() => {
    const map = new Map<string, ErrataForSection>();
    for (const file of [baseErrata, moduleErrata]) {
      if (!file) continue;
      for (const entry of file.entries) {
        const key = entry.section.toLowerCase().trim();
        const existing = map.get(key);
        if (existing) {
          existing.entries.push(entry);
          if (file.asOf > existing.asOf) existing.asOf = file.asOf;
        } else {
          map.set(key, { asOf: file.asOf, entries: [entry] });
        }
      }
    }
    return { errataMap: map, sectionsWithErrata: new Set(map.keys()) };
  }, [baseErrata, moduleErrata]);

  const getErrataForSection = useCallback(
    (section: string): ErrataForSection | null => {
      const key = section.toLowerCase().trim();
      return errataMap.get(key) ?? errataMap.get(key.replace(/\.0$/, "")) ?? null;
    },
    [errataMap],
  );

  // Build ordered unique section list for prev/next navigation
  const orderedSections = useMemo(() => {
    const seen = new Set<string>();
    const sections: string[] = [];
    for (const r of rules) {
      const key = r.section.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        sections.push(r.section);
      }
    }
    return sections;
  }, [rules]);

  const activeIndex = useMemo(() => {
    if (!activeRule) return -1;
    return orderedSections.findIndex(
      (s) => s.toLowerCase() === activeRule.section.toLowerCase()
    );
  }, [activeRule, orderedSections]);

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex >= 0 && activeIndex < orderedSections.length - 1;

  const goPrev = useCallback(() => {
    if (activeIndex <= 0) return;
    const prevSection = orderedSections[activeIndex - 1];
    const rule = getRuleBySection(prevSection);
    if (rule) {
      setHistory([]);
      setActiveRule(rule);
    }
  }, [activeIndex, orderedSections, getRuleBySection]);

  const goNext = useCallback(() => {
    if (activeIndex < 0 || activeIndex >= orderedSections.length - 1) return;
    const nextSection = orderedSections[activeIndex + 1];
    const rule = getRuleBySection(nextSection);
    if (rule) {
      setHistory([]);
      setActiveRule(rule);
    }
  }, [activeIndex, orderedSections, getRuleBySection]);

  const openRule = useCallback(
    (sectionOrId: string) => {
      // Try by ID first (for direct clicks from tree/search with specific rule)
      const byId = idMap.get(sectionOrId.toLowerCase().trim());
      const rule = byId ?? getRuleBySection(sectionOrId);
      if (!rule) return;
      setHistory((h) => (activeRule ? [...h, activeRule] : h));
      setActiveRule(rule);
    },
    [idMap, getRuleBySection, activeRule]
  );

  const closeRule = useCallback(() => {
    setActiveRule(null);
    setHistory([]);
  }, []);

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setActiveRule(prev);
      return h.slice(0, -1);
    });
  }, []);

  // Module label lookup (id → { short, long })
  const moduleLabelMap = useMemo(() => {
    const map = new Map<string, { short: string; long: string }>();
    for (const m of modules ?? []) {
      map.set(m.id, { short: m.shortLabel, long: m.label });
    }
    return map;
  }, [modules]);

  const getModuleShortLabel = useCallback(
    (moduleId: string) => moduleLabelMap.get(moduleId)?.short ?? moduleId,
    [moduleLabelMap],
  );
  const getModuleLabel = useCallback(
    (moduleId: string) => moduleLabelMap.get(moduleId)?.long ?? moduleId,
    [moduleLabelMap],
  );

  // BGG forum hive-mind mentions: per-rule lookup. Populated from
  // forum-knowledge.json's `ruleMentions` field (built by curate-bgg-forum.mjs).
  const ruleMentionsMap = useMemo(() => {
    if (!forumContext || typeof forumContext !== "object") return new Map<string, ForumMention[]>();
    const raw = (forumContext as { ruleMentions?: Record<string, ForumMention[]> }).ruleMentions ?? {};
    const map = new Map<string, ForumMention[]>();
    for (const [section, mentions] of Object.entries(raw)) {
      if (Array.isArray(mentions) && mentions.length > 0) map.set(section, mentions);
    }
    return map;
  }, [forumContext]);

  const getForumMentions = useCallback(
    (section: string): ForumMention[] | null => {
      const key = section.toLowerCase().trim();
      // Try exact, then with/without trailing .0 like getRuleBySection does
      return (
        ruleMentionsMap.get(section) ??
        ruleMentionsMap.get(key) ??
        ruleMentionsMap.get(section.replace(/\.0$/, "")) ??
        ruleMentionsMap.get(section + ".0") ??
        null
      );
    },
    [ruleMentionsMap],
  );

  const value = useMemo(
    () => ({ rules, openRule, closeRule, goBack, goNext, goPrev, activeRule, history, getRuleBySection, getRulesForSection, hasNext, hasPrev, getErrataForSection, sectionsWithErrata, getModuleShortLabel, getModuleLabel, getForumMentions }),
    [rules, openRule, closeRule, goBack, goNext, goPrev, activeRule, history, getRuleBySection, getRulesForSection, hasNext, hasPrev, getErrataForSection, sectionsWithErrata, getModuleShortLabel, getModuleLabel, getForumMentions]
  );

  return <RulesContext.Provider value={value}>{children}</RulesContext.Provider>;
}
