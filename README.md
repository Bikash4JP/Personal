# Bikash Thapa — Portfolio

Personal portfolio of Bikash Thapa, a full-stack engineer based in Tokyo, Japan.

Live: deployed to an S3 static site bucket via GitHub Actions on every push to `main`.

## Stack

- Pure HTML5 + CSS3 + vanilla JavaScript — no build step, no framework
- [Three.js](https://threejs.org/) for the animated particle-network hero background
- [GSAP](https://gsap.com/) + ScrollTrigger for scroll-based reveals, skill bar fills, and stat counters
- Bilingual EN / 日本語 toggle (persisted in `localStorage`)
- [Web3Forms](https://web3forms.com/) for the contact form (no backend required)

## Structure

```
index.html            single-page site, all sections
assets/css/style.css  design system + component styles
assets/js/three-bg.js Three.js hero particle background
assets/js/main.js     nav, language toggle, typewriter, tilt effects,
                       scroll reveals, skill bars, project filter, contact form
assets/imgs/          images
```

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

`.github/workflows/deploy.yml` syncs this folder to an S3 bucket on every push to `main`, authenticating
to AWS via OIDC role assumption (no long-lived AWS keys stored in GitHub).

One-time AWS setup:

1. **Create the S3 bucket** and enable static website hosting on it (or front it with CloudFront).
2. **Create an OIDC identity provider** for `token.actions.githubusercontent.com` in IAM, if this AWS
   account doesn't already have one.
3. **Create an IAM role** that trusts that provider, scoped to this repo, with a trust policy like:

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

   Attach a permissions policy granting `s3:PutObject`, `s3:DeleteObject`, and `s3:ListBucket` on the
   target bucket (and `cloudfront:CreateInvalidation` if using CloudFront).
4. **Set repository variables** (Settings → Secrets and variables → Actions → Variables) on
   `Bikash4JP/Personal`:
   - `AWS_ROLE_ARN` — the role's ARN from step 3
   - `AWS_REGION` — e.g. `ap-northeast-1`
   - `S3_BUCKET_NAME` — the bucket from step 1
   - `CLOUDFRONT_DISTRIBUTION_ID` — optional, only if using CloudFront (also uncomment the
     invalidation step in the workflow)

## Performance notes

- Three.js particle count and frame rate are reduced automatically on mobile viewports
- All below-the-fold sections are revealed lazily via `IntersectionObserver`
- Respects `prefers-reduced-motion` — animations are disabled/minimized for users who request it
