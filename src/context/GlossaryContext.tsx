import { createContext, useContext, type ReactNode } from "react";
import {
  glossaryMap,
  glossaryRegex,
  type GlossaryEntry,
} from "../data/glossary";

interface GlossaryContextValue {
  getEntry: (term: string) => GlossaryEntry | undefined;
  regex: RegExp;
}

const GlossaryContext = createContext<GlossaryContextValue>({
  getEntry: () => undefined,
  regex: /(?!)/g, // never matches
});

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const value: GlossaryContextValue = {
    getEntry: (term: string) => glossaryMap.get(term),
    regex: glossaryRegex,
  };

  return (
    <GlossaryContext.Provider value={value}>
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  return useContext(GlossaryContext);
}
