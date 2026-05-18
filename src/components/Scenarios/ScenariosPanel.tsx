import { useState, useMemo } from "react";
import type {
  ScenarioBook,
  ScenarioContent,
  ScenarioSetupUnit,
  ScenarioReinforcement,
} from "../../types/goss";
import { RuleInlineText } from "../RulesReference/RuleInlineText";

interface ScenariosPanelProps {
  book: ScenarioBook | null;
}

export function ScenariosPanel({ book }: ScenariosPanelProps) {
  const scenarios = book?.scenarios ?? [];
  const [selectedId, setSelectedId] = useState<string | null>(
    scenarios[0]?.id ?? null,
  );

  const selected = useMemo(
    () => scenarios.find((s) => s.id === selectedId) ?? null,
    [scenarios, selectedId],
  );

  if (scenarios.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center text-stone-500">
        <p>No scenarios available for this game.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4" style={{ height: "calc(100vh - 8rem)" }}>
      {/* Left: scenario list + shared notes */}
      <div className="flex w-full flex-col md:w-1/3 lg:w-1/4">
        <h2 className="mb-3 text-2xl font-bold">Scenarios</h2>
        <ul className="space-y-1 pr-2">
          {scenarios.map((s) => {
            const isSel = s.id === selectedId;
            return (
              <li key={s.id}>
                <button
                  onClick={() => setSelectedId(s.id)}
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                    isSel
                      ? "border-accent-500 bg-accent-500/10 text-stone-900 dark:text-stone-100"
                      : "border-stone-200 bg-white hover:border-accent-400 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700/60"
                  }`}
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs text-stone-400">#{s.number}</span>
                    <span className="flex-1 font-semibold">{s.title}</span>
                    {s.year && (
                      <span className="text-xs text-stone-500">{s.year}</span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Shared notes */}
        {book?.shared && (book.shared.fivePointOpsTrack || (book.shared.oftenOverlookedRules?.length ?? 0) > 0) && (
          <div className="mt-6 rounded-md border border-stone-200 bg-stone-50 p-3 text-xs dark:border-stone-700 dark:bg-stone-800/50">
            <h3 className="mb-1 font-semibold uppercase tracking-wide text-stone-500">
              Shared notes
            </h3>
            {book.shared.fivePointOpsTrack && (
              <div className="mb-2 text-stone-600 dark:text-stone-400">
                <div className="mb-0.5 font-semibold">1–5 OPS Track</div>
                <RuleInlineText text={book.shared.fivePointOpsTrack} />
              </div>
            )}
            {(book.shared.oftenOverlookedRules?.length ?? 0) > 0 && (
              <div className="text-stone-600 dark:text-stone-400">
                <div className="mb-0.5 font-semibold">Often Overlooked</div>
                <ul className="list-disc pl-4">
                  {(book.shared.oftenOverlookedRules ?? []).map((r, i) => (
                    <li key={i}><RuleInlineText text={r} /></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: detail */}
      <div className="hidden flex-1 overflow-y-auto rounded-lg border border-stone-200 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-800/50 md:block">
        {selected ? (
          <ScenarioDetail scenario={selected} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-stone-400">
            Select a scenario.
          </div>
        )}
      </div>
    </div>
  );
}

function ScenarioDetail({ scenario: s }: { scenario: ScenarioContent }) {
  return (
    <div>
      <div className="mb-4 flex items-baseline gap-3 border-b border-stone-300 pb-3 dark:border-stone-600">
        <span className="rounded bg-stone-200 px-2 py-1 font-mono text-xs text-stone-700 dark:bg-stone-700 dark:text-stone-200">
          Scenario #{s.number}
        </span>
        <h2 className="text-2xl font-bold">{s.title}</h2>
        {s.year && (
          <span className="ml-auto text-sm text-stone-500">{s.year}</span>
        )}
      </div>

      {/* Quick-facts strip */}
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        {s.opsPerDay && (
          <Pill label="NATO OPS/day" value={String(s.opsPerDay.nato)} />
        )}
        {s.opsPerDay && (
          <Pill label="Soviet OPS/day" value={String(s.opsPerDay.soviet)} />
        )}
        {typeof s.turns === "number" && <Pill label="Turns" value={String(s.turns)} />}
        {typeof s.firstStrike === "number" && (
          <Pill label="First Strike turn" value={String(s.firstStrike)} />
        )}
      </div>

      <Section title="Briefing">
        <ProseBlock text={s.briefing} />
      </Section>

      <Section title="Victory Conditions">
        <ProseBlock text={s.victoryConditions} />
      </Section>

      {s.specialRules && (
        <Section title="Special Rules">
          <ProseBlock text={s.specialRules} />
        </Section>
      )}

      {(s.yearVariants?.length ?? 0) > 0 && (
        <Section title="Year Variants">
          {(s.yearVariants ?? []).map((v, i) => (
            <div key={i} className="mb-2">
              <div className="font-semibold">{v.year}</div>
              <ProseBlock text={v.notes} />
            </div>
          ))}
        </Section>
      )}

      <Section title="Setup">
        <div className="grid gap-4 md:grid-cols-2">
          <SetupTable side="NATO" units={s.setup?.nato ?? []} />
          <SetupTable side="Soviet" units={s.setup?.soviet ?? []} />
        </div>
      </Section>

      {(s.reinforcements?.length ?? 0) > 0 && (
        <Section title="Reinforcements">
          <ReinforcementTable list={s.reinforcements ?? []} />
        </Section>
      )}

      {(s.notes?.length ?? 0) > 0 && (
        <Section title="Notes">
          <ul className="list-disc pl-4 text-sm text-stone-500">
            {(s.notes ?? []).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-baseline gap-1 rounded bg-stone-200 px-2 py-1 dark:bg-stone-700">
      <span className="text-stone-500">{label}:</span>
      <span className="font-semibold text-stone-800 dark:text-stone-200">{value}</span>
    </span>
  );
}

/** Multi-paragraph prose with rule-ref / glossary parsing. */
function ProseBlock({ text }: { text: string }) {
  if (!text) return null;
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  return (
    <div className="space-y-2 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
      {paragraphs.map((p, i) => (
        <p key={i}><RuleInlineText text={p} /></p>
      ))}
    </div>
  );
}

function SetupTable({ side, units }: { side: string; units: ScenarioSetupUnit[] }) {
  return (
    <div>
      <div
        className={`mb-1 inline-block rounded px-2 py-0.5 text-xs font-bold ${
          side === "NATO" ? "bg-blue-700 text-white" : "bg-red-700 text-white"
        }`}
      >
        {side} ({units.length})
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-stone-300 dark:border-stone-600">
              <th className="px-2 py-1 text-left">Unit</th>
              <th className="px-2 py-1 text-left">Type</th>
              <th className="px-2 py-1 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u, i) => (
              <tr
                key={i}
                className="border-b border-stone-200 last:border-b-0 dark:border-stone-700"
              >
                <td className="px-2 py-1 font-semibold text-stone-700 dark:text-stone-200">
                  {u.unit}
                </td>
                <td className="px-2 py-1 text-stone-600 dark:text-stone-400">{u.type}</td>
                <td className="px-2 py-1 text-stone-600 dark:text-stone-400">{u.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReinforcementTable({ list }: { list: ScenarioReinforcement[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-stone-300 dark:border-stone-600">
            <th className="px-2 py-1 text-left">Turn</th>
            <th className="px-2 py-1 text-left">Side</th>
            <th className="px-2 py-1 text-left">Unit</th>
            <th className="px-2 py-1 text-left">Type</th>
            <th className="px-2 py-1 text-left">Location</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r, i) => (
            <tr
              key={i}
              className="border-b border-stone-200 last:border-b-0 dark:border-stone-700"
            >
              <td className="px-2 py-1 font-mono">{r.turn}</td>
              <td className="px-2 py-1">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    r.side === "nato" ? "bg-blue-700 text-white" : "bg-red-700 text-white"
                  }`}
                >
                  {r.side.toUpperCase()}
                </span>
              </td>
              <td className="px-2 py-1 font-semibold">{r.unit}</td>
              <td className="px-2 py-1 text-stone-600 dark:text-stone-400">{r.type}</td>
              <td className="px-2 py-1 text-stone-600 dark:text-stone-400">{r.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
