import type { GameSystemConfig } from "../types/platform";
import { gossConfig } from "./goss/config";
import { nextWarConfig } from "./next-war/config";

/** All registered game systems. Add new games here. */
const ALL_GAMES: GameSystemConfig[] = [gossConfig, nextWarConfig];

/**
 * Check if draft mode is active.
 * Only the URL param `?draft=true` enables it — intentionally NOT persisted
 * to localStorage, so draft games never leak to users who don't have the param.
 * Clear any stale localStorage value left by the old implementation.
 */
export function isDraftMode(): boolean {
  if (typeof window === "undefined") return false;
  // Clean up any stale persisted value from the old implementation
  localStorage.removeItem("wc-draft-mode");
  return new URLSearchParams(window.location.search).get("draft") === "true";
}

/** Visible game systems (filters out drafts unless draft mode is active) */
export function getVisibleGames(): GameSystemConfig[] {
  const draft = isDraftMode();
  return ALL_GAMES.filter((g) => !g.draft || draft);
}

/** Look up a game system by ID */
export function getGameById(id: string): GameSystemConfig | undefined {
  return ALL_GAMES.find((g) => g.id === id);
}

export { ALL_GAMES as GAME_REGISTRY };
