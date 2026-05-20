#!/usr/bin/env node
/**
 * Scrape Blue Water Navy forum content from BoardGameGeek.
 *
 * Runs locally only — NOT in CI. BGG made their XML API auth-walled in
 * July 2025 and their approval is opaque/slow. This Playwright script
 * captures public forum content via the rendered DOM.
 *
 * Usage:
 *   node scripts/scrape-bgg-bwn.mjs                 # full scrape (Rules forum primary)
 *   node scripts/scrape-bgg-bwn.mjs --limit=10      # cap threads per forum (testing)
 *   node scripts/scrape-bgg-bwn.mjs --forums=66,67  # only specific forum ids
 *   node scripts/scrape-bgg-bwn.mjs --headed        # show browser window
 *
 * Output: src/data/blue-water-navy/_fragments/bgg-bwn-raw.json (gitignored)
 */

import { chromium } from "playwright";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(ROOT, "src", "data", "blue-water-navy", "_fragments");
const OUTPUT_FILE = join(OUTPUT_DIR, "bgg-bwn-raw.json");

// BoardGameGeek "Blue Water Navy: The War at Sea" (2019).
// Site uses /boardgame/<id>/<slug>/forums/<sub_id> URL pattern.
const GAME_ID = 220508;
const GAME_SLUG = "blue-water-navy-the-war-at-sea";
const GAME_NAME = "Blue Water Navy: The War at Sea";
const BASE = `https://boardgamegeek.com/boardgame/${GAME_ID}/${GAME_SLUG}`;

// Forum sub-IDs discovered by probing the BGG forum list. Ordered by
// pedagogical priority (Rules first, then Strategy, then Sessions/General).
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

// BGG usernames recognised as designer/dev for Tier 1 elevation.
const DESIGNER_USERS = new Set([
  "stuuk",      // Stuart Tonge — designer
  "chezhinkle", // Mathew Hinkle — credited "Designer" on BGG (developer/co-design)
]);

const USER_AGENT =
  "Mozilla/5.0 (battle-captain-research/1.0; +https://rules.battle-captain.com)";

const DELAY_MS = 2500;
const NAV_TIMEOUT = 30000;
const HYDRATION_WAIT_MS = 8000;

// --- CLI ---
const args = process.argv.slice(2);
const headed = args.includes("--headed");
const limitArg = args.find((a) => a.startsWith("--limit="));
const threadLimit = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;
const forumsArg = args.find((a) => a.startsWith("--forums="));
const onlyForumIds = forumsArg
  ? new Set(forumsArg.split("=")[1].split(",").map((s) => parseInt(s, 10)))
  : null;

const activeForums = onlyForumIds
  ? FORUM_PRIORITY.filter((f) => onlyForumIds.has(f.id))
  : FORUM_PRIORITY;

if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (msg) => {
  const t = new Date().toISOString().slice(11, 19);
  console.log(`[${t}] ${msg}`);
};

/** Wait for SPA hydration (Angular fills body after JS runs). */
async function waitForHydration(page) {
  await page.waitForTimeout(HYDRATION_WAIT_MS);
}

/**
 * Extract the thread list from one sub-forum, paginating until exhausted or
 * the per-forum limit is hit. Returns: [{ id, slug, title }]
 */
async function extractThreadList(page, forumId, name, limit) {
  const threads = [];
  let pageNum = 1;
  while (threads.length < limit) {
    const url = `${BASE}/forums/${forumId}?pageid=${pageNum}`;
    log(`  ${name} page ${pageNum} -> ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await waitForHydration(page);

    const pageThreads = await page.evaluate(() => {
      // Each thread row contains multiple anchors to /thread/<id>: the title,
      // the reply count (text is digits + whitespace), and avatars. We keep
      // the LONGEST sensible text per thread id, which is reliably the title.
      const byId = new Map(); // id -> { id, slug, title }
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
        // Heuristic for "title-like" text: contains a letter and has 3+ chars.
        const titleLike = /[A-Za-z]/.test(text) && text.length >= 3 && !/^[\s\d.]+$/.test(text);
        if (titleLike && (!existing || text.length > (existing.title ?? "").length)) {
          byId.set(id, { id, slug, title: text.slice(0, 200) });
        } else if (!existing) {
          // Placeholder — will be replaced if a better anchor comes along
          byId.set(id, { id, slug, title: "" });
        }
      }

      // Fallback: if no title was found for a thread, derive from slug.
      const out = [];
      for (const entry of byId.values()) {
        if (!entry.title && entry.slug) {
          entry.title = dehyphenate(entry.slug);
        }
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
    if (addedThisPage === 0) break;     // we're seeing only repeats — done
    if (pageThreads.length < 25) break; // typical last-page heuristic
    pageNum++;
    await sleep(DELAY_MS);
  }
  return threads;
}

/**
 * Extract all posts in one thread. BGG paginates very long threads via
 * `?pageid=N`. Returns: [{ author, isDesigner, createdAt, body, thumbs, url }]
 */
async function extractPosts(page, threadId, threadSlug) {
  const posts = [];
  let pageNum = 1;
  while (true) {
    const url = `https://boardgamegeek.com/thread/${threadId}/${threadSlug}?pageid=${pageNum}`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT });
    await waitForHydration(page);

    const pagePosts = await page.evaluate(() => {
      const out = [];
      const articles = document.querySelectorAll("article.post");
      for (const el of articles) {
        // Author: find the @handle (text node starts with @). BGG renders
        // multiple forms — full name + "@username" microbadge. Username is
        // the canonical identifier for tier classification.
        let author = "";
        const handleMatch = (el.textContent ?? "").match(/@([A-Za-z0-9_-]{2,32})\b/);
        if (handleMatch) author = handleMatch[1];
        if (!author) continue;

        // Date: look for any element with a Full Date hover label or short date text
        let createdAt = null;
        const dateEl = el.querySelector("time, [class*='date'], [class*='time']");
        if (dateEl) {
          createdAt = dateEl.getAttribute("datetime") ?? (dateEl.textContent ?? "").trim();
        }

        // Body: try to find the article body container. BGG uses a child
        // div with rich content. Fallback to the article's text minus
        // controls / chrome.
        let body = "";
        const bodyEl = el.querySelector("[class*='article-body'], [class*='post-body'], .post-content, .body");
        if (bodyEl) {
          body = (bodyEl.textContent ?? "").trim();
        } else {
          // Strip the user actions menu, microbadges, thumbs UI from the article
          const clone = el.cloneNode(true);
          for (const s of clone.querySelectorAll(
            "gg-avatar-responsive, gg-avatar-image-dumb, gg-user-microbadge-set, gg-microbadge, button, .btn, [class*='avatar'], [class*='microbadge'], [class*='badge'], svg",
          )) {
            s.remove();
          }
          body = (clone.textContent ?? "").trim().replace(/\s+/g, " ");
        }
        if (!body || body.length < 5) continue;

        // Thumbs / recommends count
        let thumbs = 0;
        const thumbsEl = el.querySelector("[class*='thumbs'], [class*='recommend']");
        if (thumbsEl) {
          const tm = (thumbsEl.textContent ?? "").match(/(\d+)/);
          if (tm) thumbs = parseInt(tm[1], 10);
        }

        // Permalink to this post if available
        const permalinkEl = el.querySelector('a[href*="/article/"]');
        const postUrl = permalinkEl
          ? `https://boardgamegeek.com${permalinkEl.getAttribute("href")}`
          : null;

        out.push({ author, createdAt, body, thumbs, url: postUrl });
      }
      return out;
    });

    if (pagePosts.length === 0) break;
    for (const p of pagePosts) {
      const key = `${p.author}::${p.createdAt}::${p.body.slice(0, 60)}`;
      if (!posts.some((x) => `${x.author}::${x.createdAt}::${x.body.slice(0, 60)}` === key)) {
        posts.push(p);
      }
    }
    if (pagePosts.length < 25) break;
    pageNum++;
    await sleep(DELAY_MS);
  }

  for (const p of posts) {
    p.isDesigner = DESIGNER_USERS.has((p.author ?? "").toLowerCase());
  }
  return posts;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(async () => {
  log(`Launching Playwright (headed=${headed}, thread limit=${threadLimit})`);
  log(`Targeting forums: ${activeForums.map((f) => `${f.id}=${f.name}`).join(", ")}`);
  const browser = await chromium.launch({ headless: !headed });
  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();

  const out = {
    scrapedAt: new Date().toISOString(),
    gameId: GAME_ID,
    gameSlug: GAME_SLUG,
    gameName: GAME_NAME,
    sourceUrl: BASE,
    designerAllowlist: [...DESIGNER_USERS],
    forums: [],
  };

  try {
    for (const forum of activeForums) {
      await sleep(DELAY_MS);
      log(`Forum: ${forum.name} (id ${forum.id})`);
      const threads = await extractThreadList(page, forum.id, forum.name, threadLimit);
      log(`  ${threads.length} threads found in ${forum.name}`);

      const populatedThreads = [];
      for (const t of threads) {
        await sleep(DELAY_MS);
        log(`  Thread: ${t.title.slice(0, 65)}`);
        try {
          const posts = await extractPosts(page, t.id, t.slug);
          const dCount = posts.filter((p) => p.isDesigner).length;
          log(`    ${posts.length} posts (${dCount} designer)`);
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
    const designerPosts = out.forums.reduce(
      (s, f) => s + f.threads.reduce(
        (s2, t) => s2 + (t.posts?.filter((p) => p.isDesigner).length ?? 0),
        0,
      ),
      0,
    );
    log(`Done. Wrote ${OUTPUT_FILE}`);
    log(`  ${out.forums.length} forums, ${totalThreads} threads, ${totalPosts} posts (${designerPosts} designer)`);
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
