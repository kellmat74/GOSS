import type { GameSystemConfig } from "../types/platform";
import { gossConfig } from "./goss/config";
import { nextWarConfig } from "./next-war/config";

/** All registered game systems. Add new games here. */
const ALL_GAMES: GameSystemConfig[] = [gossConfig, nextWarConfig];

/** Check if draft mode is active (URL param or localStorage) */
export function isDraftMode(): boolean {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("draft") === "true") {
    // Persist draft mode to localStorage so it survives navigation
    localStorage.setItem("wc-draft-mode", "true");
    return true;
  }
  return localStorage.getItem("wc-draft-mode") === "true";
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
