#!/usr/bin/env node
/**
 * Build-time wrapper for the offline single-file build: temporarily swap the
 * locally-populated `forum-knowledge.json` for the empty `forum-knowledge.placeholder.json`
 * so the resulting `battle-captain.html` does not bundle ~3 MB of mirrored
 * BGG forum content. Restore the real file afterwards regardless of success.
 *
 * Why strip:
 *   - The offline HTML is a shareable single-file artifact. Bundling 1,257
 *     designer posts + 2,057 endorsed community posts verbatim turns the file
 *     into a public mirror of BGG forum content — bad posture.
 *   - The Ask tab can't work offline anyway (it calls the Cloudflare worker),
 *     so the forum corpus has no functional value in the offline build.
 *   - The "BGG Hive Mind" Rules-tab section's URL clicks need internet to
 *     reach BGG, so showing snippet-only offline is marginal value at best.
 *
 * Usage: this script wraps a child command. E.g.:
 *   node scripts/strip-forum-for-singlefile.mjs -- npm run build:single:inner
 */

import { copyFileSync, existsSync, renameSync, unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "src", "data", "blue-water-navy");
const TARGET = join(DATA_DIR, "forum-knowledge.json");
const BACKUP = join(DATA_DIR, "forum-knowledge.json.local-backup");
const PLACEHOLDER = join(DATA_DIR, "forum-knowledge.placeholder.json");

// Parse `-- <cmd> <args...>` style invocation
const argv = process.argv.slice(2);
const sep = argv.indexOf("--");
if (sep === -1 || sep === argv.length - 1) {
  console.error("Usage: node scripts/strip-forum-for-singlefile.mjs -- <command> [args...]");
  process.exit(2);
}
const [cmd, ...cmdArgs] = argv.slice(sep + 1);

let stashed = false;
try {
  if (existsSync(TARGET)) {
    if (existsSync(BACKUP)) {
      console.warn(
        `strip-forum-for-singlefile: existing backup at ${BACKUP} — leaving as-is`,
      );
    } else {
      renameSync(TARGET, BACKUP);
      stashed = true;
      console.log(`strip-forum-for-singlefile: stashed local data -> ${BACKUP}`);
    }
  }
  if (existsSync(PLACEHOLDER)) {
    copyFileSync(PLACEHOLDER, TARGET);
    console.log(`strip-forum-for-singlefile: placeholder in place at ${TARGET}`);
  }

  const result = spawnSync(cmd, cmdArgs, { stdio: "inherit", shell: false });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 0;
} finally {
  // Always restore the user's local data, even if the inner command failed
  if (stashed && existsSync(BACKUP)) {
    if (existsSync(TARGET)) unlinkSync(TARGET);
    renameSync(BACKUP, TARGET);
    console.log(`strip-forum-for-singlefile: restored local data from backup`);
  }
}
