const { chromium } = require('playwright');
const axios = require('axios');
const { isDisasterNews } = require('./llmService');
const cache = require('./cache');

const USER_AGENT = 'Mozilla/5.0 (compatible; OarfinBot/1.0; +http://www.oarfin.com)';

const CACHE_KEYS = { BBC: 'bbc_news', NDTV: 'ndtv_news', REDDIT: 'reddit_news' };
const CACHE_TTL = { BBC: 300, NDTV: 300, REDDIT: 120 };

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function launchBrowser() {
  return chromium.launch({
    headless: true,
    args: ['--disable-dev-shm-usage', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });
}

async function filterArticles(articles) {
  const filtered = [];
  for (const article of articles) {
    try {
      if ((await isDisasterNews(article)) === 'YES') {
        filtered.push(article);
      }
      await sleep(2000);
    } catch (err) {
      console.error('Error filtering article:', err.message);
    }
  }
  return filtered;
}

async function scrapeBBC() {
  const cached = cache.get(CACHE_KEYS.BBC);
  if (cached) return cached;

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto('https://bbc.com/future-planet', { waitUntil: 'domcontentloaded' });

    const articleUrls = await page.$$eval(
      'a[href*="/news/articles"]',
      (links) => links.map((l) => l.href).filter((u) => u.includes('/news/articles'))
    );

    const articles = [];
    for (const url of articleUrls) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const title = await page.title();
        const paragraphs = await page.$$eval('article p', (ps) =>
          ps.map((p) => p.textContent?.trim()).filter(Boolean)
        );
        articles.push({ url, title, content: paragraphs.join(' ') });
      } catch (err) {
        console.error(`Error scraping BBC article ${url}:`, err.message);
      }
    }

    const result = await filterArticles(articles);
    cache.set(CACHE_KEYS.BBC, result, CACHE_TTL.BBC);
    return result;
  } finally {
    await browser.close();
  }
}

async function scrapeNDTV() {
  const cached = cache.get(CACHE_KEYS.NDTV);
  if (cached) return cached;

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto('https://www.ndtv.com/world', { waitUntil: 'domcontentloaded' });

    const articleUrls = await page.$$eval(
      'a[data-tb-title]',
      (links) => links.map((l) => l.href).filter((u) => u.includes('/world-news/'))
    );

    const articles = [];
    for (const url of articleUrls) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const title = await page.title();
        const intro = page.locator('div.Art-exp_wr p');
        const paragraphs = await Promise.all(
          (await intro.all()).map((el) => el.textContent())
        );
        articles.push({ url, title, content: paragraphs.filter(Boolean).join(' ') });
      } catch (err) {
        console.error(`Error scraping NDTV article ${url}:`, err.message);
      }
    }

    const result = await filterArticles(articles);
    cache.set(CACHE_KEYS.NDTV, result, CACHE_TTL.NDTV);
    return result;
  } finally {
    await browser.close();
  }
}

async function fetchReddit() {
  const cached = cache.get(CACHE_KEYS.REDDIT);
  if (cached) return cached;

  const response = await axios.get('https://www.reddit.com/r/DisasterUpdate.json', {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    timeout: 10000,
  });

  const posts = response.data.data.children.map((post) => ({
    title: post.data.title,
    type: post.data.is_video ? 'video' : 'image',
    post_link: post.data.url,
    reddit_link: `https://reddit.com${post.data.permalink}`,
    thumbnail: post.data.thumbnail,
    created: new Date(post.data.created_utc * 1000).toISOString(),
  }));

  cache.set(CACHE_KEYS.REDDIT, posts, CACHE_TTL.REDDIT);
  return posts;
}

module.exports = { scrapeBBC, scrapeNDTV, fetchReddit };
