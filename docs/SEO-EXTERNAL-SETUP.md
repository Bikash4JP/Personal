# SEO — external setup guide for bikash4jp.com

Everything here needs **your** accounts (Google, AWS, Bing). None of it can be done from the repo.
This folder is excluded from the S3 deploy, so this file is never published.

**Facts about your setup, checked on 2026-09-21** (so the steps below are specific):

| Item | Value |
| --- | --- |
| Registrar | Amazon Registrar (Route 53 Domains). Domain registered 2026-09-13 |
| DNS | Route 53 (nameservers `ns-*.awsdns-*`) |
| Hosting | S3 (private) behind CloudFront, deployed by `.github/workflows/deploy.yml` on push to `main` |
| `http://` → `https://` | Already redirects (301) |
| `www.bikash4jp.com` | **No DNS record exists** (does not resolve) |
| Existing TXT records | None |

Legend: **[MANDATORY]** needed for the plan to work · **[RECOMMENDED]** worth doing · **[OPTIONAL]**

---

## What the repository already contains (done in code, not yet live)

These are written and pass local checks, but **nothing is live until you commit, push to `main`, and the
GitHub Action finishes** (the push triggers a production deploy, so it was intentionally not done for you).

| Done in the repo | Live? |
| --- | --- |
| Title, description, canonical, robots meta, Open Graph, Twitter card in `index.html` | after deploy |
| JSON-LD (WebSite, ProfilePage, Person, 4 project nodes) in `index.html` | after deploy |
| `robots.txt`, `sitemap.xml` (1 URL) | after deploy |
| `404.html` (noindex), real favicon files, 1200×630 social image | after deploy |
| Deploy workflow excludes `docs/` and `scripts/` from S3 | after deploy |
| `scripts/seo-check.mjs` regression check | local only |

Not done, needs you: everything below.

---

## Step 0 — Deploy and verify [MANDATORY]

1. Review the changes, then commit and push to `main` (or run the workflow from GitHub → Actions → *Deploy to S3* → *Run workflow*).
2. Wait for the Action to finish (green check).
3. Run `node scripts/seo-check.mjs --live` in the repo folder.
   - **Success:** homepage, robots.txt, sitemap.xml, icons and og:image return 200. The "missing page" line will say `403` (a WARN, not a failure) until Step 1.
   - **Common errors:** `robots.txt -> 403` means the deploy didn't upload it (check the Action log); a stale copy for up to a day is CloudFront caching, and the workflow already invalidates `/*`.

## Step 1 — Make missing pages return a real 404 [RECOMMENDED]

Today a missing URL returns **403** with S3's XML error, not 404. Google treats both as "not found", but a 404 is cleaner
and shows visitors a proper page.

1. AWS Console → **CloudFront** → your distribution → **Error pages** tab → **Create custom error response**.
2. Do this twice, once for HTTP error code **403** and once for **404**:
   - Customize error response: **Yes**
   - Response page path: `/404.html`
   - HTTP response code: **404: Not Found**
   - Error caching minimum TTL: `60`
3. **Success:** `curl -I https://bikash4jp.com/anything-missing` shows `HTTP/1.1 404`, and the browser shows the "Page not found" page.
4. **Errors:** if you still get 403, Step 0 hasn't deployed `404.html` yet, or the path is missing its leading `/`.

## Step 2 — Google Search Console: add the Domain property [MANDATORY]

Tool: <https://search.google.com/search-console> (sign in with the Google account you want to own this).

1. Click the property dropdown (top-left) → **Add property**.
2. Choose the **Domain** panel (left one). Enter `bikash4jp.com` (no `https://`, no `www`). Click **Continue**.
3. Google shows a TXT record starting with `google-site-verification=`. **That value comes from your Google account — copy it from that dialog; it is not in this repo and must never be guessed.**
4. Add it in Route 53 (this is your DNS provider):
   1. <https://console.aws.amazon.com/route53/> → **Hosted zones** → `bikash4jp.com` (if you see two zones with this name, use the one whose NS values match `ns-687.awsdns-21.net` etc.).
   2. **Create record** → Record name: **leave empty** → Record type: **TXT** → Value: paste the string **wrapped in double quotes**, e.g. `"google-site-verification=abc123..."` → TTL `300` → **Create records**.
5. Back in Search Console click **Verify**.
   - **Success:** "Ownership verified".
   - **Errors:** "Couldn't find the TXT record" → wait 5–10 minutes and retry; check for stray spaces/missing quotes; make sure it was added at the root (empty name), not `www`.
6. Leave the TXT record in place permanently. Removing it un-verifies you.

A Domain property covers `http/https` and all subdomains, so a separate URL-prefix property is **not needed**.
(You would only add one, using the HTML-file method, if you couldn't edit DNS. Don't.)

## Step 3 — Submit the sitemap [MANDATORY]

1. Search Console → **Sitemaps** (left menu, under Indexing).
2. "Add a new sitemap": type `sitemap.xml` → **Submit**.
3. **Success:** status **Success**, "Discovered pages: 1".
4. **Errors:** "Couldn't fetch" → open `https://bikash4jp.com/sitemap.xml` in a browser; if it shows an XML `AccessDenied` message, Step 0 hasn't deployed. Submitting only tells Google where to look; it does not guarantee indexing.

## Step 4 — Inspect the homepage and request indexing [RECOMMENDED]

1. Search Console → paste `https://bikash4jp.com/` in the top search bar → Enter.
2. A brand-new domain will say **"URL is not on Google"**, which is normal.
3. Click **Test live URL** → check it says "URL is available to Google" → in the results click **View tested page** to see the rendered HTML and screenshot (confirms Google can render the JS-driven page and that CSS/JS/images aren't blocked).
4. Click **Request indexing** (daily quota is small; once is enough).
5. Do not repeat requests hoping it speeds things up. It doesn't, and it is not a guarantee.

There is one page, so there are no other URLs to inspect. The `#project` anchors are not separate URLs.

## Step 5 — Structured data and page-speed checks [RECOMMENDED]

These are web tools; they were **not run** by Claude, so treat the JSON-LD as locally parsed but externally unvalidated.

- **Rich Results Test:** <https://search.google.com/test/rich-results> → *URL* tab → `https://bikash4jp.com/` → Test URL.
  Expect it to detect the structured data with **no errors**. Person/ProfilePage markup does not produce a guaranteed rich result; "no eligible rich results" is not a fault.
- **Schema Markup Validator:** <https://validator.schema.org/> → *Fetch URL* → same URL. Success = all 7 items parse with no errors.
- **PageSpeed Insights:** <https://pagespeed.web.dev/> → same URL → Analyze, for **Mobile** and **Desktop**.
  A new site will show "No data" for real-user (CrUX) field data. Only lab data (Lighthouse) is available at first.
  Don't chase a score; look at the specific LCP, CLS and INP items it flags.
  For reference, Claude's own **lab** run (Lighthouse 13.5, mobile, simulated throttling, against a *local* copy, 2026-09-21) gave
  SEO 100 · Best Practices 100 · Accessibility 96 · Performance 78–79, FCP 1.2 s, **LCP ≈ 5.4 s (not good; target ≤ 2.5 s)**, TBT ≈ 115 ms, CLS 0.009.
  The LCP element is the hero paragraph, which stays at opacity 0 until `main.js` runs, and that waits for the Three.js + GSAP CDN scripts
  and the loader. Fixing it means changing the hero entrance animation, which is a design decision, so it was left alone.
  Real-user Core Web Vitals have **not** been measured.

## Step 6 — Bing Webmaster Tools [OPTIONAL]

1. <https://www.bing.com/webmasters> → sign in → **Import** your site from Google Search Console (easiest; needs Step 2 done).
2. Sitemaps → submit `https://bikash4jp.com/sitemap.xml`.
3. Why: Bing's index is also used by some other search products. Success = site listed with sitemap "Success".

## Step 7 — Google Analytics 4 [OPTIONAL, not required for SEO]

Nothing is installed today and nothing was added, because a measurement ID has to come from your account.

1. <https://analytics.google.com> → **Admin** → **Create** → Property → name `bikash4jp.com`, time zone Japan.
2. **Data streams** → **Web** → URL `https://bikash4jp.com` → **Create stream** → copy the **Measurement ID** (`G-XXXXXXXXXX`, from your account).
3. Add to `<head>` of `index.html` (replace the placeholder with your real ID; never commit a fake one):

   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```
4. Validate: Admin → **DebugView**, or **Reports → Realtime** while you open the site in another tab. Success = your visit appears within about a minute.
5. Optional: Admin → **Product links → Search Console links** to see search queries inside GA4.
6. **Privacy:** the tag sets cookies. You are in Japan (APPI applies to personal data handling); if visitors from the EU/UK are an intended audience, you need a consent banner and Consent Mode before loading the tag. Add a short privacy note either way. The contact form sends submissions to Web3Forms, and Google Fonts loads from Google; both are third-party data flows worth mentioning in that note.

## Step 8 — Fix content that hurts trust and SEO [RECOMMENDED]

These are on the live page and only you can fix them (details in the report's content questions):

- `api.bikash4jp.com` (DevPulse "Live at") **does not resolve in DNS** — dead link. Either create the Route 53 record or remove the line.
- Footer "LinkedIn" links to `https://www.linkedin.com/` (the homepage). Give me the profile URL to use it (and add it to `sameAs`), or remove it.

## Step 9 — `www` and `/index.html` [OPTIONAL]

`www.bikash4jp.com` does not exist, so nobody can land there by accident and Google doesn't need it. Only do this if you'll
put `www` in email signatures or business cards. `/index.html` duplicates `/` but the canonical tag already handles that.

If you do want them, use one CloudFront Function (CloudFront → **Functions** → Create → paste → Publish → attach to the distribution's
default behavior as **Viewer request**):

```js
function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  var qs = Object.keys(request.querystring).map(function (k) {
    var q = request.querystring[k];
    return q.value === '' ? k : k + '=' + q.value;
  }).join('&');
  var uri = request.uri === '/index.html' ? '/' : request.uri;

  if (host === 'www.bikash4jp.com' || uri !== request.uri) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://bikash4jp.com' + uri + (qs ? '?' + qs : '') } }
    };
  }
  return request;
}
```

The `www` part additionally needs: an ACM certificate in **us-east-1** covering both names, `www.bikash4jp.com` added under the
distribution's **Alternate domain names**, and a Route 53 `www` **A (alias)** record to the same distribution.
Test with `curl -I https://www.bikash4jp.com/` → `301` to `https://bikash4jp.com/`. Do not proceed if the certificate step fails; a broken cert on `www` is worse than no `www`.

---

## Ongoing monitoring

**Weekly (10 min, first 2 months):**
- Search Console → **Indexing → Pages**: is the homepage "Indexed"? Anything under "Why pages aren't indexed"?
- **Sitemaps**: still "Success"?
- **Performance**: any impressions yet? Queries containing your name?

**Monthly:**
- Run `node scripts/seo-check.mjs --live` after any change.
- Update the copy when you finish a project or change jobs (title/description/JSON-LD/README should match the visible text).
- Re-check outbound links (GitHub repos, `it-future.jp`, APK link).
- PageSpeed Insights on mobile; compare with last month.
- Search your own name and `site:bikash4jp.com` in Google to see what's indexed.

**What to expect:** a domain registered on 2026-09-13 with no inbound links can take days to weeks to be crawled and indexed,
and might not appear for competitive terms at all. Name searches ("Bikash Thapa") are the realistic first target. Links from
your GitHub profile, LinkedIn, and any company/project pages that point to `https://bikash4jp.com/` are the most useful thing you can do off-site.

## Deliberately not added

- **`llms.txt`:** no major search engine or AI vendor has committed to using it, so it is not necessary. Clear HTML and structured data do the real work. Easy to add later if you want it.
- **AI-crawler rules in `robots.txt`:** the default (`Allow: /`) already lets all well-behaved crawlers in. Blocking any of them is your decision; say so and it can be added.
- **`sitemap` `lastmod`/`changefreq`/`priority`:** `lastmod` would go stale without build tooling; the other two are ignored by Google.
- **Google verification token / placeholder GA ID:** would have to be invented. Both come from your accounts.
