import { useState, useMemo } from "react";
import type { PhysicalCard, CardEvent, CardSide } from "../../types/goss";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";
import { RuleInlineText } from "../RulesReference/RuleInlineText";
import { CollapsibleCoach } from "../CollapsibleCoach";

interface CardsPanelProps {
  cards: PhysicalCard[];
}

const TYPE_LABEL: Record<string, string> = {
  "operations-event": "Operations Event",
  "reaction-event": "Reaction Event",
};

const SIDE_BADGE: Record<CardSide, { label: string; cls: string }> = {
  soviet: { label: "SOV", cls: "bg-red-700 text-white" },
  nato: { label: "NATO", cls: "bg-blue-700 text-white" },
  neutral: { label: "", cls: "" },
};

type SideFilter = "all" | "soviet" | "nato";

export function CardsPanel({ cards }: CardsPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sideFilter, setSideFilter] = useState<SideFilter>("all");

  const filtered = useMemo(() => {
    let out = cards;
    if (sideFilter !== "all") {
      out = out.filter((c) => c.side === sideFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      out = out.filter((c) => {
        return (
          c.cardNumber.toLowerCase().includes(q) ||
          c.ops.title.toLowerCase().includes(q) ||
          c.ops.text.toLowerCase().includes(q) ||
          (c.ops.clarification ?? "").toLowerCase().includes(q) ||
          c.reaction.title.toLowerCase().includes(q) ||
          c.reaction.text.toLowerCase().includes(q) ||
          (c.reaction.clarification ?? "").toLowerCase().includes(q)
        );
      });
    }
    return out;
  }, [cards, query, sideFilter]);

  const grouped = useMemo(() => {
    const soviet = filtered.filter((c) => c.side === "soviet");
    const nato = filtered.filter((c) => c.side === "nato");
    return [
      { id: "soviet", label: "Soviet Event Cards", cards: soviet },
      { id: "nato", label: "NATO Event Cards", cards: nato },
    ].filter((g) => g.cards.length > 0);
  }, [filtered]);

  const selected = useMemo<PhysicalCard | null>(() => {
    if (!selectedId) return null;
    return cards.find((c) => c.id === selectedId) ?? null;
  }, [selectedId, cards]);

  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center text-stone-500">
        <p>No card catalog for this game.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4" style={{ height: "calc(100vh - 8rem)" }}>
      {/* Left: card list */}
      <div className="flex w-full flex-col md:w-1/2 lg:w-2/5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Event Cards</h2>
        </div>
        <p className="mb-3 text-sm text-stone-500">
          Each physical card carries two events: an Operations Event (top) and a Reaction Event (bottom). Click a card to see both events with full text.
        </p>
        <div className="mb-3 flex shrink-0 gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by card #, title, or event text..."
            className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-stone-600 dark:bg-stone-800"
          />
          <SideToggle value={sideFilter} onChange={setSideFilter} />
        </div>
        <div className="flex-1 overflow-y-auto pr-2">
          {grouped.map((g) => (
            <div key={g.id} className="mb-4">
              <div className="sticky top-0 z-[1] bg-white py-1 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:bg-stone-900">
                {g.label} <span className="text-stone-400">({g.cards.length})</span>
              </div>
              <ul className="mt-1 space-y-1">
                {g.cards.map((c) => {
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
                          <span className="font-mono text-xs text-stone-400">#{c.cardNumber}</span>
                          {sideBadge.label && (
                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${sideBadge.cls}`}>
                              {sideBadge.label}
                            </span>
                          )}
                          <span className="ml-auto text-[10px] text-stone-400">
                            {typeof c.ops.cost === "number" ? `${c.ops.cost} / ${c.reaction.cost ?? 0}` : ""}
                          </span>
                        </div>
                        <div className="mt-1 truncate text-xs">
                          <span className="font-semibold text-stone-700 dark:text-stone-200">Ops:</span>{" "}
                          <span className="text-stone-600 dark:text-stone-300">{c.ops.title}</span>
                        </div>
                        <div className="truncate text-xs">
                          <span className="font-semibold text-stone-700 dark:text-stone-200">Rxn:</span>{" "}
                          <span className="text-stone-600 dark:text-stone-300">{c.reaction.title}</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {grouped.length === 0 && (
            <div className="py-8 text-center text-sm text-stone-500">
              No matches for "{query}".
            </div>
          )}
        </div>
      </div>

      {/* Right: detail */}
      <div className="hidden flex-1 overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-800/50 md:block">
        {selected ? (
          <PhysicalCardDetail card={selected} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            Select a card to see both events.
          </div>
        )}
      </div>
    </div>
  );
}

function SideToggle({
  value,
  onChange,
}: {
  value: SideFilter;
  onChange: (v: SideFilter) => void;
}) {
  const opts: { key: SideFilter; label: string; activeCls: string }[] = [
    { key: "all", label: "All", activeCls: "bg-stone-600 text-white" },
    { key: "soviet", label: "SOV", activeCls: "bg-red-700 text-white" },
    { key: "nato", label: "NATO", activeCls: "bg-blue-700 text-white" },
  ];
  return (
    <div
      role="tablist"
      className="inline-flex shrink-0 rounded-lg border border-stone-300 bg-white dark:border-stone-600 dark:bg-stone-800"
    >
      {opts.map((o) => (
        <button
          key={o.key}
          role="tab"
          aria-selected={value === o.key}
          onClick={() => onChange(o.key)}
          className={`px-3 py-2 text-xs font-bold first:rounded-l-lg last:rounded-r-lg ${
            value === o.key
              ? o.activeCls
              : "text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function PhysicalCardDetail({ card }: { card: PhysicalCard }) {
  const sideBadge = SIDE_BADGE[card.side];
  return (
    <div>
      {/* Card header */}
      <div className="mb-4 flex items-center gap-2 border-b border-stone-300 pb-3 dark:border-stone-600">
        <span className="rounded bg-stone-200 px-2 py-1 font-mono text-xs text-stone-700 dark:bg-stone-700 dark:text-stone-200">
          Card #{card.cardNumber}
        </span>
        {sideBadge.label && (
          <span className={`rounded px-2 py-1 text-xs font-bold ${sideBadge.cls}`}>
            {sideBadge.label}
          </span>
        )}
      </div>

      {/* Operations Event */}
      <CardEventBlock event={card.ops} />

      {/* Divider between events */}
      <div className="my-4 border-t border-stone-300 dark:border-stone-600" />

      {/* Reaction Event */}
      <CardEventBlock event={card.reaction} />

      {/* AI Coach note (collapsed by default; short shown first, "Show more" swaps to verbose). Keyed on card id so state resets between cards. */}
      {(card.coachNotesShort || card.coachNotes) && (
        <CollapsibleCoach
          key={`coach-${card.id}`}
          className="mt-4"
          short={
            card.coachNotesShort ? (
              <div className="text-stone-700 dark:text-stone-300">
                <CardText text={card.coachNotesShort} />
              </div>
            ) : undefined
          }
          long={
            card.coachNotes ? (
              <div className="text-stone-700 dark:text-stone-300">
                <CardText text={card.coachNotes} />
              </div>
            ) : undefined
          }
        />
      )}
    </div>
  );
}

function CardEventBlock({ event }: { event: CardEvent }) {
  const isBlank = !event.text && event.title.toLowerCase() === "none";
  return (
    <div>
      <div className="mb-2 flex flex-wrap items-baseline gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          {TYPE_LABEL[event.type] ?? event.type}
        </span>
        {typeof event.cost === "number" && (
          <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-300">
            {event.cost} OPS
          </span>
        )}
        {event.frequency > 1 && !isBlank && (
          <span
            className="ml-auto rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold text-stone-600 dark:bg-stone-700 dark:text-stone-300"
            title="Number of physical cards in the deck that print this event"
          >
            ×{event.frequency} in deck
          </span>
        )}
      </div>

      <h3 className="mb-2 text-lg font-bold">{event.title}</h3>

      {event.text && (
        <div className="mb-2 text-sm leading-relaxed">
          <CardText text={event.text} />
        </div>
      )}

      {/* Clarification attached to THIS event specifically */}
      {event.clarification && (
        <div className="mt-3 rounded-md border-l-4 border-amber-500 bg-amber-50 p-3 dark:bg-amber-900/20">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
            Designer Clarification
          </div>
          <div className="text-sm leading-relaxed">
            <RuleInlineText text={event.clarification} />
          </div>
        </div>
      )}

      {event.ruleRefs && event.ruleRefs.length > 0 && (
        <div className="mt-3">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
            See also
          </div>
          <div className="flex flex-wrap gap-1.5">
            {event.ruleRefs.map((ref) => (
              <RuleRefBadge key={ref} ruleRef={ref} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Render card body text with italic flavor support (*text*) on top of
 * the standard rule-ref + bold inline parsing.
 */
function CardText({ text }: { text: string }) {
  // Split on *...* runs (italic flavor); render alternating spans.
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
          return (
            <em key={i} className="text-stone-500 dark:text-stone-400">
              <RuleInlineText text={part.slice(1, -1)} />
            </em>
          );
        }
        return part ? <RuleInlineText key={i} text={part} /> : null;
      })}
    </>
  );
}
