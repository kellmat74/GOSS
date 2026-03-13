import { RuleRefBadge } from "./RulesReference/RuleRefBadge";

export interface BreadcrumbItem {
  label: string;
  ruleRef?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length <= 1) return null;

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-stone-500">›</span>}
            {isLast ? (
              <span className="font-medium text-accent-400">
                {item.label}
                {item.ruleRef && (
                  <RuleRefBadge ruleRef={item.ruleRef} className="ml-1" />
                )}
              </span>
            ) : (
              <button
                onClick={item.onClick}
                className="text-stone-400 hover:text-accent-400 transition-colors"
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
