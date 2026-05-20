#!/usr/bin/env node
/**
 * Scrape Blue Water Navy forum content from BoardGameGeek.
 *
 * Runs locally only — NOT in CI. BGG made their XML API auth-walled in
 * July 2025 and their approval is opaque/slow. This Playwright script
 * captures public forum content via the rendered DOM.
 *
 * Robustness features (v2):
 *   - Checkpoint after EVERY thread (no data loss on crash / kill)
 *   - Resume mode: skip threads already in the checkpoint
 *   - Per-thread time budget (default 60s) — hard ceiling so one stuck
 *     thread can't hang the whole run (looking at you, "Errata thread")
 *   - Max pages per thread cap (default 20) — last-page heuristic + ceiling
 *   - Skip list for known-problematic threads
 *
 * Usage:
 *   node scripts/scrape-bgg-bwn.mjs                 # full scrape, resume if checkpoint present
 *   node scripts/scrape-bgg-bwn.mjs --fresh         # ignore checkpoint, start over
 *   node scripts/scrape-bgg-bwn.mjs --limit=10      # cap threads per forum (testing)
 *   node scripts/scrape-bgg-bwn.mjs --forums=66,67  # only specific forum ids
 *   node scripts/scrape-bgg-bwn.mjs --headed        # show browser window
 *   node scripts/scrape-bgg-bwn.mjs --skip=2264044  # comma-separated thread ids to skip
 *
 * Output: src/data/blue-water-navy/_fragments/bgg-bwn-raw.json (gitignored)
 */

import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(ROOT, "src", "data", "blue-water-navy", "_fragments");
const OUTPUT_FILE = join(OUTPUT_DIR, "bgg-bwn-raw.json");

const GAME_ID = 220508;
const GAME_SLUG = "blue-water-navy-the-war-at-sea";
const GAME_NAME = "Blue Water Navy: The War at Sea";
const BASE = `https://boardgamegeek.com/boardgame/${GAME_ID}/${GAME_SLUG}`;

const FORUM_PRIORITY = [
  { id: 66,  name: "Rules" },
  { id: 67,  name: "Strategy" },
  { id: 64,  name: "Sessions" },
  { id: 65,  name: "General" },
  { id: 69,  name: "Variants" },
  { id: 68,  name: "News" },
  { id: 194, name: "Play By Forum" },
  { id: 63,  name: "Reviews" },
];

const DESIGNER_USERS = new Set(["stuuk", "chezhinkle"]);

const USER_AGENT =
  "Mozilla/5.0 (battle-captain-research/1.0; +https://rules.battle-captain.com)";

const DELAY_MS = 2500;
const NAV_TIMEOUT = 30000;
const HYDRATION_WAIT_MS = 8000;
const MAX_PAGES_PER_THREAD = 20;
const THREAD_TIME_BUDGET_MS = 90_000; // 90s hard ceiling per thread

// --- CLI ---
const args = process.argv.slice(2);
const headed = args.includes("--headed");
const fresh = args.includes("--fresh");
const limitArg = args.find((a) => a.startsWith("--limit="));
const threadLimit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;
const forumsArg = args.find((a) => a.startsWith("--forums="));
const onlyForumIds = forumsArg
  ? new Set(forumsArg.split("=")[1].split(",").map((s) => parseInt(s, 10)))
  : null;
const skipArg = args.find((a) => a.startsWith("--skip="));
const userSkipIds = new Set(
  skipArg ? skipArg.split("=")[1].split(",").map((s) => s.trim()) : [],
);

const activeForums = onlyForumIds
  ? FORUM_PRIORITY.filter((f) => onlyForumIds.has(f.id))
  : FORUM_PRIORITY;

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (msg) => {
  const t = new Date().toISOString().slice(11, 19);
  console.log(`[${t}] ${msg}`);
};

// ---------------------------------------------------------------------------
// Checkpoint state — written to OUTPUT_FILE after EVERY thread
// ---------------------------------------------------------------------------

function loadCheckpoint() {
  if (!fresh && existsSync(OUTPUT_FILE)) {
    try {
      const data = JSON.parse(readFileSync(OUTPUT_FILE, "utf8"));
      // Migrate older checkpoints (missing fields are filled in)
      if (data.gameId === GAME_ID && Array.isArray(data.forums)) {
        log(`Loaded checkpoint with ${data.forums.length} forums already scraped`);
        return data;
      }
    } catch (err) {
      log(`Could not parse existing ${OUTPUT_FILE}: ${err.message}. Starting fresh.`);
    }
  }
  return {
    scrapedAt: new Date().toISOString(),
    gameId: GAME_ID,
    gameSlug: GAME_SLUG,
    gameName: GAME_NAME,
    sourceUrl: BASE,
    designerAllowlist: [...DESIGNER_USERS],
    forums: [],
  };
}

function saveCheckpoint(state) {
  state.scrapedAt = new Date().toISOString();
  writeFileSync(OUTPUT_FILE, JSON.stringify(state, null, 2) + "\n");
}

/** Track which thread ids we've already captured (across all forums). */
function buildScrapedThreadSet(state) {
  const set = new Set();
  for (const f of state.forums ?? []) {
    for (const t of f.threads ?? []) {
      if (t.posts && t.posts.length > 0) set.add(t.id);
      else if (t.skipped) set.add(t.id);
    }
  }
  return set;
}

// ---------------------------------------------------------------------------
// SPA helpers
// ---------------------------------------------------------------------------

async function waitForHydration(page) {
  await page.waitForTimeout(HYDRATION_WAIT_MS);
}

/** Run a function with a hard timeout. Throws on exceed. */
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${label}: timeout after ${ms}ms`)), ms),
    ),
  ]);
}

// ---------------------------------------------------------------------------
// Thread list extraction
// ---------------------------------------------------------------------------

async function extractThreadList(page, forumId, name, limit) {
  const threads = [];
  let pageNum = 1;
  while (threads.length < limit) {
    const url = `${BASE}/forums/${forumId}?pageid=${pageNum}`;
    log(`  ${name} page ${pageNum} -> ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await waitForHydration(page);

    const pageThreads = await page.evaluate(() => {
      const byId = new Map();
      const dehyphenate = (s) =>
        s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      for (const a of document.querySelectorAll('a[href^="/thread/"]')) {
        const m = a.getAttribute("href").match(/^\/thread\/(\d+)(?:\/([^?#]*))?/);
        if (!m) continue;
        const id = m[1];
        const slug = m[2] ?? "";
        const text = (a.textContent ?? "").trim();
        if (/new post/i.test(text)) continue;
        const existing = byId.get(id);
        const titleLike =
          /[A-Za-z]/.test(text) && text.length >= 3 && !/^[\s\d.]+$/.test(text);
        if (titleLike && (!existing || text.length > (existing.title ?? "").length)) {
          byId.set(id, { id, slug, title: text.slice(0, 200) });
        } else if (!existing) {
          byId.set(id, { id, slug, title: "" });
        }
      }

      const out = [];
      for (const entry of byId.values()) {
        if (!entry.title && entry.slug) entry.title = dehyphenate(entry.slug);
        if (!entry.title) continue;
        out.push(entry);
      }
      return out;
    });

    log(`    ${pageThreads.length} threads on page`);
    if (pageThreads.length === 0) break;
    let addedThisPage = 0;
    for (const t of pageThreads) {
      if (threads.find((x) => x.id === t.id)) continue;
      threads.push({ ...t, url: `https://boardgamegeek.com/thread/${t.id}/${t.slug}` });
      addedThisPage++;
      if (threads.length >= limit) break;
    }
    if (addedThisPage === 0) break;
    if (pageThreads.length < 25) break;
    pageNum++;
    await sleep(DELAY_MS);
  }
  return threads;
}

// ---------------------------------------------------------------------------
// Post extraction (with per-thread time budget + max-pages cap)
// ---------------------------------------------------------------------------

async function extractPosts(page, threadId, threadSlug) {
  const posts = [];
  const startTime = Date.now();
  let pageNum = 1;
  let stopReason = null;

  while (pageNum <= MAX_PAGES_PER_THREAD) {
    if (Date.now() - startTime > THREAD_TIME_BUDGET_MS) {
      stopReason = `time-budget(${THREAD_TIME_BUDGET_MS}ms)`;
      break;
    }
    const url = `https://boardgamegeek.com/thread/${threadId}/${threadSlug}?pageid=${pageNum}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await waitForHydration(page);

    const pagePosts = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll("article.post")) {
        let author = "";
        const handleMatch = (el.textContent ?? "").match(/@([A-Za-z0-9_-]{2,32})\b/);
        if (handleMatch) author = handleMatch[1];
        if (!author) continue;

        let createdAt = null;
        const dateEl = el.querySelector("time, [class*='date'], [class*='time']");
        if (dateEl) {
          createdAt =
            dateEl.getAttribute("datetime") ?? (dateEl.textContent ?? "").trim();
        }

        let body = "";
        const bodyEl = el.querySelector(
          "[class*='article-body'], [class*='post-body'], .post-content, .body",
        );
        if (bodyEl) {
          body = (bodyEl.textContent ?? "").trim();
        } else {
          const clone = el.cloneNode(true);
          for (const s of clone.querySelectorAll(
            "gg-avatar-responsive, gg-avatar-image-dumb, gg-user-microbadge-set, gg-microbadge, button, .btn, [class*='avatar'], [class*='microbadge'], [class*='badge'], svg",
          )) {
            s.remove();
          }
          body = (clone.textContent ?? "").trim().replace(/\s+/g, " ");
        }
        if (!body || body.length < 5) continue;

        let thumbs = 0;
        const thumbsEl = el.querySelector("[class*='thumbs'], [class*='recommend']");
        if (thumbsEl) {
          const tm = (thumbsEl.textContent ?? "").match(/(\d+)/);
          if (tm) thumbs = parseInt(tm[1], 10);
        }

        const permalinkEl = el.querySelector('a[href*="/article/"]');
        const postUrl = permalinkEl
          ? `https://boardgamegeek.com${permalinkEl.getAttribute("href")}`
          : null;

        out.push({ author, createdAt, body, thumbs, url: postUrl });
      }
      return out;
    });

    if (pagePosts.length === 0) {
      stopReason = "empty-page";
      break;
    }
    let addedThisPage = 0;
    for (const p of pagePosts) {
      const key = `${p.author}::${p.createdAt}::${p.body.slice(0, 60)}`;
      if (!posts.some((x) => `${x.author}::${x.createdAt}::${x.body.slice(0, 60)}` === key)) {
        posts.push(p);
        addedThisPage++;
      }
    }
    if (addedThisPage === 0 || pagePosts.length < 25) {
      stopReason = pagePosts.length < 25 ? "last-page" : "no-new-posts";
      break;
    }
    pageNum++;
    await sleep(DELAY_MS);
  }
  if (!stopReason) stopReason = `max-pages(${MAX_PAGES_PER_THREAD})`;

  for (const p of posts) {
    p.isDesigner = DESIGNER_USERS.has((p.author ?? "").toLowerCase());
  }
  return { posts, pagesScraped: Math.min(pageNum, MAX_PAGES_PER_THREAD), stopReason };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(async () => {
  log(`Launching Playwright (headed=${headed}, thread limit=${threadLimit}, fresh=${fresh})`);
  log(`Targeting forums: ${activeForums.map((f) => `${f.id}=${f.name}`).join(", ")}`);

  const state = loadCheckpoint();
  const alreadyScraped = buildScrapedThreadSet(state);
  if (alreadyScraped.size > 0) {
    log(`Resume: ${alreadyScraped.size} threads already in checkpoint`);
  }
  if (userSkipIds.size > 0) {
    log(`User skip-list: ${[...userSkipIds].join(", ")}`);
  }

  const browser = await chromium.launch({ headless: !headed });
  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();

  // Track stats for the current run
  let runThreads = 0;
  let runPosts = 0;
  let runDesigner = 0;
  let runSkipped = 0;

  try {
    for (const forum of activeForums) {
      // Find or create the forum entry in state
      let forumEntry = state.forums.find((f) => f.id === forum.id);
      if (!forumEntry) {
        forumEntry = { id: forum.id, name: forum.name, threads: [] };
        state.forums.push(forumEntry);
      }

      log(`Forum: ${forum.name} (id ${forum.id})`);
      let threads = [];
      try {
        threads = await extractThreadList(page, forum.id, forum.name, threadLimit);
      } catch (err) {
        log(`  ERROR enumerating ${forum.name}: ${err.message}`);
        saveCheckpoint(state);
        continue;
      }
      log(`  ${threads.length} threads found in ${forum.name}`);

      for (const t of threads) {
        if (alreadyScraped.has(t.id)) continue;
        if (userSkipIds.has(t.id)) {
          log(`  SKIP (user): ${t.title.slice(0, 60)} (#${t.id})`);
          forumEntry.threads.push({ ...t, posts: [], skipped: "user" });
          runSkipped++;
          saveCheckpoint(state);
          continue;
        }

        await sleep(DELAY_MS);
        log(`  Thread: ${t.title.slice(0, 65)} (#${t.id})`);

        let result;
        try {
          result = await withTimeout(
            extractPosts(page, t.id, t.slug),
            THREAD_TIME_BUDGET_MS + 30_000,
            `extractPosts(${t.id})`,
          );
        } catch (err) {
          log(`    ERROR: ${err.message}`);
          forumEntry.threads.push({ ...t, posts: [], error: err.message });
          saveCheckpoint(state);
          continue;
        }

        const dCount = result.posts.filter((p) => p.isDesigner).length;
        log(`    ${result.posts.length} posts (${dCount} designer) [${result.stopReason}]`);
        forumEntry.threads.push({
          ...t,
          posts: result.posts,
          pagesScraped: result.pagesScraped,
          stopReason: result.stopReason,
        });
        runThreads++;
        runPosts += result.posts.length;
        runDesigner += dCount;

        // Checkpoint after EVERY thread — never lose work to a hang
        saveCheckpoint(state);
      }
    }

    log(`Done. Wrote ${OUTPUT_FILE}`);
    log(`  This run: ${runThreads} threads, ${runPosts} posts (${runDesigner} designer), ${runSkipped} skipped`);
    const totalThreads = state.forums.reduce((s, f) => s + f.threads.length, 0);
    const totalPosts = state.forums.reduce(
      (s, f) => s + f.threads.reduce((s2, t) => s2 + (t.posts?.length ?? 0), 0),
      0,
    );
    const totalDesigner = state.forums.reduce(
      (s, f) =>
        s +
        f.threads.reduce(
          (s2, t) => s2 + (t.posts?.filter((p) => p.isDesigner).length ?? 0),
          0,
        ),
      0,
    );
    log(`  Checkpoint total: ${totalThreads} threads, ${totalPosts} posts (${totalDesigner} designer)`);
  } catch (err) {
    // Save whatever we have before re-throwing
    saveCheckpoint(state);
    log(`UNCAUGHT ERROR (checkpoint saved): ${err.message}`);
    throw err;
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
