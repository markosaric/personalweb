# Deployment: Cloudflare Pages and CI/CD

How to put the site on Cloudflare Pages and have GitHub Actions check, preview and deploy it. Follow the steps in order; the whole setup takes about 30 minutes, most of it waiting for DNS.

## What you end up with

| Event | What happens |
| --- | --- |
| Pull request opened or updated | GitHub Actions type-checks and builds the site. If the build passes, it uploads a **preview** to Cloudflare and links it on the PR. |
| Push or merge to `main` | Same build, then a **production** deploy to your domain. |
| "Run workflow" button in GitHub | A production deploy on demand. |

Everything runs on free tiers: Cloudflare Pages (unlimited bandwidth, 500 builds a month, though this setup builds on GitHub so it uses none of them) and GitHub Actions (free for public repos, 2,000 minutes a month for private ones; one run takes about a minute).

## Which way to deploy

Cloudflare Pages can deploy a site in two ways. This guide uses the second.

| | Cloudflare Git integration | GitHub Actions + Direct Upload (recommended) |
| --- | --- | --- |
| How it works | Cloudflare watches the repo and builds it on its own servers | GitHub Actions builds the site and uploads `dist/` to Cloudflare |
| PR checks in GitHub | A status link only; a failing build does not block the PR | A real check that can be made required before merging |
| Redeploy without a code change | "Retry deployment" in the Cloudflare dashboard | "Run workflow" button in GitHub |
| Where the build lives | Cloudflare dashboard settings | `.github/workflows/deploy.yml`, versioned with the code |
| Secrets to manage | None | One API token and the account ID |

Both build every pull request and every commit to `main`. GitHub Actions wins on the PR check: a broken build shows as a failed check that can block the merge, and the whole pipeline lives in one file in the repo where it is reviewed like any other change.

One thing to know before you start: a Pages project created for Direct Upload **cannot be switched to the Git integration later**. If you ever want that, you create a new Pages project and move the domain to it, which takes a few minutes.

## Before you start

- A Cloudflare account (free): <https://dash.cloudflare.com/sign-up>.
- Admin access to the `markosaric/personalweb` GitHub repo.
- The domain, once chosen. You can do steps 1 to 5 without it and add it later in step 6; until then the site lives at `https://personalweb.pages.dev`.

## Step 1: Create the Pages project

1. In the Cloudflare dashboard, open **Workers & Pages** and choose **Create** (or **Create application**).
2. Pick the **Pages** tab, then **Use direct upload** (sometimes labelled **Upload assets**). Do not pick "Connect to Git".
3. Name the project `personalweb`. The name becomes the free address `personalweb.pages.dev`; if it is taken, pick another name and use it wherever this guide says `personalweb`.
4. Cloudflare asks for files to upload. Either skip it, or build locally and drop in the `dist/` folder:

   ```sh
   npm ci
   npm run build   # creates dist/
   ```

5. Once the project exists, open **Settings → Builds & deployments** (or **Settings → General**) and check that the **production branch** is `main`. Deploys tagged with any other branch become previews.

## Step 2: Find your account ID

On the **Workers & Pages** overview page, the **Account ID** is shown in the right-hand column (you can also copy it from the dashboard URL: `dash.cloudflare.com/<account-id>/...`). Copy it; it is not secret, but it goes into GitHub secrets next to the token for tidiness.

## Step 3: Create an API token for GitHub

1. Go to **My Profile → API Tokens** (<https://dash.cloudflare.com/profile/api-tokens>) and choose **Create Token**.
2. Choose **Create Custom Token** (at the bottom).
3. Fill it in:
   - **Token name:** `personalweb GitHub Actions`
   - **Permissions:** `Account` · `Cloudflare Pages` · `Edit`
   - **Account resources:** `Include` · your account
   - **Client IP filtering** and **TTL:** leave empty (GitHub's runners have changing IP addresses).
4. **Continue to summary → Create Token**, and copy the token. Cloudflare shows it only once.

This token can only deploy Pages projects in your account. It cannot touch DNS, the domain or anything else.

## Step 4: Add the secrets to GitHub

In the repo on GitHub, open **Settings → Secrets and variables → Actions → New repository secret** and add two secrets:

| Name | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | The token from step 3 |
| `CLOUDFLARE_ACCOUNT_ID` | The account ID from step 2 |

## Step 5: Add the workflow

Create `.github/workflows/deploy.yml` with the content below, commit it on a branch and open a pull request. The PR itself is the first test: you should see the **Build** check pass and a preview link appear.

```yaml
name: Build and deploy

on:
  pull_request:
  push:
    branches: [main]
  workflow_dispatch:

# One run per branch at a time; a newer push cancels the older run.
concurrency:
  group: deploy-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm

      - run: npm ci

      # `npm run build` runs `astro check` first, so type errors fail the PR.
      - run: npm run build

      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist
          retention-days: 3

  deploy:
    name: Deploy
    needs: build
    runs-on: ubuntu-latest
    # Pull requests from forks get no secrets, so they only build.
    if: github.event_name != 'pull_request' || github.event.pull_request.head.repo.full_name == github.repository
    permissions:
      contents: read
      deployments: write
    environment:
      name: ${{ github.event_name == 'pull_request' && 'preview' || 'production' }}
      url: ${{ steps.deploy.outputs.deployment-url }}
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist

      - id: deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          command: pages deploy dist --project-name=personalweb --branch=${{ github.head_ref || github.ref_name }} --commit-dirty=true
```

What the pieces do:

- **`build`** runs for every trigger. It uses the Node version in `.nvmrc`, installs exactly what `package-lock.json` pins, and runs `npm run build` (which is `astro check && astro build`).
- **`deploy`** uploads the built `dist/` folder. `--branch` tells Cloudflare which branch the files came from: `main` becomes production, anything else becomes a preview at `https://<branch>.personalweb.pages.dev` (Cloudflare turns `/` and other odd characters in branch names into `-`).
- **`environment`** makes the deploy show up under **Deployments** on the repo page and puts a "View deployment" button on the PR.
- **`gitHubToken`** lets the Cloudflare action link the deployment back to GitHub.

When the PR's checks are green and the preview looks right, merge it. The merge triggers the first production deploy. Check the **Actions** tab, then open `https://personalweb.pages.dev`.

### Make the build check required (optional, recommended)

So nothing can be merged into `main` without building:

1. GitHub repo **Settings → Rules → Rulesets → New ruleset → New branch ruleset** (or **Settings → Branches → Add branch protection rule** on older layouts).
2. Target the default branch (`main`).
3. Turn on **Require status checks to pass** and add the check **`Build`**.
4. Save. You can still merge your own PRs; the button just waits for the check.

## Step 6: Connect your domain

Do this once the domain is decided.

### If the domain is on Cloudflare (simplest)

Either buy it with **Cloudflare Registrar** (at-cost prices, under **Domain Registration** in the dashboard) or add an existing domain to Cloudflare with **Add a domain** and change its nameservers at your current registrar to the two Cloudflare gives you. Wait until the dashboard says the domain is **Active** (minutes to a few hours).

Then:

1. **Workers & Pages → personalweb → Custom domains → Set up a custom domain.**
2. Enter the bare domain, for example `example.com`, and confirm. Cloudflare creates the DNS record and the HTTPS certificate itself.
3. Repeat for `www.example.com` if you want it to work too.
4. To send `www` to the bare domain (so there is one canonical address), add a redirect: domain **Rules → Redirect Rules → Create rule → "Redirect from WWW to root"** template.

### If the domain stays at another DNS provider

Only a subdomain such as `www.example.com` can be connected this way (the bare domain needs Cloudflare DNS):

1. **Custom domains → Set up a custom domain**, enter `www.example.com`.
2. At your DNS provider, add a `CNAME` record from `www` to `personalweb.pages.dev`.
3. Wait for the status in Cloudflare to turn **Active**.
4. At your registrar, forward the bare domain to `https://www.example.com`.

### Tell Astro the domain

Set `site` in `astro.config.mjs` so canonical URLs and social previews use the real address, and merge that as a normal PR:

```js
export default defineConfig({
  site: 'https://example.com',
});
```

## Step 7: Optional extras

- **Web Analytics:** **Workers & Pages → personalweb → Metrics → Web Analytics → Enable**. It is free, cookie-free and needs no consent banner. Cloudflare injects the script itself when the domain is proxied by Cloudflare; otherwise it gives you a snippet to add to `src/layouts/`.
- **Keep previews private:** **Settings → General → Access policy → Enable** puts preview URLs behind Cloudflare Access (free for up to 50 users), so unfinished talks and articles are not public.
- **Stop search engines indexing previews:** Cloudflare already sends `X-Robots-Tag: noindex` on `*.pages.dev` preview addresses, so nothing to do.

## Day to day

| You want to | Do this |
| --- | --- |
| Publish a change | Merge a PR into `main`. Live in about a minute. |
| See a change before it goes live | Open a PR and use the preview link on it. |
| Redeploy without a code change | GitHub **Actions → Build and deploy → Run workflow** on `main`. |
| Roll back a bad release | Cloudflare **Workers & Pages → personalweb → Deployments**, find the last good production deploy, **⋯ → Rollback to this deployment**. Then fix or revert on `main`, because the next commit to `main` deploys it again. |

## Upcoming talks and the build date

The site is fully static, so anything that depends on today's date is fixed at build time. Upcoming talks are listed while their date is today or later, and move to past talks (and into the "sessions delivered" count) once it has passed (see the main [README](../README.md#adding-an-upcoming-talk)). Since the site only rebuilds on a commit, a talk stays "upcoming" until the next deploy after its date. To move it along without a code change, use **Run workflow** on `main` (see [Day to day](#day-to-day)).

## Troubleshooting

| Symptom | Likely cause and fix |
| --- | --- |
| Deploy step fails with `Authentication error` or `10000` | The token is wrong, expired or lacks **Cloudflare Pages · Edit**. Create a new one (step 3) and update the `CLOUDFLARE_API_TOKEN` secret. |
| Deploy fails with `Project not found` | `--project-name` in the workflow does not match the Pages project name, or the account ID secret is for another account. |
| Build passes locally but fails in Actions | Usually a different Node version. Check `.nvmrc` matches what you use locally, and that `package-lock.json` is committed. |
| PRs from a fork only build, no preview | Expected: GitHub does not give secrets to fork PRs. |
| Custom domain stuck on "Verifying" | DNS has not propagated yet, or the CNAME points at the wrong name. Give it an hour, then check the record. |
| A past talk still shows as upcoming | The site has not been rebuilt since the talk's date. Run the workflow on `main`. |

## Switching to Azure later

The plan kept Azure Static Web Apps as the alternative. The build is the same; only the `deploy` job changes (to `Azure/static-web-apps-deploy` with an Azure deployment token), plus moving the domain. Nothing in the site code depends on Cloudflare.
