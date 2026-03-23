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

  // Render a rule ref as a clickable button or plain text
  const renderRef = (ref: string, key: string | number) => {
    const hasRule = !!getRuleBySection(ref);
    if (!hasRule) return <span key={key}>({ref})</span>;
    return (
      <span
        key={key}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          openRule(ref);
        }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openRule(ref); } }}
        className="font-mono text-accent-700 hover:text-accent-500 hover:underline dark:text-accent-400 dark:hover:text-accent-300 cursor-pointer"
      >
        ({ref})
      </span>
    );
  };

  // Parse rule refs from a plain string segment, returning mixed nodes
  const parseRefs = (s: string, keyPrefix: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    let remaining = s;
    let idx = 0;
    while (remaining.length > 0) {
      const refMatch = remaining.match(/\((\d+\.\d+(?:\.\d+)?(?:[a-z])?)\)/);
      if (!refMatch || refMatch.index === undefined) {
        if (remaining) nodes.push(<span key={`${keyPrefix}-${idx}`}>{remaining}</span>);
        break;
      }
      if (refMatch.index > 0) {
        nodes.push(<span key={`${keyPrefix}-${idx}`}>{remaining.slice(0, refMatch.index)}</span>);
        idx++;
      }
      nodes.push(renderRef(refMatch[1], `${keyPrefix}-${idx}`));
      idx++;
      remaining = remaining.slice(refMatch.index + refMatch[0].length);
    }
    return nodes;
  };

  // Step 1: Parse bold markers first (bold may contain rule refs)
  const boldParts = text.split(/\*\*(.+?)\*\*/g);
  const nodes: React.ReactNode[] = [];
  boldParts.forEach((part, i) => {
    if (i % 2 === 1) {
      // Bold segment — parse rule refs inside it
      nodes.push(
        <strong key={`b${i}`} className="font-semibold">
          {parseRefs(part, `b${i}`)}
        </strong>
      );
    } else if (part) {
      // Non-bold segment — parse rule refs
      nodes.push(...parseRefs(part, `t${i}`));
    }
  });

  return (
    <GlossaryHighlighter>
      <span className={className}>{nodes}</span>
    </GlossaryHighlighter>
  );
}
