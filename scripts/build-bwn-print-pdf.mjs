#!/usr/bin/env node
/**
 * Build a print-friendly PDF combining BWN play-aid markdowns and per-action
 * markdowns. Output: docs/BWN/BWN-Action-and-PlayAid-Draft.pdf
 *
 * Use case: print and hand-edit. Large margins, readable font, page breaks
 * between actions, visible callouts for `{{PA-BLOCK: ??? — label}}` placeholders.
 *
 * Run: `node scripts/build-bwn-print-pdf.mjs`
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PLAY_AIDS_DIR = join(ROOT, "docs/BWN/play-aids");
const ACTIONS_DIR = join(ROOT, "docs/BWN/actions");
const OUTPUT_PATH = join(ROOT, "docs/BWN/BWN-Action-and-PlayAid-Draft.pdf");

/** Strip YAML frontmatter from a markdown file. Returns {frontmatter, body}. */
function splitFrontmatter(md) {
  if (!md.startsWith("---\n")) return { frontmatter: {}, body: md };
  const end = md.indexOf("\n---\n", 4);
  if (end === -1) return { frontmatter: {}, body: md };
  const raw = md.slice(4, end);
  const body = md.slice(end + 5);
  const frontmatter = {};
  let currentKey = null;
  let currentList = null;
  for (const line of raw.split("\n")) {
    if (/^\s*-\s+/.test(line) && currentList) {
      currentList.push(line.replace(/^\s*-\s+"?(.*?)"?$/, "$1"));
    } else {
      const m = line.match(/^([a-zA-Z]+):\s*(.*)$/);
      if (m) {
        const [, key, val] = m;
        currentKey = key;
        if (val === "") {
          currentList = [];
          frontmatter[key] = currentList;
        } else {
          currentList = null;
          frontmatter[key] = val.replace(/^"(.*)"$/, "$1");
        }
      }
    }
  }
  return { frontmatter, body };
}

/** Highlight {{PA-BLOCK: ??? — label}} placeholders as boxed callouts. */
function highlightPlaceholders(html) {
  return html.replace(
    /\{\{PA-BLOCK:\s*([^}]+)\}\}/g,
    '<div class="pa-placeholder">PA-BLOCK · $1</div>'
  );
}

function renderFile(md) {
  const { frontmatter, body } = splitFrontmatter(md);
  let html = marked.parse(body);
  html = highlightPlaceholders(html);
  return { frontmatter, html };
}

/** Render one action page with its frontmatter as a metadata strip. */
function renderActionPage(filename, md) {
  const { frontmatter, html } = renderFile(md);
  const meta = [
    frontmatter.id && `<code>${frontmatter.id}</code>`,
    frontmatter.usage && `<span class="badge usage-${frontmatter.usage}">${frontmatter.usage}</span>`,
    frontmatter.cost != null && frontmatter.cost !== "null" && `<span class="badge cost">${frontmatter.cost} OPS</span>`,
    frontmatter.side && frontmatter.side !== "neutral" && `<span class="badge side-${frontmatter.side}">${frontmatter.side}</span>`,
    frontmatter.category && `<span class="badge category">${frontmatter.category}</span>`,
  ]
    .filter(Boolean)
    .join(" · ");
  const refs = Array.isArray(frontmatter.ruleRefs)
    ? `<div class="rule-refs"><strong>Rule refs:</strong> ${frontmatter.ruleRefs.map((r) => `(${r})`).join(" ")}</div>`
    : "";
  return `
    <section class="page action-page">
      <div class="meta-strip">${meta}</div>
      ${refs}
      ${html}
      <div class="footer-filename">${filename}</div>
    </section>
  `;
}

function renderPlayAidPage(filename, md) {
  const { html } = renderFile(md);
  return `
    <section class="page playaid-page">
      ${html}
      <div class="footer-filename">${filename}</div>
    </section>
  `;
}

function buildHTML() {
  // Play-aid files in numeric order
  const playAidFiles = readdirSync(PLAY_AIDS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .sort();

  // Action files — group by category in a useful reading order
  const allActionFiles = readdirSync(ACTIONS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();
  const groupByCategory = (files) => {
    const groups = { ship: [], sub: [], air: [], misc: [] };
    for (const f of files) {
      const md = readFileSync(join(ACTIONS_DIR, f), "utf-8");
      const { frontmatter } = splitFrontmatter(md);
      const cat = (frontmatter.category || "misc-actions").replace("-actions", "");
      if (groups[cat]) groups[cat].push(f);
      else groups.misc.push(f);
    }
    return groups;
  };
  const grouped = groupByCategory(allActionFiles);

  const playAidsHTML = playAidFiles
    .map((f) => renderPlayAidPage(f, readFileSync(join(PLAY_AIDS_DIR, f), "utf-8")))
    .join("\n");

  const renderGroup = (label, files) => `
    <section class="page section-divider">
      <h1 class="divider-h1">${label}</h1>
      <p class="divider-sub">${files.length} action${files.length === 1 ? "" : "s"} in this group</p>
    </section>
    ${files.map((f) => renderActionPage(f, readFileSync(join(ACTIONS_DIR, f), "utf-8"))).join("\n")}
  `;

  const actionsHTML = [
    renderGroup("Ship Actions", grouped.ship),
    renderGroup("Submarine Actions", grouped.sub),
    renderGroup("Air Unit Actions", grouped.air),
    renderGroup("Miscellaneous Actions", grouped.misc),
  ].join("\n");

  const today = new Date().toISOString().slice(0, 10);

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>BWN Action & Play Aid Draft</title>
<style>
  @page { size: Letter; margin: 0.75in 0.75in 0.75in 0.75in; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
         font-size: 11pt; line-height: 1.45; color: #111; margin: 0; padding: 0; }
  .page { page-break-after: always; padding-bottom: 0.2in; }
  .page:last-child { page-break-after: auto; }
  h1 { font-size: 22pt; margin: 0 0 0.15in 0; border-bottom: 2px solid #333; padding-bottom: 6pt; }
  h2 { font-size: 15pt; margin: 18pt 0 8pt 0; color: #1a3d6b; page-break-after: avoid; }
  h3 { font-size: 13pt; margin: 14pt 0 6pt 0; color: #333; page-break-after: avoid; }
  h4 { font-size: 11pt; margin: 10pt 0 4pt 0; font-weight: 700; }
  p { margin: 6pt 0; }
  ol, ul { margin: 6pt 0 6pt 24pt; padding: 0; }
  ol li, ul li { margin-bottom: 4pt; }
  code { font-family: "SF Mono", Menlo, Consolas, monospace; background: #f1f1f1;
         padding: 1pt 4pt; border-radius: 3pt; font-size: 9.5pt; }
  pre code { display: block; padding: 8pt; }
  blockquote { margin: 8pt 0; padding: 4pt 12pt; border-left: 3pt solid #888;
               background: #fafafa; color: #444; font-style: italic; }
  table { border-collapse: collapse; margin: 8pt 0; width: 100%; }
  th, td { border: 1pt solid #888; padding: 4pt 8pt; text-align: left; font-size: 10pt; vertical-align: top; }
  th { background: #eee; }
  a { color: #1a3d6b; text-decoration: none; }
  hr { border: none; border-top: 1pt solid #ccc; margin: 12pt 0; }

  /* Title and section dividers */
  .title-page { text-align: center; padding-top: 1.5in; }
  .title-page h1 { font-size: 30pt; border: none; }
  .title-page .subtitle { font-size: 14pt; color: #666; margin-top: 12pt; }
  .title-page .meta { margin-top: 0.4in; font-size: 10pt; color: #888; }
  .section-divider { text-align: center; padding-top: 2in; page-break-before: always; }
  .divider-h1 { font-size: 28pt; border: none; }
  .divider-sub { color: #666; font-size: 12pt; }

  /* Action page meta strip */
  .meta-strip { display: flex; flex-wrap: wrap; gap: 6pt; margin: 4pt 0 8pt 0;
                font-size: 9pt; color: #555; align-items: center; }
  .meta-strip code { background: #fff; border: 1pt dashed #999; }
  .badge { display: inline-block; padding: 2pt 6pt; border-radius: 3pt;
           font-weight: 600; font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.4pt; }
  .badge.usage-action { background: #d6e4f5; color: #1a3d6b; }
  .badge.usage-active { background: #faecc6; color: #6e4a00; }
  .badge.usage-anytime { background: #e7d6f5; color: #4b1a6b; }
  .badge.cost { background: #d6f5dd; color: #1a6b35; }
  .badge.side-soviet { background: #f5d6d6; color: #6b1a1a; }
  .badge.side-nato { background: #d6e7f5; color: #1a4d6b; }
  .badge.category { background: #eee; color: #666; }
  .rule-refs { font-size: 9pt; color: #555; margin-bottom: 8pt; }

  /* PA-BLOCK placeholders — make them visually obvious and leave space to write */
  .pa-placeholder {
    margin: 10pt 0;
    padding: 14pt 12pt;
    border: 2pt dashed #b35900;
    background: #fff7ed;
    color: #663300;
    font-weight: 600;
    font-size: 10pt;
    min-height: 48pt;
    border-radius: 4pt;
  }

  /* Footer with filename so the user knows which file an edit belongs to */
  .footer-filename { margin-top: 16pt; font-size: 8pt; color: #aaa;
                     font-family: monospace; text-align: right; }

  /* TOC */
  .toc { padding-top: 0.3in; }
  .toc h1 { border-bottom: 1pt solid #ccc; }
  .toc ul { list-style: none; margin: 0; padding: 0; }
  .toc li { padding: 3pt 0; font-size: 11pt; }
  .toc .toc-group { font-weight: 700; margin-top: 10pt; padding-bottom: 2pt; border-bottom: 1pt dotted #ccc; }
</style>
</head>
<body>

<!-- Title page -->
<section class="page title-page">
  <h1>Blue Water Navy</h1>
  <div class="subtitle">Action &amp; Play Aid Draft</div>
  <div class="subtitle">for hand review and editing</div>
  <div class="meta">Generated ${today} · v4.8.5<br>Source: docs/BWN/play-aids/ + docs/BWN/actions/</div>
</section>

<!-- TOC -->
<section class="page toc">
  <h1>Contents</h1>
  <div class="toc-group">Play Aids</div>
  <ul>
    ${playAidFiles.map((f) => `<li>${f}</li>`).join("")}
  </ul>
  <div class="toc-group">Ship Actions (${grouped.ship.length})</div>
  <ul>${grouped.ship.map((f) => `<li>${f.replace(".md", "")}</li>`).join("")}</ul>
  <div class="toc-group">Submarine Actions (${grouped.sub.length})</div>
  <ul>${grouped.sub.map((f) => `<li>${f.replace(".md", "")}</li>`).join("")}</ul>
  <div class="toc-group">Air Unit Actions (${grouped.air.length})</div>
  <ul>${grouped.air.map((f) => `<li>${f.replace(".md", "")}</li>`).join("")}</ul>
  <div class="toc-group">Miscellaneous Actions (${grouped.misc.length})</div>
  <ul>${grouped.misc.map((f) => `<li>${f.replace(".md", "")}</li>`).join("")}</ul>
</section>

<!-- Play Aids section divider -->
<section class="page section-divider">
  <h1 class="divider-h1">Play Aids</h1>
  <p class="divider-sub">${playAidFiles.length} pages of transcribed play-aid content</p>
</section>

${playAidsHTML}

${actionsHTML}

</body></html>`;
}

async function main() {
  console.log("Building HTML...");
  const html = buildHTML();
  const htmlPath = OUTPUT_PATH.replace(/\.pdf$/, ".html");
  writeFileSync(htmlPath, html);
  console.log(`HTML written to ${htmlPath}`);

  console.log("Launching Chromium...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.pdf({
    path: OUTPUT_PATH,
    format: "Letter",
    printBackground: true,
    margin: { top: "0.75in", bottom: "0.75in", left: "0.75in", right: "0.75in" },
  });
  await browser.close();

  console.log(`PDF written: ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
