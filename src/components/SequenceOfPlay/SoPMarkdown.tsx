import { RuleInlineText } from "../RulesReference/RuleInlineText";

interface SoPMarkdownProps {
  content: string;
}

/**
 * Renders PAC markdown content with support for:
 * - **bold** text
 * - ### headings
 * - Numbered lists (1), 2), etc.) and lettered lists (a), b), etc.)
 * - Bullet lists (- item)
 * - Markdown tables
 * - (X.Y.Z) clickable rule references
 * - Blank-line paragraph separation
 */
export function SoPMarkdown({ content }: SoPMarkdownProps) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trimEnd();

    // Skip blank lines
    if (trimmed === "" || trimmed === "---") {
      i++;
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={i} className="mt-4 mb-1.5 text-sm font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
          <RuleInlineText text={trimmed.slice(4)} />
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={i} className="mt-4 mb-2 text-base font-bold text-stone-700 dark:text-stone-200">
          <RuleInlineText text={trimmed.slice(3)} />
        </h3>
      );
      i++;
      continue;
    }

    // Table detection (line starts with |)
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trimEnd().startsWith("|")) {
        tableLines.push(lines[i].trimEnd());
        i++;
      }
      elements.push(<MarkdownTable key={`table-${i}`} lines={tableLines} />);
      continue;
    }

    // Bullet list (- item)
    if (trimmed.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trimEnd().startsWith("- ")) {
        items.push(lines[i].trimEnd().slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="my-1.5 ml-4 space-y-1">
          {items.map((item, j) => (
            <li key={j} className="flex gap-2 text-sm text-stone-600 dark:text-stone-300">
              <span className="mt-0.5 text-stone-400">&bull;</span>
              <span><RuleInlineText text={item} /></span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered/lettered list detection (1), 2), a), b), etc.)
    if (/^[0-9]+\)/.test(trimmed) || /^[a-z]\)/.test(trimmed)) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (/^[0-9]+\)/.test(lines[i].trimEnd()) || /^[a-z]\)/.test(lines[i].trimEnd()))
      ) {
        items.push(lines[i].trimEnd());
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="my-1.5 ml-4 space-y-1">
          {items.map((item, j) => {
            const match = item.match(/^([0-9]+|[a-z])\)\s*(.*)/);
            const label = match?.[1] ?? "";
            const text = match?.[2] ?? item;
            return (
              <li key={j} className="flex gap-2 text-sm text-stone-600 dark:text-stone-300">
                <span className="min-w-[1.5rem] font-mono text-xs text-stone-400">{label})</span>
                <span><RuleInlineText text={text} /></span>
              </li>
            );
          })}
        </ol>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="my-1.5 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
        <RuleInlineText text={trimmed} />
      </p>
    );
    i++;
  }

  return <div className="sop-markdown">{elements}</div>;
}

/** Renders a markdown table */
function MarkdownTable({ lines }: { lines: string[] }) {
  if (lines.length < 2) return null;

  const parseRow = (line: string) =>
    line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

  // Check if row 2 is separator (---|---|...)
  const isSeparator = (line: string) => /^\|[\s\-:|]+\|$/.test(line);
  const headerRow = parseRow(lines[0]);
  const startIdx = isSeparator(lines[1]) ? 2 : 1;
  const bodyRows = lines.slice(startIdx).map(parseRow);

  return (
    <div className="my-3 overflow-x-auto">
      <table className="min-w-full text-xs">
        <thead>
          <tr className="border-b border-stone-300 dark:border-stone-600">
            {headerRow.map((cell, j) => (
              <th
                key={j}
                className="px-2 py-1 text-left font-semibold text-stone-500 dark:text-stone-400"
              >
                <RuleInlineText text={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-stone-200 dark:border-stone-700"
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-2 py-1 text-stone-600 dark:text-stone-300"
                >
                  <RuleInlineText text={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
