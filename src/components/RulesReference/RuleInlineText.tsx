import { useRules } from "../../context/RulesContext";
import { GlossaryHighlighter } from "../GlossaryHighlighter";

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

  // Render a string segment, parsing **bold** markers
  const renderText = (s: string, keyPrefix: string) => {
    const boldParts = s.split(/\*\*(.+?)\*\*/g);
    if (boldParts.length === 1) return <span key={keyPrefix}>{s}</span>;
    return (
      <span key={keyPrefix}>
        {boldParts.map((bp, j) =>
          j % 2 === 1 ? (
            <strong key={j} className="font-semibold">{bp}</strong>
          ) : bp ? (
            <span key={j}>{bp}</span>
          ) : null
        )}
      </span>
    );
  };

  // If no refs found, return text with bold parsing
  if (parts.length === 1 && typeof parts[0] === "string") {
    return <span className={className}>{renderText(text, "0")}</span>;
  }

  return (
    <GlossaryHighlighter>
      <span className={className}>
        {parts.map((part, i) => {
          if (typeof part === "string") return renderText(part, String(i));
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
              className="font-mono text-accent-700 hover:text-accent-500 hover:underline dark:text-accent-400 dark:hover:text-accent-300"
            >
              ({part.ref})
            </button>
          );
        })}
      </span>
    </GlossaryHighlighter>
  );
}
