#!/usr/bin/env node
/**
 * Scrape Blue Water Navy forum content from BoardGameGeek.
 *
 * Runs locally only — NOT in CI. BGG made their XML API auth-walled in
 * July 2025 and their approval process is opaque/slow. This Playwright
 * script captures the same public forum content via DOM-rendered pages.
 *
 * Usage:
 *   node scripts/scrape-bgg-bwn.mjs              # full scrape, polite delays
 *   node scripts/scrape-bgg-bwn.mjs --limit=10   # cap thread count for testing
 *   node scripts/scrape-bgg-bwn.mjs --headed     # show browser window
 *
 * Output: src/data/blue-water-navy/_fragments/bgg-bwn-raw.json (gitignored)
 *   {
 *     "scrapedAt": ISO timestamp,
 *     "gameId": 158899,
 *     "gameName": "Blue Water Navy",
 *     "forums": [{ id, name, threadCount, threads: [{ id, title, url, author, createdAt, replyCount, posts: [...] }] }]
 *   }
 *
 * Etiquette:
 *   - 2-3s delay between page navigations
 *   - Identifying user-agent: battle-captain-research/1.0
 *   - Headless single browser, no parallel requests
 *   - Stops on first hard error rather than retrying aggressively
 */

import { chromium } from "playwright";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(ROOT, "src", "data", "blue-water-navy", "_fragments");
const OUTPUT_FILE = join(OUTPUT_DIR, "bgg-bwn-raw.json");

const GAME_ID = 158899;
const GAME_NAME = "Blue Water Navy";
const FORUMS_URL = `https://boardgamegeek.com/forums/thing/${GAME_ID}/blue-water-navy`;

const USER_AGENT =
  "Mozilla/5.0 (battle-captain-research/1.0; +https://rules.battle-captain.com)";

const DELAY_MS = 2500;
const NAV_TIMEOUT = 30000;
const SPA_HYDRATION_TIMEOUT = 15000;

const args = process.argv.slice(2);
const headed = args.includes("--headed");
const limitArg = args.find((a) => a.startsWith("--limit="));
const threadLimit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function log(msg) {
  const t = new Date().toISOString().slice(11, 19);
  console.log(`[${t}] ${msg}`);
}

/**
 * Wait until the SPA has hydrated and rendered something more than just the
 * shell. BGG's SPA shows a spinner / empty body until React mounts.
 */
async function waitForHydration(page, marker) {
  try {
    await page.waitForSelector(marker, { timeout: SPA_HYDRATION_TIMEOUT });
  } catch {
    // fall through — caller will check what's available
  }
}

/**
 * Extract the list of sub-forums on the game's main forum page.
 * Returns: [{ id, name, threadCount }]
 */
async function extractForumList(page) {
  await page.goto(FORUMS_URL, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
  // Forum list rendered as <a href="/forum/<id>"> entries within each forum-list section
  await waitForHydration(page, 'a[href^="/forum/"]');

  const forums = await page.evaluate(() => {
    const out = [];
    const anchors = document.querySelectorAll('a[href^="/forum/"]');
    const seen = new Set();
    for (const a of anchors) {
      const m = a.getAttribute("href").match(/^\/forum\/(\d+)/);
      if (!m) continue;
      const id = m[1];
      if (seen.has(id)) continue;
      seen.add(id);
      const name = (a.textContent ?? "").trim();
      if (!name) continue;
      // Try to find a sibling element with the thread count
      const row = a.closest("tr, li, div, article");
      let threadCount = null;
      if (row) {
        const text = row.textContent ?? "";
        const tm = text.match(/(\d[\d,]*)\s*threads?/i);
        if (tm) threadCount = parseInt(tm[1].replace(/,/g, ""), 10);
      }
      out.push({ id, name, threadCount });
    }
    return out;
  });
  return forums;
}

/**
 * Extract thread list from one sub-forum, paginating until exhausted or limit hit.
 * Returns: [{ id, title, url, author, createdAt, replyCount }]
 */
async function extractThreadList(page, forumId, limit) {
  const threads = [];
  let pageNum = 1;
  while (threads.length < limit) {
    const url = `https://boardgamegeek.com/forum/${forumId}/thing/${GAME_ID}/page/${pageNum}`;
    log(`  forum ${forumId} page ${pageNum} -> ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await waitForHydration(page, 'a[href^="/thread/"]');
    await sleep(DELAY_MS);

    const pageThreads = await page.evaluate(() => {
      const out = [];
      const anchors = document.querySelectorAll('a[href^="/thread/"]');
      const seen = new Set();
      for (const a of anchors) {
        const m = a.getAttribute("href").match(/^\/thread\/(\d+)(?:\/(.+))?/);
        if (!m) continue;
        const id = m[1];
        if (seen.has(id)) continue;
        seen.add(id);
        const title = (a.textContent ?? "").trim();
        if (!title || title.length < 3) continue;
        out.push({
          id,
          title,
          url: `https://boardgamegeek.com${a.getAttribute("href")}`,
        });
      }
      return out;
    });

    if (pageThreads.length === 0) break;
    for (const t of pageThreads) {
      if (threads.find((x) => x.id === t.id)) continue;
      threads.push(t);
      if (threads.length >= limit) break;
    }
    if (pageThreads.length < 10) break; // last page typically has fewer entries
    pageNum++;
  }
  return threads;
}

/**
 * Extract all posts in one thread. Handles pagination.
 * Returns: [{ author, isDesigner, createdAt, body, thumbs, url }]
 */
async function extractPosts(page, threadId) {
  const posts = [];
  let pageNum = 1;
  while (true) {
    const url = `https://boardgamegeek.com/thread/${threadId}/page/${pageNum}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await waitForHydration(page, "article, .article, [class*='article']");
    await sleep(DELAY_MS);

    const pagePosts = await page.evaluate(() => {
      const out = [];
      // BGG thread posts: each post is roughly in an <article> or comparable container.
      // We try several selectors to be defensive against DOM changes.
      const containers = document.querySelectorAll(
        "article, .article, .post, [class*='ThreadArticle'], [class*='thread-article']",
      );
      for (const el of containers) {
        const authorEl = el.querySelector(
          'a[href^="/user/"], [class*="username"] a, [class*="author"] a',
        );
        const author = (authorEl?.textContent ?? "").trim();
        if (!author) continue;

        const dateEl = el.querySelector('time, [datetime], [class*="postdate"]');
        const createdAt =
          dateEl?.getAttribute?.("datetime") ?? (dateEl?.textContent ?? "").trim();

        // Body is the long-form text. Strip nav/quote-headers if possible.
        const bodyEl = el.querySelector(
          '[class*="article-body"], [class*="post-body"], [class*="article_body"], .body',
        ) ?? el;
        const body = (bodyEl.textContent ?? "").trim();
        if (!body || body.length < 5) continue;

        // Thumbs/recommends count
        const thumbsEl = el.querySelector(
          '[class*="thumb"], [class*="recommend"]',
        );
        let thumbs = 0;
        if (thumbsEl) {
          const tm = (thumbsEl.textContent ?? "").match(/(\d+)/);
          if (tm) thumbs = parseInt(tm[1], 10);
        }

        // Permalink to this post if available
        const permalinkEl = el.querySelector('a[href*="/article/"]');
        const url = permalinkEl
          ? `https://boardgamegeek.com${permalinkEl.getAttribute("href")}`
          : null;

        out.push({ author, createdAt, body, thumbs, url });
      }
      return out;
    });

    if (pagePosts.length === 0) break;
    // Deduplicate posts (in case the DOM has nested containers)
    for (const p of pagePosts) {
      const key = `${p.author}::${p.createdAt}::${p.body.slice(0, 50)}`;
      if (!posts.some((x) => `${x.author}::${x.createdAt}::${x.body.slice(0, 50)}` === key)) {
        posts.push(p);
      }
    }
    if (pagePosts.length < 10) break; // last page
    pageNum++;
  }

  // Tag designer posts (Stuart Tonge's BGG username)
  for (const p of posts) {
    p.isDesigner = p.author.toLowerCase() === "stuuk";
  }
  return posts;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(async () => {
  log(`Launching Playwright (headed=${headed}, thread limit=${threadLimit})`);
  const browser = await chromium.launch({ headless: !headed });
  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();

  try {
    log(`Fetching forum list: ${FORUMS_URL}`);
    const forums = await extractForumList(page);
    log(`Discovered ${forums.length} sub-forums`);
    for (const f of forums) {
      log(`  ${f.id}  ${f.name} (${f.threadCount ?? "?"} threads)`);
    }

    const out = {
      scrapedAt: new Date().toISOString(),
      gameId: GAME_ID,
      gameName: GAME_NAME,
      sourceUrl: FORUMS_URL,
      forums: [],
    };

    for (const forum of forums) {
      await sleep(DELAY_MS);
      log(`Forum: ${forum.name}`);
      const threads = await extractThreadList(page, forum.id, threadLimit);
      log(`  ${threads.length} threads found`);

      const populatedThreads = [];
      for (const t of threads) {
        await sleep(DELAY_MS);
        log(`  Thread: ${t.title.slice(0, 60)}`);
        try {
          const posts = await extractPosts(page, t.id);
          log(`    ${posts.length} posts (${posts.filter((p) => p.isDesigner).length} designer)`);
          populatedThreads.push({ ...t, posts });
        } catch (err) {
          log(`    ERROR ${err.message}`);
          populatedThreads.push({ ...t, posts: [], error: err.message });
        }
      }
      out.forums.push({ ...forum, threads: populatedThreads });
    }

    writeFileSync(OUTPUT_FILE, JSON.stringify(out, null, 2) + "\n");
    const totalThreads = out.forums.reduce((s, f) => s + f.threads.length, 0);
    const totalPosts = out.forums.reduce(
      (s, f) => s + f.threads.reduce((s2, t) => s2 + (t.posts?.length ?? 0), 0),
      0,
    );
    log(`Done. Wrote ${OUTPUT_FILE}`);
    log(`  ${out.forums.length} forums, ${totalThreads} threads, ${totalPosts} posts`);
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
