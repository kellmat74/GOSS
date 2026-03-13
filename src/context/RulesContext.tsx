import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import type { RuleEntry } from "../types/goss";

interface RulesContextValue {
  rules: RuleEntry[];
  openRule: (sectionId: string) => void;
  closeRule: () => void;
  goBack: () => void;
  activeRule: RuleEntry | null;
  history: RuleEntry[];
  getRuleBySection: (sectionId: string) => RuleEntry | undefined;
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

  // Build lookup map for fast access
  const ruleMap = useMemo(() => {
    const map = new Map<string, RuleEntry>();
    for (const r of rules) {
      map.set(r.section.toLowerCase(), r);
      // Also index without trailing .0 for convenience (e.g., "3.0" matches "3")
      const alt = r.section.replace(/\.0$/, "");
      if (alt !== r.section) map.set(alt.toLowerCase(), r);
    }
    return map;
  }, [rules]);

  const getRuleBySection = useCallback(
    (sectionId: string): RuleEntry | undefined => {
      const key = sectionId.toLowerCase().trim();
      // Try exact match first
      const exact = ruleMap.get(key);
      if (exact) return exact;
      // Try stripping trailing .0 from query (e.g., "9.6.0" -> "9.6")
      const stripped = key.replace(/\.0$/, "");
      if (stripped !== key) return ruleMap.get(stripped);
      // Try adding .0 (e.g., "9.6" -> "9.6.0")
      return ruleMap.get(key + ".0");
    },
    [ruleMap]
  );

  const openRule = useCallback(
    (sectionId: string) => {
      const rule = getRuleBySection(sectionId);
      if (!rule) return;
      setHistory((h) => (activeRule ? [...h, activeRule] : h));
      setActiveRule(rule);
    },
    [getRuleBySection, activeRule]
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
    () => ({ rules, openRule, closeRule, goBack, activeRule, history, getRuleBySection }),
    [rules, openRule, closeRule, goBack, activeRule, history, getRuleBySection]
  );

  return <RulesContext.Provider value={value}>{children}</RulesContext.Provider>;
}
