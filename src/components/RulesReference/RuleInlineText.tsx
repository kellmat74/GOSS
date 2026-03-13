import { useRules } from "../../context/RulesContext";

interface RuleInlineTextProps {
  text: string;
  className?: string;
}

/**
 * Renders text with clickable rule references.
 * Parses (X.Y.Z) patterns and renders them as clickable links
 * that open the rule modal. Works in notes, checklists, descriptions, etc.
 */
export function RuleInlineText({ text, className }: RuleInlineTextProps) {
  const { getRuleBySection, openRule } = useRules();

  const parts: (string | { ref: string })[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const refMatch = remaining.match(/\((\d+\.\d+(?:\.\d+)?(?:[a-z])?)\)/);
    if (!refMatch || refMatch.index === undefined) {
      parts.push(remaining);
      break;
    }
    if (refMatch.index > 0) {
      parts.push(remaining.slice(0, refMatch.index));
    }
    parts.push({ ref: refMatch[1] });
    remaining = remaining.slice(refMatch.index + refMatch[0].length);
  }

  // If no refs found, return plain text
  if (parts.length === 1 && typeof parts[0] === "string") {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (typeof part === "string") return <span key={i}>{part}</span>;
        const hasRule = !!getRuleBySection(part.ref);
        if (!hasRule) return <span key={i}>({part.ref})</span>;
        return (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              openRule(part.ref);
            }}
            className="font-mono text-accent-400 hover:text-accent-300 hover:underline"
          >
            ({part.ref})
          </button>
        );
      })}
    </span>
  );
}
