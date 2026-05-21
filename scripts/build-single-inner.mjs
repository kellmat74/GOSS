#!/usr/bin/env node
/**
 * Inner build steps for the offline single-file artifact. Invoked by
 * `strip-forum-for-singlefile.mjs`, which has already swapped the forum
 * knowledge file for the empty placeholder so user posts aren't bundled
 * into the shareable HTML.
 */

import { spawnSync } from "node:child_process";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = dirname(__dirname);

const steps = [
  ["node", ["scripts/ensure-forum-knowledge.mjs"]],
  ["npx", ["tsc", "-b"]],
  [
    "npx",
    [
      "vite",
      "build",
      "--config",
      "vite.singlefile.config.ts",
      "--outDir",
      "dist-single",
    ],
  ],
  ["node", ["scripts/inline-offline-assets.mjs"]],
];

for (const [cmd, args] of steps) {
  console.log(`\n$ ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, { stdio: "inherit", cwd: REPO, shell: false });
  if (result.error) {
    console.error(`Failed: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
