import { useState, useEffect, useCallback } from "react";
import type { OptionalRuleEntry, SupplementConfig } from "../types/platform";

function storageKey(gameId: string, moduleId: string | null): string {
  return `wc-options-${gameId}-${moduleId ?? "base"}`;
}

function defaultActiveSet(rules: OptionalRuleEntry[]): Set<string> {
  return new Set(rules.filter((r) => r.default).map((r) => r.id));
}

/**
 * Manages the set of active optional rules for the current game + module.
 * State is persisted to localStorage per (gameId, moduleId) combination.
 * Resets to defaults when game or module changes.
 */
export function useOptionalRules(
  gameId: string,
  moduleId: string | null,
  baseOptionalRules: OptionalRuleEntry[],
  supplements: SupplementConfig[],
  moduleOptionalRules?: OptionalRuleEntry[],
) {
  // Flatten all available optional rules (base + module-specific + all supplements)
  const allRules: OptionalRuleEntry[] = [
    ...baseOptionalRules,
    ...(moduleOptionalRules ?? []),
    ...supplements.flatMap((s) => s.optionalRules ?? []),
  ];

  const [activeOptions, setActiveOptions] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey(gameId, moduleId));
      if (saved) return new Set(JSON.parse(saved) as string[]);
    } catch { /* ignore */ }
    return defaultActiveSet(allRules);
  });

  // Reset when game or module changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(gameId, moduleId));
      if (saved) {
        setActiveOptions(new Set(JSON.parse(saved) as string[]));
        return;
      }
    } catch { /* ignore */ }
    setActiveOptions(defaultActiveSet(allRules));
    // allRules intentionally excluded — we only want to re-run on game/module change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId, moduleId]);

  // Persist whenever active set changes
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey(gameId, moduleId),
        JSON.stringify([...activeOptions]),
      );
    } catch { /* ignore */ }
  }, [activeOptions, gameId, moduleId]);

  const toggleOption = useCallback((id: string) => {
    setActiveOptions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setActiveOptions(defaultActiveSet(allRules));
  }, [allRules]);

  const enableAll = useCallback(() => {
    setActiveOptions(new Set(allRules.map((r) => r.id)));
  }, [allRules]);

  const disableAll = useCallback(() => {
    setActiveOptions(new Set());
  }, []);

  return {
    activeOptions,
    allRules,
    toggleOption,
    resetToDefaults,
    enableAll,
    disableAll,
  };
}
