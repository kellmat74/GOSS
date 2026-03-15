import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from "react";
import { useGlossary } from "../context/GlossaryContext";
import { GlossaryTooltip } from "./GlossaryTooltip";

/**
 * Recursively walks a React element tree and wraps glossary term
 * matches in string children with <GlossaryTooltip> components.
 */
export function GlossaryHighlighter({ children }: { children: ReactNode }) {
  const { getEntry, regex } = useGlossary();

  function processNode(node: ReactNode): ReactNode {
    if (typeof node === "string") {
      return highlightText(node, regex, getEntry);
    }

    if (!isValidElement(node)) return node;

    // Don't recurse into GlossaryTooltip (prevents infinite nesting)
    if (node.type === GlossaryTooltip) return node;

    // Don't recurse into buttons (rule ref links)
    if (node.type === "button") return node;

    const element = node as ReactElement<{ children?: ReactNode }>;
    const kids = element.props.children;
    if (!kids) return node;

    const processed = Children.map(kids, processNode);
    return cloneElement(element, undefined, processed);
  }

  return <>{Children.map(children, processNode)}</>;
}

function highlightText(
  text: string,
  regex: RegExp,
  getEntry: (term: string) => import("../data/glossary").GlossaryEntry | undefined
): ReactNode {
  // Reset regex state
  regex.lastIndex = 0;

  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text))) {
    const entry = getEntry(match[1]);
    if (!entry) continue;

    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    parts.push(
      <GlossaryTooltip key={key++} entry={entry}>
        {match[0]}
      </GlossaryTooltip>
    );
    lastIndex = regex.lastIndex;
  }

  if (parts.length === 0) return text;

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
