import { useState, useMemo } from "react";
import type { CardCategory, GameCard } from "../../types/goss";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";
import { RuleInlineText } from "../RulesReference/RuleInlineText";

interface ActionsPanelProps {
  cards: CardCategory[];
  title?: string;
  subtitle?: string;
  emptyMessage?: string;
}

const TYPE_LABEL: Record<string, string> = {
  "operations-event": "Operations Event",
  "reaction-event": "Reaction Event",
  "use-when-active": "Use When Active",
  "use-anytime": "Use At Any Time",
};

const SIDE_BADGE: Record<string, { label: string; cls: string }> = {
  soviet: { label: "SOV", cls: "bg-red-700 text-white" },
  nato: { label: "NATO", cls: "bg-blue-700 text-white" },
  neutral: { label: "", cls: "" },
};

export function ActionsPanel({
  cards,
  title = "Actions",
  subtitle = "Operations Phase actions and event cards. Click any item for details.",
  emptyMessage = "No actions catalog for this game.",
}: ActionsPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Flatten + filter
  const filtered = useMemo<CardCategory[]>(() => {
    if (!query.trim()) return cards;
    const q = query.toLowerCase();
    return cards
      .map((cat) => ({
        ...cat,
        cards: cat.cards.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.cardNumber.toLowerCase().includes(q) ||
            (c.text ?? "").toLowerCase().includes(q) ||
            (c.clarification ?? "").toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.cards.length > 0);
  }, [cards, query]);

  const selectedCard: GameCard | null = useMemo(() => {
    if (!selectedId) return null;
    for (const cat of cards) {
      const found = cat.cards.find((c) => c.id === selectedId);
      if (found) return found;
    }
    return null;
  }, [selectedId, cards]);

  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center text-stone-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4" style={{ height: "calc(100vh - 8rem)" }}>
      {/* Left: category list + cards */}
      <div className="flex w-full flex-col md:w-1/2 lg:w-2/5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <p className="mb-3 text-sm text-stone-500">{subtitle}</p>
        <div className="mb-3 shrink-0">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-stone-600 dark:bg-stone-800"
          />
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
          {filtered.map((cat) => (
            <div key={cat.id} className="mb-4">
              <div className="sticky top-0 z-[1] bg-white py-1 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:bg-stone-900">
                {cat.label} <span className="text-stone-400">({cat.cards.length})</span>
              </div>
              <ul className="mt-1 space-y-1">
                {cat.cards.map((c) => {
                  const isSel = c.id === selectedId;
                  const sideBadge = SIDE_BADGE[c.side];
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => setSelectedId(c.id)}
                        className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                          isSel
                            ? "border-accent-500 bg-accent-500/10 text-stone-900 dark:text-stone-100"
                            : "border-stone-200 bg-white hover:border-accent-400 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700/60"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {c.cardNumber !== "—" && (
                            <span className="font-mono text-xs text-stone-400">#{c.cardNumber}</span>
                          )}
                          <span className="flex-1 font-medium">{c.title}</span>
                          {sideBadge.label && (
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${sideBadge.cls}`}>
                              {sideBadge.label}
                            </span>
                          )}
                          {typeof c.cost === "number" && (
                            <span className="rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold text-stone-700 dark:bg-stone-700 dark:text-stone-300">
                              {c.cost} OPS
                            </span>
                          )}
                        </div>
                        {(c.text || c.clarification) && (
                          <div className="mt-0.5 truncate text-xs text-stone-500 dark:text-stone-400">
                            {c.text || c.clarification}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-8 text-center text-sm text-stone-500">
              No matches for "{query}".
            </div>
          )}
        </div>
      </div>

      {/* Right: detail panel */}
      <div className="hidden flex-1 overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-800/50 md:block">
        {selectedCard ? (
          <CardDetail card={selectedCard} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            Select an action to see details.
          </div>
        )}
      </div>
    </div>
  );
}

function CardDetail({ card }: { card: GameCard }) {
  const sideBadge = SIDE_BADGE[card.side];
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {card.cardNumber !== "—" && (
          <span className="rounded bg-stone-200 px-2 py-1 font-mono text-xs text-stone-700 dark:bg-stone-700 dark:text-stone-200">
            #{card.cardNumber}
          </span>
        )}
        {sideBadge.label && (
          <span className={`rounded px-2 py-1 text-xs font-bold ${sideBadge.cls}`}>
            {sideBadge.label}
          </span>
        )}
        <span className="rounded border border-stone-300 px-2 py-1 text-xs text-stone-600 dark:border-stone-600 dark:text-stone-300">
          {TYPE_LABEL[card.type] ?? card.type}
        </span>
        {typeof card.cost === "number" && (
          <span className="rounded bg-amber-200 px-2 py-1 text-xs font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-300">
            {card.cost} OPS
          </span>
        )}
      </div>

      <h3 className="mb-3 text-xl font-bold">{card.title}</h3>

      {card.text && (
        <div className="mb-4 text-sm leading-relaxed">
          <RuleInlineText text={card.text} />
        </div>
      )}

      {!card.text && card.clarification && (
        <p className="mb-4 italic text-stone-500 dark:text-stone-400">
          Card text pending. See clarification below.
        </p>
      )}

      {card.clarification && (
        <div className="mb-4 rounded-md border-l-4 border-amber-500 bg-amber-50 p-3 dark:bg-amber-900/20">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            Designer Clarification
          </div>
          <div className="text-sm leading-relaxed">
            <RuleInlineText text={card.clarification} />
          </div>
        </div>
      )}

      {card.ruleRefs && card.ruleRefs.length > 0 && (
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
            See also
          </div>
          <div className="flex flex-wrap gap-1.5">
            {card.ruleRefs.map((ref) => (
              <RuleRefBadge key={ref} ruleRef={ref} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
