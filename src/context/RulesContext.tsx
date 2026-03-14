import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { RuleEntry } from "../types/goss";

interface RulesContextValue {
  rules: RuleEntry[];
  openRule: (sectionOrId: string) => void;
  closeRule: () => void;
  goBack: () => void;
  activeRule: RuleEntry | null;
  history: RuleEntry[];
  getRuleBySection: (sectionId: string) => RuleEntry | undefined;
  /** Get all rules for a section (base + any scenario overlays) */
  getRulesForSection: (section: string) => RuleEntry[];
}

const RulesContext = createContext<RulesContextValue | null>(null);

export function useRules() {
  const ctx = useContext(RulesContext);
  if (!ctx) throw new Error("useRules must be used within RulesProvider");
  return ctx;
}

interface RulesProviderProps {
  rules: RuleEntry[];
  children: ReactNode;
}

export function RulesProvider({ rules, children }: RulesProviderProps) {
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

  const value = useMemo(
    () => ({ rules, openRule, closeRule, goBack, activeRule, history, getRuleBySection, getRulesForSection }),
    [rules, openRule, closeRule, goBack, activeRule, history, getRuleBySection, getRulesForSection]
  );

  return <RulesContext.Provider value={value}>{children}</RulesContext.Provider>;
}
