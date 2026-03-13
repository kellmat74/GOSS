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
        className={`inline-block rounded bg-stone-700 px-1.5 py-0.5 text-xs text-stone-400 ${className}`}
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
    <button
      onClick={handleOpen}
      className={`inline-block rounded bg-stone-700 px-1.5 py-0.5 text-xs text-amber-400 hover:bg-stone-600 hover:text-amber-300 transition-colors cursor-pointer ${className}`}
      title={`View rule ${ruleRef}`}
    >
      §{ruleRef}
    </button>
  );
}
