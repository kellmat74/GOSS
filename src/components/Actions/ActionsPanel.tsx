import { useState, useMemo } from "react";
import type { CardCategory, GameCard, PlayAidBlocksMap } from "../../types/goss";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";
import { RuleInlineText } from "../RulesReference/RuleInlineText";
import { RuleAwareHtml } from "./RuleAwareHtml";
import { CollapsibleCoach } from "../CollapsibleCoach";

interface ActionsPanelProps {
  cards: CardCategory[];
  /** Map of pa<N>:<slug> → play-aid block (pre-rendered HTML). BWN-only; empty for other games. */
  playAidBlocks?: PlayAidBlocksMap;
  title?: string;
  emptyMessage?: string;
}

const TYPE_LABEL: Record<string, string> = {
  "operations-event": "Action",
  "reaction-event": "Reaction",
  "use-when-active": "Use When Active",
  "use-anytime": "Use Anytime",
};

const USAGE_BADGE: Record<string, { label: string; cls: string }> = {
  action: { label: "ACTION", cls: "bg-sky-200 text-sky-900 dark:bg-sky-900/40 dark:text-sky-200" },
  active: { label: "ACTIVE", cls: "bg-amber-200 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200" },
  anytime: { label: "ANYTIME", cls: "bg-violet-200 text-violet-900 dark:bg-violet-900/40 dark:text-violet-200" },
};

const SIDE_BADGE: Record<string, { label: string; cls: string }> = {
  soviet: { label: "SOV", cls: "bg-red-700 text-white" },
  nato: { label: "NATO", cls: "bg-blue-700 text-white" },
  neutral: { label: "", cls: "" },
};

/** Sub-grouping order + display labels for the verb axis. */
const VERB_ORDER = ["setup", "move", "attack", "detect", "patrol-react", "special"] as const;
const VERB_LABEL: Record<string, string> = {
  setup: "Setup",
  move: "Move",
  attack: "Attack",
  detect: "Detect",
  "patrol-react": "Patrol / React",
  special: "Special",
};

export function ActionsPanel({
  cards,
  playAidBlocks = {},
  title = "Actions",
  emptyMessage = "No actions catalog for this game.",
}: ActionsPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    () => cards[0]?.id ?? ""
  );
  const [query, setQuery] = useState("");

  // Reset active category when the cards source changes (game switch).
  useMemo(() => {
    if (cards.length > 0 && !cards.find((c) => c.id === activeCategoryId)) {
      setActiveCategoryId(cards[0].id);
    }
  }, [cards, activeCategoryId]);

  const q = query.trim().toLowerCase();
  const activeCategory = cards.find((c) => c.id === activeCategoryId) ?? cards[0];

  /** Cross-category search matches; when query is empty, show only active category. */
  const filtered = useMemo<CardCategory[]>(() => {
    if (!q) {
      return activeCategory ? [activeCategory] : [];
    }
    return cards
      .map((cat) => ({
        ...cat,
        cards: cat.cards.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.cardNumber.toLowerCase().includes(q) ||
            (c.text ?? "").toLowerCase().includes(q) ||
            (c.clarification ?? "").toLowerCase().includes(q) ||
            (c.content?.whenItComesUp ?? "").toLowerCase().includes(q),
        ),
      }))
      .filter((cat) => cat.cards.length > 0);
  }, [cards, q, activeCategory]);

  /** Per-category counts shown on the category tabs. */
  const categoryCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const cat of cards) m[cat.id] = cat.cards.length;
    return m;
  }, [cards]);

  /** Group an array of cards by verb in the canonical verb order. */
  const groupByVerb = (cs: GameCard[]) => {
    const groups: { verb: string; cards: GameCard[] }[] = [];
    for (const v of VERB_ORDER) {
      const subset = cs.filter((c) => (c.verb ?? "special") === v);
      if (subset.length > 0) groups.push({ verb: v, cards: subset });
    }
    return groups;
  };

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

  const renderRow = (c: GameCard) => {
    const isSel = c.id === selectedId;
    const sideBadge = SIDE_BADGE[c.side];
    const usageBadge = c.usage ? USAGE_BADGE[c.usage] : null;
    return (
      <li key={c.id}>
        <button
          onClick={() => setSelectedId(c.id)}
          className={`flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm transition-colors ${
            isSel
              ? "bg-accent-500/15 text-stone-900 dark:text-stone-100"
              : "hover:bg-stone-100 dark:hover:bg-stone-700/60"
          }`}
        >
          <span className="flex-1 truncate">{c.title}</span>
          {usageBadge && c.usage !== "action" && (
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${usageBadge.cls}`}>
              {usageBadge.label}
            </span>
          )}
          {sideBadge.label && (
            <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${sideBadge.cls}`}>
              {sideBadge.label}
            </span>
          )}
          {typeof c.cost === "number" && (
            <span className="shrink-0 rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-semibold text-stone-700 dark:bg-stone-700 dark:text-stone-300">
              {c.cost} OPS
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <div className="flex h-full gap-4" style={{ height: "calc(100vh - 8rem)" }}>
      {/* Left: category tabs + filtered actions */}
      <div className="flex w-full md:w-1/2 lg:w-2/5">
        {/* Category tabs (vertical) */}
        <nav className="flex w-28 shrink-0 flex-col border-r border-stone-200 pr-2 dark:border-stone-700">
          <h2 className="mb-2 text-base font-bold">{title}</h2>
          {cards.map((cat) => {
            const isActive = cat.id === activeCategoryId && !q;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategoryId(cat.id);
                  setQuery("");
                }}
                className={`mb-0.5 flex items-center justify-between rounded px-2 py-1.5 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-accent-500 text-white"
                    : "hover:bg-stone-100 dark:hover:bg-stone-700/60"
                }`}
              >
                <span className="font-medium">{cat.label}</span>
                <span
                  className={`shrink-0 rounded px-1.5 py-0 text-[10px] font-bold ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-stone-200 text-stone-600 dark:bg-stone-700 dark:text-stone-300"
                  }`}
                >
                  {categoryCounts[cat.id] ?? 0}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Actions list for the active (or search-matched) category */}
        <div className="flex flex-1 flex-col pl-3">
          <div className="mb-2 shrink-0">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search all actions..."
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-accent-500 focus:outline-none focus:ring-1 focus:ring-accent-500 dark:border-stone-600 dark:bg-stone-800"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((cat) => (
              <div key={cat.id} className="mb-3">
                {q && (
                  <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                    {cat.label}
                  </div>
                )}
                {groupByVerb(cat.cards).map((g) => (
                  <div key={g.verb} className="mb-2">
                    <div className="mb-1 border-b border-stone-200 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:border-stone-700 dark:text-stone-400">
                      {VERB_LABEL[g.verb]} <span className="text-stone-400">({g.cards.length})</span>
                    </div>
                    <ul className="space-y-0.5">{g.cards.map(renderRow)}</ul>
                  </div>
                ))}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-8 text-center text-sm text-stone-500">
                No matches for "{query}".
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right: detail panel */}
      <div className="hidden flex-1 overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-800/50 md:block">
        {selectedCard ? (
          <CardDetail card={selectedCard} playAidBlocks={playAidBlocks} onNavigate={setSelectedId} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            Select an action to see details.
          </div>
        )}
      </div>
    </div>
  );
}

function CardDetail({
  card,
  playAidBlocks,
  onNavigate,
}: {
  card: GameCard;
  playAidBlocks: PlayAidBlocksMap;
  onNavigate: (id: string) => void;
}) {
  const sideBadge = SIDE_BADGE[card.side];
  const usageBadge = card.usage ? USAGE_BADGE[card.usage] : null;
  const hasRichContent = !!card.content?.procedure?.length;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {card.cardNumber !== "—" && (
          <span className="rounded bg-stone-200 px-2 py-1 font-mono text-xs text-stone-700 dark:bg-stone-700 dark:text-stone-200">
            #{card.cardNumber}
          </span>
        )}
        {usageBadge && (
          <span className={`rounded px-2 py-1 text-xs font-bold tracking-wide ${usageBadge.cls}`}>
            {usageBadge.label}
          </span>
        )}
        {!usageBadge && (
          <span className="rounded border border-stone-300 px-2 py-1 text-xs text-stone-600 dark:border-stone-600 dark:text-stone-300">
            {TYPE_LABEL[card.type] ?? card.type}
          </span>
        )}
        {sideBadge.label && (
          <span className={`rounded px-2 py-1 text-xs font-bold ${sideBadge.cls}`}>
            {sideBadge.label}
          </span>
        )}
        {typeof card.cost === "number" && (
          <span className="rounded bg-amber-200 px-2 py-1 text-xs font-bold text-amber-900 dark:bg-amber-900/40 dark:text-amber-300">
            {card.cost} OPS
          </span>
        )}
      </div>

      <h3 className="mb-3 text-xl font-bold">{card.title}</h3>

      {hasRichContent ? (
        <RichActionContent card={card} playAidBlocks={playAidBlocks} onNavigate={onNavigate} />
      ) : (
        <SimpleActionContent card={card} />
      )}
    </div>
  );
}

/** Render the rich content from BWN merge pipeline. */
function RichActionContent({
  card,
  playAidBlocks,
  onNavigate,
}: {
  card: GameCard;
  playAidBlocks: PlayAidBlocksMap;
  onNavigate: (id: string) => void;
}) {
  const c = card.content!;
  return (
    <div>
      {c.whenItComesUpHtml && (
        <section className="mb-5">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
            When does this come up?
          </h4>
          <RuleAwareHtml
            className="prose-action text-sm leading-relaxed"
            html={c.whenItComesUpHtml}
            onNavigateAction={onNavigate}
          />
        </section>
      )}

      {c.procedure && c.procedure.length > 0 && (
        <section className="mb-5">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
            Procedure
          </h4>
          <ol className="space-y-3 list-decimal pl-6">
            {c.procedure.map((step, i) => (
              <li key={i} className="text-sm leading-relaxed">
                <RuleAwareHtml className="prose-action" html={step.html} onNavigateAction={onNavigate} />
                {step.blocks.map((ref, j) => {
                  const block = playAidBlocks[ref.slug];
                  return (
                    <PlayAidInline
                      key={`${ref.slug}-${j}`}
                      slug={ref.slug}
                      label={ref.label}
                      block={block}
                    />
                  );
                })}
              </li>
            ))}
          </ol>
        </section>
      )}

      {c.seeAlso && (c.seeAlso.actions.length > 0 || c.seeAlso.ruleRefs.length > 0 || (card.ruleRefs && card.ruleRefs.length > 0)) && (
        <section className="mb-5">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
            See also
          </h4>
          {c.seeAlso.actions.length > 0 && (
            <ul className="mb-2 space-y-1 text-sm">
              {c.seeAlso.actions.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(a.id)}
                    className="text-left text-accent-700 underline-offset-2 hover:underline dark:text-accent-300"
                  >
                    → {a.title}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {(card.ruleRefs && card.ruleRefs.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {card.ruleRefs.map((ref) => (
                <RuleRefBadge key={ref} ruleRef={ref} />
              ))}
            </div>
          )}
        </section>
      )}

      {(c.whyAndWatchForShort || c.whyAndWatchFor) && (
        <CollapsibleCoach
          key={`coach-${card.id}`}
          className="mb-5"
          short={
            c.whyAndWatchForShortHtml ? (
              <RuleAwareHtml
                className="prose-action text-sm leading-relaxed"
                html={c.whyAndWatchForShortHtml}
                onNavigateAction={onNavigate}
              />
            ) : undefined
          }
          long={
            c.whyAndWatchForHtml ? (
              <RuleAwareHtml
                className="prose-action text-sm leading-relaxed"
                html={c.whyAndWatchForHtml}
                onNavigateAction={onNavigate}
              />
            ) : undefined
          }
        />
      )}
    </div>
  );
}

/** Fallback simple rendering when the card doesn't have rich content (e.g. event cards). */
function SimpleActionContent({ card }: { card: GameCard }) {
  return (
    <>
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
    </>
  );
}

/** Inline render of a play-aid block, collapsed by default. */
function PlayAidInline({
  slug,
  label,
  block,
}: {
  slug: string;
  label: string;
  block: import("../../types/goss").PlayAidBlock | undefined;
}) {
  const [open, setOpen] = useState(false);

  if (!block) {
    // Unresolved ref — render as a warning chip
    return (
      <div className="mt-2 ml-1 rounded-md border-l-4 border-red-500 bg-red-50 p-2 text-xs text-red-900 dark:bg-red-900/20 dark:text-red-300">
        <span className="font-mono">{slug}</span> · {label} (unresolved play-aid reference)
      </div>
    );
  }

  return (
    <div className="mt-2 ml-1 overflow-hidden rounded-md border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/30">
      <div className="flex w-full items-center gap-2 bg-amber-100 px-3 py-1.5 dark:bg-amber-900/40">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 text-left text-xs font-semibold text-amber-900 hover:underline dark:text-amber-200"
        >
          <span className="rounded bg-amber-300 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-amber-900 dark:bg-amber-700 dark:text-amber-100">
            PA{block.paNumber}
          </span>
          <span>{block.title}</span>
        </button>
        {block.ruleRefs && block.ruleRefs.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {block.ruleRefs.map((ref) => (
              <RuleRefBadge key={ref} ruleRef={ref} />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-amber-700 dark:text-amber-400"
          aria-label={open ? "collapse" : "expand"}
        >
          {open ? "−" : "+"}
        </button>
      </div>
      {open && (
        <RuleAwareHtml
          className="prose-action px-3 py-2 text-sm leading-relaxed text-stone-800 dark:text-stone-200"
          html={block.html}
        />
      )}
    </div>
  );
}
