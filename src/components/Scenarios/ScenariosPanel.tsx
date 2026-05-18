import { useState, useMemo } from "react";
import type {
  ScenarioBook,
  ScenarioContent,
  ScenarioAlteration,
  ScenarioStartType,
  ScenarioStartTypeScaling,
  ScenarioYearVariant,
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
      {/* Left: scenario list */}
      <div className="flex w-full flex-col md:w-1/3 lg:w-1/4">
        <h2 className="mb-3 text-2xl font-bold">Scenarios</h2>
        <ul className="space-y-1 overflow-y-auto pr-2">
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

      {s.opsTrackNote && (
        <div className="mb-4 rounded-md border-l-4 border-teal-500 bg-teal-50 p-3 text-sm dark:bg-teal-900/20">
          <span className="font-semibold text-teal-700 dark:text-teal-400">OPS Track: </span>
          <RuleInlineText text={s.opsTrackNote} />
        </div>
      )}

      {(s.startTypes?.length ?? 0) > 0 && (
        <Section title="Start Types">
          <StartTypeBlock startTypes={s.startTypes ?? []} scaling={s.startTypeScaling} />
        </Section>
      )}

      {(s.yearVariants?.length ?? 0) > 0 && (
        <Section title="Era Variants">
          <YearVariantsBlock variants={s.yearVariants ?? []} />
        </Section>
      )}

      {(s.alterations?.length ?? 0) > 0 && (
        <Section title="Scenario Alterations">
          <AlterationsBlock alterations={s.alterations ?? []} />
        </Section>
      )}

      {(s.notes?.length ?? 0) > 0 && (
        <Section title="Notes">
          <ul className="list-disc space-y-1 pl-4 text-sm text-stone-600 dark:text-stone-400">
            {(s.notes ?? []).map((n, i) => (
              <li key={i}><RuleInlineText text={n} /></li>
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

function AlterationsBlock({ alterations }: { alterations: ScenarioAlteration[] }) {
  return (
    <div className="space-y-3">
      {alterations.map((alt) => (
        <div
          key={alt.id}
          className="rounded-md border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-800"
        >
          <h4 className="mb-1.5 text-sm font-bold text-stone-800 dark:text-stone-200">
            {alt.title}
          </h4>
          <ProseBlock text={alt.description} />
        </div>
      ))}
    </div>
  );
}

function StartTypeBlock({
  startTypes,
  scaling,
}: {
  startTypes: ScenarioStartType[];
  scaling?: ScenarioStartTypeScaling[];
}) {
  return (
    <div className="space-y-3">
      {startTypes.map((st) => (
        <div
          key={st.id}
          className="rounded-md border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-800"
        >
          <h4 className="mb-1 text-sm font-bold text-stone-800 dark:text-stone-200">
            {st.label}
          </h4>
          <ProseBlock text={st.description} />
          {st.specialRules && (
            <div className="mt-2 rounded bg-stone-100 p-2 text-xs dark:bg-stone-900/40">
              <div className="mb-1 font-semibold uppercase tracking-wide text-stone-500">
                Special rules
              </div>
              <RuleInlineText text={st.specialRules} />
            </div>
          )}
        </div>
      ))}

      {(scaling?.length ?? 0) > 0 && (
        <div className="overflow-x-auto rounded-md border border-stone-200 dark:border-stone-700">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone-300 bg-stone-100 dark:border-stone-600 dark:bg-stone-900/40">
                <th className="px-2 py-1.5 text-left font-semibold text-stone-600 dark:text-stone-300">
                  Value scaled by start type
                </th>
                <th className="px-2 py-1.5 text-center font-semibold text-stone-600 dark:text-stone-300">
                  Strategic
                </th>
                <th className="px-2 py-1.5 text-center font-semibold text-stone-600 dark:text-stone-300">
                  Tactical
                </th>
                <th className="px-2 py-1.5 text-center font-semibold text-stone-600 dark:text-stone-300">
                  Extended
                </th>
              </tr>
            </thead>
            <tbody>
              {(scaling ?? []).map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-stone-200 last:border-b-0 dark:border-stone-700"
                >
                  <td className="px-2 py-1 text-stone-700 dark:text-stone-300">{row.label}</td>
                  <td className="px-2 py-1 text-center font-mono text-stone-600 dark:text-stone-400">
                    {row.strategic ?? "—"}
                  </td>
                  <td className="px-2 py-1 text-center font-mono text-stone-600 dark:text-stone-400">
                    {row.tactical ?? "—"}
                  </td>
                  <td className="px-2 py-1 text-center font-mono text-stone-600 dark:text-stone-400">
                    {row.extended ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function YearVariantsBlock({ variants }: { variants: ScenarioYearVariant[] }) {
  return (
    <div className="space-y-2 text-sm">
      {variants.map((v, i) => (
        <div key={i} className="rounded-md bg-white p-2.5 dark:bg-stone-800">
          <span className="mr-2 inline-block rounded bg-stone-200 px-2 py-0.5 font-mono text-xs text-stone-700 dark:bg-stone-700 dark:text-stone-200">
            {v.year}
          </span>
          <RuleInlineText text={v.notes} />
        </div>
      ))}
    </div>
  );
}
