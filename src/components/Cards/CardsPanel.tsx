import type { CardCategory } from "../../types/goss";
import { ActionsPanel } from "../Actions/ActionsPanel";

interface CardsPanelProps {
  cards: CardCategory[];
}

/**
 * Browser for game cards (e.g. BWN's Soviet and NATO Event Cards). Reuses the
 * ActionsPanel layout with cards-appropriate copy. Kept as a thin wrapper so
 * the two tabs can diverge in future without touching the underlying browser.
 */
export function CardsPanel({ cards }: CardsPanelProps) {
  return (
    <ActionsPanel
      cards={cards}
      title="Event Cards"
      subtitle="Browse every event card. Click any card for full text, cost, side, and designer clarifications."
      emptyMessage="No card catalog for this game."
    />
  );
}
