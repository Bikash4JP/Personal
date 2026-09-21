# Bikash Thapa — Portfolio

Personal portfolio of Bikash Thapa, a full-stack engineer based in Tokyo, Japan.

Live: deployed to a private S3 bucket behind CloudFront (HTTPS) via GitHub Actions on every push to `main`.

## Stack

- Pure HTML5 + CSS3 + vanilla JavaScript — no build step, no framework
- [Three.js](https://threejs.org/) for the animated particle-network hero background
- [GSAP](https://gsap.com/) + ScrollTrigger for scroll-based reveals, skill bar fills, and stat counters
- Bilingual EN / 日本語 toggle (persisted in `localStorage`)
- [Web3Forms](https://web3forms.com/) for the contact form (no backend required)

## Structure

```
index.html            single-page site, all sections (also holds all SEO metadata + JSON-LD in <head>)
assets/css/style.css  design system + component styles
assets/js/three-bg.js Three.js hero particle background
assets/js/main.js     nav, language toggle, typewriter, tilt effects,
                       scroll reveals, skill bars, project filter, contact form
assets/imgs/          images (avatar.jpg, og-image.jpg = 1200x630 social preview)
robots.txt            allows all crawlers, points to the sitemap
sitemap.xml           canonical public URLs (currently just the homepage)
404.html              self-contained not-found page (noindex); wired up via CloudFront error pages
favicon.svg/.ico, apple-touch-icon.png   crawlable site icons
scripts/seo-check.mjs SEO regression check (no dependencies)
docs/                 SEO external-setup guide (not deployed)
```

## SEO

- Canonical origin is `https://bikash4jp.com/` (no `www`). Keep `<link rel="canonical">`, `og:url`, `sitemap.xml`,
  `robots.txt` and the JSON-LD `@id`s on that exact origin.
- The JSON-LD in `index.html` must only state things that are visible on the page. If you change the copy
  (job, employer, projects, links), update the JSON-LD, `<title>` and meta description to match.
- Text in elements with `data-en`/`data-jp` must be **English in the HTML** (JS swaps it for Japanese); the
  checker fails if the static text and `data-en` differ.
- Run `node scripts/seo-check.mjs` before pushing, and `node scripts/seo-check.mjs --live` after a deploy.
- Anything that needs a Google/AWS/Bing account (Search Console, sitemap submission, CloudFront error page,
  analytics) is in [docs/SEO-EXTERNAL-SETUP.md](docs/SEO-EXTERNAL-SETUP.md).

## Sections

Hero · About · Skills · Projects · Experience · Certifications & Languages · Contact

## Local development

No build tooling required — serve the folder statically, e.g.:

```bash
npx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:PORT`.

## Deployment

`.github/workflows/deploy.yml` syncs this folder to a private S3 bucket and busts the CloudFront
cache on every push to `main`, authenticating to AWS via OIDC role assumption (no long-lived AWS
keys stored in GitHub).

Architecture: **CloudFront (HTTPS, public) → S3 (private, Origin Access Control)**. The bucket
itself is never public — CloudFront is the only thing allowed to read from it.

One-time AWS setup (see chat history with Claude for the full console walkthrough):

1. **Create a private S3 bucket** in `ap-northeast-1` — keep "Block all public access" ON.
2. **Create a CloudFront distribution** with that bucket as the origin, using "Origin access
   control" (not a public bucket / website endpoint). Set the default root object to `index.html`.
   Paste the bucket policy CloudFront generates for you into the bucket's permissions.
3. **Create an OIDC identity provider** for `token.actions.githubusercontent.com` in IAM, if this
   AWS account doesn't already have one (Audience: `sts.amazonaws.com`).
4. **Create an IAM role** that trusts that provider, scoped to this repo, with a trust policy like:

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Principal": { "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com" },
       "Action": "sts:AssumeRoleWithWebIdentity",
       "Condition": {
         "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
         "StringLike": { "token.actions.githubusercontent.com:sub": "repo:Bikash4JP/Personal:ref:refs/heads/main" }
       }
     }]
   }
   ```

   Attach a permissions policy granting `s3:PutObject`, `s3:DeleteObject`, and `s3:ListBucket` on
   the bucket, and `cloudfront:CreateInvalidation` on the distribution.
5. **Set repository variables** (Settings → Secrets and variables → Actions → Variables) on
   `Bikash4JP/Personal`:
   - `AWS_ROLE_ARN` — the role's ARN from step 4
   - `AWS_REGION` — `ap-northeast-1`
   - `S3_BUCKET_NAME` — the bucket from step 1
   - `CLOUDFRONT_DISTRIBUTION_ID` — the distribution from step 2
6. Push to `main` (or run the workflow manually from the Actions tab) and visit the distribution's
   `*.cloudfront.net` domain.

## Performance notes

- Three.js particle count and frame rate are reduced automatically on mobile viewports
- All below-the-fold sections are revealed lazily via `IntersectionObserver`
- Respects `prefers-reduced-motion` — animations are disabled/minimized for users who request it
