import type { GameSystemConfig } from "../types/platform";
import { gossConfig } from "./goss/config";
import { nextWarConfig } from "./next-war/config";
import { blueWaterNavyConfig } from "./blue-water-navy/config";

/** All registered game systems. Add new games here. */
const ALL_GAMES: GameSystemConfig[] = [
  gossConfig,
  nextWarConfig,
  blueWaterNavyConfig,
];

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

/**
 * If the URL contains `?game=<id>`, return that game id (when it matches a
 * registered game). Lets users deep-link to a specific game — including a
 * draft game — without having to also pass `?draft=true`.
 */
export function getRequestedGameId(): string | null {
  if (typeof window === "undefined") return null;
  const id = new URLSearchParams(window.location.search).get("game");
  if (!id) return null;
  return ALL_GAMES.some((g) => g.id === id) ? id : null;
}

/**
 * Visible game systems. Filters out drafts unless either:
 *   1. `?draft=true` is set (all drafts visible), OR
 *   2. `?game=<id>` deep-links to that draft (just that one becomes visible).
 */
export function getVisibleGames(): GameSystemConfig[] {
  const draft = isDraftMode();
  const requested = getRequestedGameId();
  return ALL_GAMES.filter(
    (g) => !g.draft || draft || g.id === requested,
  );
}

/** Look up a game system by ID */
export function getGameById(id: string): GameSystemConfig | undefined {
  return ALL_GAMES.find((g) => g.id === id);
}

export { ALL_GAMES as GAME_REGISTRY };
