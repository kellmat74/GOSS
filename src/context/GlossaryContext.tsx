import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  buildGlossary,
  type GlossaryEntry,
  type GlossaryConfig,
} from "../data/glossary";
import type { RuleEntry } from "../types/goss";

interface GlossaryContextValue {
  getEntry: (term: string) => GlossaryEntry | undefined;
  regex: RegExp;
}

const GlossaryContext = createContext<GlossaryContextValue>({
  getEntry: () => undefined,
  regex: /(?!)/g, // never matches
});

interface GlossaryProviderProps {
  rules: RuleEntry[];
  config?: GlossaryConfig;
  children: ReactNode;
}

export function GlossaryProvider({ rules, config, children }: GlossaryProviderProps) {
  const value = useMemo<GlossaryContextValue>(() => {
    const { glossaryMap, glossaryRegex } = buildGlossary(rules, config);
    return {
      getEntry: (term: string) => glossaryMap.get(term),
      regex: glossaryRegex,
    };
  }, [rules, config]);

  return (
    <GlossaryContext.Provider value={value}>
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  return useContext(GlossaryContext);
}
