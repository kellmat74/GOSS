import type { OptionalRuleEntry, SupplementConfig } from "../../types/platform";
import { RuleRefBadge } from "../RulesReference/RuleRefBadge";

interface OptionsPanelProps {
  allRules: OptionalRuleEntry[];
  supplements: SupplementConfig[];
  activeOptions: Set<string>;
  onToggle: (id: string) => void;
  onResetToDefaults: () => void;
}

export function OptionsPanel({
  allRules,
  supplements,
  activeOptions,
  onToggle,
  onResetToDefaults,
}: OptionsPanelProps) {
  if (allRules.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center text-stone-400">
        <p>No optional rules available for this game/module.</p>
      </div>
    );
  }

  const standardRules = allRules.filter((r) => r.source === "standard");
  const advancedRules = allRules.filter((r) => r.source === "advanced");
  const activeCount = allRules.filter((r) => activeOptions.has(r.id)).length;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">
            Optional Rules
          </h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Select which optional rules are in play. Active rules are shown inline
            in the SoP and AI Coach.{" "}
            <span className="font-medium text-accent-500">
              {activeCount} of {allRules.length} active
            </span>
          </p>
        </div>
        <button
          onClick={onResetToDefaults}
          className="rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 dark:border-stone-600 dark:text-stone-300 dark:hover:bg-stone-700"
        >
          Reset to defaults
        </button>
      </div>

      {/* Standard optional rules */}
      {standardRules.length > 0 && (
        <RuleGroup
          title="Standard Game Optional Rules"
          rules={standardRules}
          activeOptions={activeOptions}
          onToggle={onToggle}
        />
      )}

      {/* Advanced optional rules */}
      {advancedRules.length > 0 && (
        <RuleGroup
          title="Advanced Game Optional Rules"
          rules={advancedRules}
          activeOptions={activeOptions}
          onToggle={onToggle}
        />
      )}

      {/* Supplements */}
      {supplements.map((supp) => {
        const suppRules = allRules.filter(
          (r) => r.source === "supplement" && r.supplementId === supp.id,
        );
        if (suppRules.length === 0) return null;
        return (
          <RuleGroup
            key={supp.id}
            title={supp.label}
            subtitle={supp.description}
            rules={suppRules}
            activeOptions={activeOptions}
            onToggle={onToggle}
          />
        );
      })}
    </div>
  );
}

interface RuleGroupProps {
  title: string;
  subtitle?: string;
  rules: OptionalRuleEntry[];
  activeOptions: Set<string>;
  onToggle: (id: string) => void;
}

function RuleGroup({ title, subtitle, rules, activeOptions, onToggle }: RuleGroupProps) {
  const activeCount = rules.filter((r) => activeOptions.has(r.id)).length;

  return (
    <section>
      <div className="mb-3 flex items-baseline gap-2">
        <h3 className="font-semibold text-stone-700 dark:text-stone-300">{title}</h3>
        <span className="text-xs text-stone-400">
          {activeCount}/{rules.length} active
        </span>
      </div>
      {subtitle && (
        <p className="mb-3 text-sm text-stone-500 dark:text-stone-400">{subtitle}</p>
      )}
      <div className="divide-y divide-stone-100 rounded-lg border border-stone-200 bg-white dark:divide-stone-700 dark:border-stone-700 dark:bg-stone-800/50">
        {rules.map((rule) => (
          <RuleRow
            key={rule.id}
            rule={rule}
            active={activeOptions.has(rule.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </section>
  );
}

interface RuleRowProps {
  rule: OptionalRuleEntry;
  active: boolean;
  onToggle: (id: string) => void;
}

function RuleRow({ rule, active, onToggle }: RuleRowProps) {
  return (
    <label className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-stone-50 dark:hover:bg-stone-700/50">
      {/* Toggle */}
      <div className="mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={active}
          onChange={() => onToggle(rule.id)}
          className="h-4 w-4 rounded border-stone-300 text-accent-600 focus:ring-accent-500 dark:border-stone-600"
        />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`text-sm font-medium ${active ? "text-stone-800 dark:text-stone-100" : "text-stone-500 dark:text-stone-400"}`}>
            {rule.label}
          </span>
          <RuleRefBadge ruleRef={rule.section} />
          {rule.vpCost && (
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
              {rule.vpCost.side}: {rule.vpCost.cost > 0 ? "+" : ""}{rule.vpCost.cost} VP
            </span>
          )}
          {rule.default && (
            <span className="rounded bg-stone-100 px-1.5 py-0.5 text-xs text-stone-400 dark:bg-stone-700 dark:text-stone-500">
              default
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
          {rule.description}
        </p>
      </div>
    </label>
  );
}
