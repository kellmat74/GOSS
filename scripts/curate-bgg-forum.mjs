#!/usr/bin/env node
/**
 * Curate the raw BGG BWN forum scrape into tier-classified knowledge for the
 * AI Coach (Ask) system prompt.
 *
 * Input:  src/data/blue-water-navy/_fragments/bgg-bwn-raw.json
 * Output: src/data/blue-water-navy/forum-knowledge.json  (gitignored)
 *
 * Tier model:
 *   Tier 1 - Canonical: posts authored by the designer (stuuk, Stuart Tonge)
 *   Tier 2 - Endorsed: posts in a thread where the designer also posted
 *            AND the post predates a designer reply (i.e. designer engaged
 *            with it without contradicting). Also: posts the designer
 *            quoted in their own posts.
 *   Tier 3 - Community-vetted: posts with thumbs >= 3 in active threads,
 *            no contradicting designer correction in the same thread
 *   Tier 4 - Drop: everything else (questions without answers, off-topic,
 *            very low engagement)
 *
 * Each surfaced post carries: { author, isDesigner, createdAt, body, thumbs,
 * threadTitle, threadId, postUrl, tier }. We store the full body — the file
 * is gitignored, so it's not mirrored in public git history.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "src", "data", "blue-water-navy");
const INPUT = join(DATA_DIR, "_fragments", "bgg-bwn-raw.json");
const OUTPUT = join(DATA_DIR, "forum-knowledge.json");

const DESIGNER_USERS = new Set([
  "stuuk",      // Stuart Tonge — designer
  "chezhinkle", // Mathew Hinkle — credited "Designer" on BGG (developer/co-design)
]);

// Note: BGG's thumbs/recommends count was not reliably scrapeable from the
// rendered DOM (all posts came back as thumbs=0). Tier classification falls
// back to engagement signals we DID capture: post position in a designer-
// engaged thread, post body length, and presence in long threads.
const MIN_SUBSTANTIVE_BODY_LEN = 60;
const TIER3_MIN_THREAD_POSTS = 5;
const TIER3_MIN_BODY_LEN = 120;

// Drop posts that are pure social/moderation (low substance even from
// designers — e.g. "thanks for the game!", "enjoy!", etc.)
const SOCIAL_PATTERNS = [
  /^thanks?[\s,.!]/i,
  /^cheers[\s,.!]/i,
  /^enjoy/i,
  /^you'?re welcome/i,
  /no fighting in the war room/i,
];
function isSocialNoise(body) {
  if (body.length < 50 && SOCIAL_PATTERNS.some((re) => re.test(body))) return true;
  return false;
}

if (!existsSync(INPUT)) {
  console.error(`Raw scrape not found at ${INPUT}`);
  console.error('Run "node scripts/scrape-bgg-bwn.mjs" first.');
  process.exit(1);
}

const raw = JSON.parse(readFileSync(INPUT, "utf8"));

const tier1 = [];
const tier2 = [];
const tier3 = [];
let totalPosts = 0;
let droppedPosts = 0;

for (const forum of raw.forums ?? []) {
  for (const thread of forum.threads ?? []) {
    const posts = thread.posts ?? [];
    totalPosts += posts.length;

    // Designer-engaged thread?
    const designerIndices = [];
    posts.forEach((p, i) => {
      if (DESIGNER_USERS.has((p.author ?? "").toLowerCase()) || p.isDesigner) {
        designerIndices.push(i);
      }
    });
    const designerInThread = designerIndices.length > 0;
    const lastDesignerIndex = designerIndices.length
      ? designerIndices[designerIndices.length - 1]
      : -1;

    posts.forEach((p, i) => {
      const isDesignerPost =
        DESIGNER_USERS.has((p.author ?? "").toLowerCase()) || p.isDesigner;

      const base = {
        author: p.author,
        isDesigner: isDesignerPost,
        createdAt: p.createdAt ?? null,
        body: p.body,
        thumbs: p.thumbs ?? 0,
        threadTitle: thread.title,
        threadId: thread.id,
        threadUrl: thread.url,
        postUrl: p.url ?? thread.url,
        forumName: forum.name,
      };

      // Drop social/moderation noise even from designers
      if (isSocialNoise(p.body ?? "")) {
        droppedPosts++;
        return;
      }

      // Drop very short bodies regardless of author (likely "yes", "ok", etc.)
      if ((p.body ?? "").length < MIN_SUBSTANTIVE_BODY_LEN) {
        droppedPosts++;
        return;
      }

      if (isDesignerPost) {
        tier1.push({ ...base, tier: 1 });
        return;
      }

      // Tier 2: thread has a designer reply AND this post predates the LAST
      // designer post (the designer saw it and didn't contradict it).
      // Falls back from the old "thumbs >= 1" requirement since thumbs
      // weren't reliably scrapeable.
      if (designerInThread && i < lastDesignerIndex) {
        tier2.push({ ...base, tier: 2 });
        return;
      }

      // Tier 3: substantive post in an active thread without designer
      // engagement. Heuristic: long body + multi-reply thread.
      if (
        posts.length >= TIER3_MIN_THREAD_POSTS &&
        (p.body ?? "").length >= TIER3_MIN_BODY_LEN
      ) {
        tier3.push({ ...base, tier: 3 });
        return;
      }

      droppedPosts++;
    });
  }
}

// Sort each tier: newest first (most recent designer guidance wins)
const byDateDesc = (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
tier1.sort(byDateDesc);
tier2.sort(byDateDesc);
tier3.sort(byDateDesc);

const out = {
  generated: new Date().toISOString(),
  source: {
    scrapedAt: raw.scrapedAt,
    gameId: raw.gameId,
    gameName: raw.gameName,
    sourceUrl: raw.sourceUrl,
  },
  designerAllowlist: [...DESIGNER_USERS],
  stats: {
    totalPostsConsidered: totalPosts,
    droppedAsLowSignal: droppedPosts,
    tier1Count: tier1.length,
    tier2Count: tier2.length,
    tier3Count: tier3.length,
  },
  tier1,
  tier2,
  tier3,
};

writeFileSync(OUTPUT, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${OUTPUT}`);
console.log(`  Considered: ${totalPosts} posts`);
console.log(`  Tier 1 (designer):     ${tier1.length}`);
console.log(`  Tier 2 (endorsed):     ${tier2.length}`);
console.log(`  Tier 3 (community):    ${tier3.length}`);
console.log(`  Dropped (low signal):  ${droppedPosts}`);
