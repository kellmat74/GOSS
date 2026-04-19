import { useRules } from "../../context/RulesContext";
import { GlossaryHighlighter } from "../GlossaryHighlighter";
import { parseRuleRefNodes } from "../../utils/parseRuleRefs";

interface RuleInlineTextProps {
  text: string;
  className?: string;
}

/**
 * Renders text with clickable rule references.
 * Handles: (X.Y.Z), (X.Y/Z.W), (X.Y, Z.W), (X.Y #N), [NWT2E ...], etc.
 */
export function RuleInlineText({ text, className }: RuleInlineTextProps) {
  const { getRuleBySection, openRule } = useRules();

  // Parse bold markers first; delegate ref parsing inside each segment to the utility
  const boldParts = text.split(/(\*\*(?:[^*]|\*(?!\*))+\*\*)/g);
  const nodes: React.ReactNode[] = [];

  boldParts.forEach((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      // Bold segment — strip markers, parse refs inside
      const inner = part.slice(2, -2);
      nodes.push(
        <strong key={`b${i}`} className="font-semibold">
          {parseRuleRefNodes(inner, { getRuleBySection, openRule, keyPrefix: `b${i}` })}
        </strong>
      );
    } else if (part) {
      // Plain segment
      nodes.push(
        ...parseRuleRefNodes(part, { getRuleBySection, openRule, keyPrefix: `t${i}` })
      );
    }
  });

  return (
    <GlossaryHighlighter>
      <span className={className}>{nodes}</span>
    </GlossaryHighlighter>
  );
}
