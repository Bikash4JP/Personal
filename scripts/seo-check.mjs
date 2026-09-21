#!/usr/bin/env node
// SEO sanity checks for this static site. No dependencies: `node scripts/seo-check.mjs`
//   --live   also request the production URLs (run this after a deploy)
// Exits non-zero if any check fails. Warnings never fail the run.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://bikash4jp.com';
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const exists = (f) => fs.existsSync(path.join(ROOT, f));

let failed = 0;
const ok = (msg) => console.log(`  PASS  ${msg}`);
const warn = (msg) => console.log(`  WARN  ${msg}`);
const check = (cond, msg) => { if (cond) ok(msg); else { failed++; console.log(`  FAIL  ${msg}`); } };
const section = (t) => console.log(`\n${t}`);

const html = read('index.html');
const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}=("([^"]*)"|'([^']*)')`, 'i')) || [])[2] ?? undefined;
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const metaContent = (key, val) => {
  const tag = (html.match(/<meta\b[^>]*>/gi) || []).find((t) => attr(t, key) === val);
  return tag ? attr(tag, 'content') : undefined;
};

section('Head metadata (index.html)');
const titles = html.match(/<title>([\s\S]*?)<\/title>/gi) || [];
check(titles.length === 1, 'exactly one <title>');
const title = (titles[0] || '').replace(/<\/?title>/gi, '').trim();
check(title.length >= 10 && title.length <= 65, `title length ${title.length} (10-65): "${title}"`);
const desc = metaContent('name', 'description') || '';
check(desc.length >= 70 && desc.length <= 165, `meta description length ${desc.length} (70-165)`);
const canon = (html.match(/<link\b[^>]*rel="canonical"[^>]*>/i) || [''])[0];
check(attr(canon, 'href') === `${ORIGIN}/`, `canonical is ${ORIGIN}/`);
check(/<html[^>]*\slang="en"/.test(html), '<html lang="en"> present');
const robots = metaContent('name', 'robots') || '';
check(!/noindex|nofollow|none/i.test(robots), `robots meta has no noindex/nofollow ("${robots}")`);
for (const p of ['og:type', 'og:url', 'og:title', 'og:description', 'og:image', 'og:image:alt']) check(!!metaContent('property', p), `${p} present`);
for (const n of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) check(!!metaContent('name', n), `${n} present`);
check(metaContent('property', 'og:url') === `${ORIGIN}/`, 'og:url matches canonical');
check(metaContent('property', 'og:title') === title, 'og:title matches <title>');
const og = metaContent('property', 'og:image') || '';
check(og.startsWith(`${ORIGIN}/`) && exists(og.slice(ORIGIN.length + 1)), `og:image is absolute and the file exists (${og})`);
check(!/rel="icon"[^>]*href="data:/i.test(html), 'no data: URI favicon (Google cannot use it)');
for (const l of html.match(/<link\b[^>]*rel="(?:icon|apple-touch-icon)"[^>]*>/gi) || []) {
  const href = attr(l, 'href');
  check(!!href && exists(href.replace(/^\//, '')), `icon file exists: ${href}`);
}

section('Structure and accessibility');
check((html.match(/<h1[\s>]/gi) || []).length === 1, 'exactly one <h1>');
const imgs = html.match(/<img\b[^>]*>/gi) || [];
check(imgs.every((t) => attr(t, 'alt') !== undefined), `all ${imgs.length} <img> have an alt attribute`);
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
check(new Set(ids).size === ids.length, 'element ids are unique');
const frags = [...new Set([...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]))];
check(frags.every((f) => ids.includes(f)), `all ${frags.length} in-page #links point at an existing id`);
const labelled = [...html.matchAll(/aria-labelledby="([^"]+)"/g)].map((m) => m[1]);
check(labelled.every((f) => ids.includes(f)), 'aria-labelledby targets exist');

section('Local file references');
const refs = [...html.matchAll(/\s(?:href|src|poster|data-src-jp|data-poster-jp)="([^"]+)"/g)].map((m) => m[1])
  .filter((u) => !/^(https?:|mailto:|data:|#)/.test(u) && !/^<|^%/.test(u));
const missing = [...new Set(refs)].filter((u) => !exists(u.split(/[?#]/)[0].replace(/^\//, '') || 'index.html'));
check(missing.length === 0, `all ${new Set(refs).size} local href/src targets exist${missing.length ? ': missing ' + missing.join(', ') : ''}`);
const external = [...html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)].filter((m) => !/noopener/.test(m[0]));
check(external.length === 0, 'every target="_blank" link has rel="noopener"');

section('Static HTML text matches the English text (what non-JS crawlers see)');
let bad = 0;
for (const m of html.matchAll(/<(\w+)\b([^>]*?)\sdata-en="([^"]*)"([^>]*)>([\s\S]*?)<\/\1>/g)) {
  if (!/data-jp=/.test(m[0])) continue;
  const en = decode(m[3]).replace(/\s+/g, ' ').trim();
  const inner = decode(m[5].replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
  if (en !== inner) { bad++; console.log(`        mismatch: data-en="${en.slice(0, 60)}" vs static="${inner.slice(0, 60)}"`); }
}
check(bad === 0, 'no data-en / static text mismatches');

section('JSON-LD');
const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
check(blocks.length === 1, 'exactly one JSON-LD block (no duplicates)');
let graph = [];
try { graph = JSON.parse(blocks[0])['@graph']; ok(`JSON-LD parses (${graph.length} nodes: ${graph.map((n) => n['@type']).join(', ')})`); }
catch (e) { check(false, `JSON-LD parses: ${e.message}`); }
const nodeIds = new Set(graph.map((n) => n['@id']));
const refIds = [];
(function walk(v, top) {
  if (Array.isArray(v)) v.forEach((x) => walk(x));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (k === '@id' && !top) refIds.push(x); else walk(x); }
})(graph.map((n) => Object.fromEntries(Object.entries(n).filter(([k]) => k !== '@id'))));
check(refIds.every((r) => nodeIds.has(r)), `every {"@id"} reference resolves inside the graph (${refIds.length} refs)`);
check(new Set([...nodeIds]).size === graph.length && [...nodeIds].every((i) => i && i.startsWith(`${ORIGIN}/`)), 'node @ids are unique canonical URLs');
const person = graph.find((n) => n['@type'] === 'Person');
check(person && person.name === 'Bikash Thapa' && (person.sameAs || []).every((u) => html.includes(`href="${u}"`)), 'Person.sameAs URLs are all linked from the visible page');
check(!/aggregateRating|"review"|hasCredential|award/.test(blocks[0] || ''), 'no ratings/reviews/credentials/awards claimed in JSON-LD');
const anchorIds = graph.map((n) => n['@id']).filter((i) => i.includes('#') && !/#(website|profilepage|person)$/.test(i));
check(anchorIds.every((i) => ids.includes(i.split('#')[1])), 'project @ids map to real element ids on the page');

section('robots.txt, sitemap.xml, 404.html');
const rb = read('robots.txt');
check(new RegExp(`^Sitemap:\\s*${ORIGIN}/sitemap\\.xml\\s*$`, 'm').test(rb), 'robots.txt declares the sitemap');
check(!/^\s*Disallow:\s*\/\s*$/m.test(rb) && !/Disallow:.*(assets|\.css|\.js)/i.test(rb), 'robots.txt does not block the site, CSS, JS or assets');
const sm = read('sitemap.xml');
check(/^<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">[\s\S]*<\/urlset>\s*$/.test(sm), 'sitemap has XML declaration and urlset namespace');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
check(locs.length > 0 && new Set(locs).size === locs.length, `sitemap has ${locs.length} unique <loc>`);
check(locs.every((l) => l.startsWith(`${ORIGIN}/`) && !/[?#]/.test(l)), 'sitemap URLs are canonical https, no query or fragment');
check(locs.every((l) => exists(l.slice(ORIGIN.length + 1) || 'index.html')), 'every sitemap URL maps to a file in the repo');
check(locs.includes(attr(canon, 'href')), 'sitemap contains the canonical homepage URL');
check(/name="robots" content="noindex"/.test(read('404.html')), '404.html is noindex');

if (process.argv.includes('--live')) {
  section(`Live checks against ${ORIGIN}`);
  const get = async (p, o = {}) => { try { return await fetch(ORIGIN + p, { redirect: 'manual', ...o }); } catch (e) { return { status: 0, headers: new Headers(), text: async () => String(e) }; } };
  const home = await get('/');
  check(home.status === 200, `GET / -> ${home.status}`);
  const body = home.status === 200 ? await home.text() : '';
  check(body.includes(`<link rel="canonical" href="${ORIGIN}/">`), 'live homepage HTML contains the canonical tag');
  check(body.includes('application/ld+json'), 'live homepage HTML contains JSON-LD');
  check(!body.includes('__BUILD__'), 'no unreplaced __BUILD__ placeholder in live HTML');
  const r = await get('/robots.txt'); check(r.status === 200 && /^text\/plain/.test(r.headers.get('content-type') || ''), `GET /robots.txt -> ${r.status} ${r.headers.get('content-type')}`);
  const s = await get('/sitemap.xml'); check(s.status === 200 && /xml/.test(s.headers.get('content-type') || ''), `GET /sitemap.xml -> ${s.status} ${s.headers.get('content-type')}`);
  const nf = await get('/__seo-check-missing-page__'); (nf.status === 404 ? ok : warn)(`missing page -> ${nf.status} (should be 404; a 403 means the CloudFront error-page step in docs is not done yet)`);
  for (const u of locs) { const x = await get(new URL(u).pathname); check(x.status === 200, `sitemap URL ${u} -> ${x.status}`); }
  if (og) { const x = await get(new URL(og).pathname); check(x.status === 200, `og:image -> ${x.status}`); }
  for (const p of ['/favicon.ico', '/favicon.svg', '/apple-touch-icon.png']) { const x = await get(p); check(x.status === 200, `GET ${p} -> ${x.status}`); }
}

console.log(`\n${failed ? `${failed} check(s) FAILED` : 'All checks passed'}`);
process.exit(failed ? 1 : 0);
