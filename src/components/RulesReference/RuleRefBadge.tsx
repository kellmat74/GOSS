import { useRules } from "../../context/RulesContext";

interface RuleRefBadgeProps {
  ruleRef: string;
  className?: string;
}

export function RuleRefBadge({ ruleRef, className = "" }: RuleRefBadgeProps) {
  const { getRuleBySection, openRule } = useRules();
  const hasRule = !!getRuleBySection(ruleRef);

  if (!hasRule) {
    // Non-clickable plain badge
    return (
      <span
        className={`inline-block rounded bg-stone-300 px-1.5 py-0.5 text-xs text-stone-500 dark:bg-stone-700 dark:text-stone-400 ${className}`}
      >
        §{ruleRef}
      </span>
    );
  }

  const handleOpen = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    openRule(ruleRef);
  };

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpen(e as unknown as React.MouseEvent); } }}
      className={`inline-block rounded bg-accent-500 px-1.5 py-0.5 text-xs text-white hover:bg-accent-600 dark:bg-stone-700 dark:text-accent-400 dark:hover:bg-stone-600 dark:hover:text-accent-300 transition-colors cursor-pointer ${className}`}
      title={`View rule ${ruleRef}`}
    >
      §{ruleRef}
    </span>
  );
}
