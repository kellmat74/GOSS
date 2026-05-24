import { useState, useMemo, useEffect, useRef } from "react";
import type { CardCategory, GameCard, PlayAidBlocksMap } from "../../types/goss";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";
import { RuleInlineText } from "../RulesReference/RuleInlineText";
import { useRules } from "../../context/RulesContext";

interface ActionsPanelProps {
  cards: CardCategory[];
  /** Map of pa<N>:<slug> → play-aid block (pre-rendered HTML). BWN-only; empty for other games. */
  playAidBlocks?: PlayAidBlocksMap;
  title?: string;
  subtitle?: string;
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

export function ActionsPanel({
  cards,
  playAidBlocks = {},
  title = "Actions",
  subtitle = "Operations Phase actions. Click any item to see procedure and play-aid tables inline.",
  emptyMessage = "No actions catalog for this game.",
}: ActionsPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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
            (c.clarification ?? "").toLowerCase().includes(q) ||
            (c.content?.whenItComesUp ?? "").toLowerCase().includes(q),
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
                  const usageBadge = c.usage ? USAGE_BADGE[c.usage] : null;
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
                          {usageBadge && c.usage !== "action" && (
                            <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${usageBadge.cls}`}>
                              {usageBadge.label}
                            </span>
                          )}
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
                          <div className="mt-0.5 line-clamp-2 text-xs text-stone-500 dark:text-stone-400">
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
                <RuleAwareHtml className="prose-action" html={step.html} />
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

      {c.whyAndWatchFor && (
        <section className="mb-5 rounded-md border-l-4 border-emerald-500 bg-emerald-50 p-3 dark:bg-emerald-900/20">
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
            Why and what to watch for
          </h4>
          <RuleAwareHtml
            className="prose-action text-sm leading-relaxed"
            html={c.whyAndWatchForHtml ?? ""}
          />
        </section>
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

/**
 * Renders pre-rendered HTML (from marked) but wires up clickable rule refs.
 * Walks the HTML string at render time, wrapping any `(X.Y.Z)` (and variants
 * including a trailing letter) in a styled button. Uses delegated click on
 * the container to dispatch to `openRule`.
 */
function RuleAwareHtml({ html, className }: { html: string; className?: string }) {
  const { openRule } = useRules();
  const ref = useRef<HTMLDivElement>(null);

  const processed = useMemo(() => {
    // Mirrors src/utils/parseRuleRefs.tsx: find a parenthesized group that
    // STARTS with a digit, then wrap each individual section ref inside it
    // separately so comma-separated lists like (5.2.1, 7.3) yield two
    // independent clickable links.
    const SECTION_RE = /\d+\.\d+(?:\.\d+(?:\.\d+)?)?(?:[a-z])?/g;
    const GROUP_RE = /\((\d[^)]{0,200})\)/g;

    return html.replace(GROUP_RE, (_full, inner) => {
      const wrapped = inner.replace(
        SECTION_RE,
        (ref: string) =>
          `<button type="button" class="rule-ref-inline" data-rule="${ref}">${ref}</button>`
      );
      return `(${wrapped})`;
    });
  }, [html]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t && t.classList.contains("rule-ref-inline")) {
        e.preventDefault();
        e.stopPropagation();
        const r = t.getAttribute("data-rule");
        if (r) openRule(r);
      }
    };
    el.addEventListener("click", handler);
    return () => el.removeEventListener("click", handler);
  }, [openRule, processed]);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
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
  const [open, setOpen] = useState(true);

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
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 bg-amber-100 px-3 py-1.5 text-left text-xs font-semibold text-amber-900 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60"
      >
        <span className="flex items-center gap-2">
          <span className="rounded bg-amber-300 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-amber-900 dark:bg-amber-700 dark:text-amber-100">
            PA{block.paNumber}
          </span>
          <span>{block.title}</span>
        </span>
        <span className="text-amber-700 dark:text-amber-400">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <RuleAwareHtml
          className="prose-action px-3 py-2 text-sm leading-relaxed text-stone-800 dark:text-stone-200"
          html={block.html}
        />
      )}
    </div>
  );
}
