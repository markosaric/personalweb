# Deployment: Cloudflare Workers with Git integration

How the site is hosted and deployed. Cloudflare connects to the GitHub repo and does everything itself: it builds every commit, deploys `main` to production and gives every other branch a preview. There is no CI configuration in the repo apart from [`wrangler.jsonc`](../wrangler.jsonc), and no API tokens or GitHub secrets to manage.

## What you end up with

| Event | What happens |
| --- | --- |
| Commit to `main` (including a merged PR) | Cloudflare builds the site and deploys it to production. |
| Commit to any other branch, or a PR | Cloudflare builds it and uploads a **preview** version with its own URL. A failing build shows as a failed check on the commit and the PR. |

Everything runs on the free plan: static asset requests on Workers are free and unlimited, and Workers Builds includes 3,000 build minutes a month (one build of this site takes about a minute).

## How the pieces fit

- **Cloudflare Workers** serves the built site. Astro builds plain files into `dist/`, and `wrangler.jsonc` tells Cloudflare to serve that folder as static assets. No server code runs.
- **Workers Builds** is Cloudflare's Git integration. The **Cloudflare Workers and Pages** GitHub App gives it permission to read the repo and to post build checks back to GitHub.
- **Wrangler** is Cloudflare's command-line tool. Workers Builds runs it to deploy; you never need to run it yourself.

`wrangler.jsonc` in the repo root:

```jsonc
{
  "name": "personalweb",            // must match the Worker name in the dashboard
  "compatibility_date": "2026-11-01",
  "assets": {
    "directory": "./dist",          // Astro's build output
    "not_found_handling": "404-page" // serves dist/404.html if a page is missing
  }
}
```

## Before you start

- A Cloudflare account (free): <https://dash.cloudflare.com/sign-up>.
- Admin access to the `markosaric/personalweb` GitHub repo.
- The domain, once chosen. Steps 1 to 4 work without it; until then the site lives at `https://personalweb.<your-subdomain>.workers.dev`.

## Step 1: Give Cloudflare access to the repo

Cloudflare only sees repos that its GitHub App is allowed to read. If `personalweb` does not show up when you import a repository, this is why.

1. In GitHub, open your avatar menu → **Settings → Applications → Installed GitHub Apps**.
2. If **Cloudflare Workers and Pages** is listed, choose **Configure**. If it is not listed, go to step 2 below: Cloudflare installs it the first time you connect GitHub.
3. Under **Repository access**, either choose **All repositories**, or keep **Only select repositories** and add `markosaric/personalweb`.
4. **Save**.

The app gets read access to the code and write access to checks, deployments and pull request comments, which it uses to report build results. It cannot push code.

## Step 2: Create the Worker from the repo

1. In the Cloudflare dashboard, open **Workers & Pages → Create → Workers → Import a repository** (the screen with "Select a repository").
2. Pick the `markosaric` GitHub account. If it is not in the list yet, choose **Connect GitHub**, sign in and install the app as in step 1.
3. Search for `personalweb` and choose **Select**. If it still does not appear, refresh the page after step 1.
4. Fill in the build settings:

   | Setting | Value |
   | --- | --- |
   | Project name | `personalweb` (must match `name` in `wrangler.jsonc`) |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Non-production branch deploy command | `npx wrangler versions upload` |
   | Path (root directory) | `/` |

5. Open **Advanced settings → Build variables** and add `NODE_VERSION` = `22`, so the build uses the same Node version as `.nvmrc`.
6. Choose **Create and deploy**. The first build starts straight away; follow it on the build log page. When it finishes, Cloudflare shows the `*.workers.dev` address of the live site.

## Step 3: Check the branch settings

Open **Workers & Pages → personalweb → Settings → Build**:

- **Git repository:** `markosaric/personalweb`.
- **Branch control → Production branch:** `main`.
- **Builds for non-production branches:** enabled. This is what builds PRs and gives them preview URLs.
- **Preview URLs** (under **Settings → Domains & Routes**): enabled, so each preview version gets its own address.

Preview addresses look like `https://<branch>-personalweb.<your-subdomain>.workers.dev`, with odd characters in the branch name turned into `-`. The address for each build is on the build's page in Cloudflare and on the commit's check in GitHub.

## Step 4: Make the build check required (optional, recommended)

So nothing can be merged into `main` without building:

1. Open a test PR first, so GitHub has seen Cloudflare's check at least once.
2. GitHub repo **Settings → Rules → Rulesets → New ruleset → New branch ruleset** (or **Settings → Branches → Add branch protection rule** on older layouts).
3. Target the default branch (`main`).
4. Turn on **Require status checks to pass** and add Cloudflare's check (it is named after the Worker, for example **Workers Builds: personalweb**).
5. Save.

## Step 5: Connect your domain

Do this once the domain is decided. A custom domain on a Worker needs the domain's DNS on Cloudflare.

1. Either buy the domain with **Cloudflare Registrar** (at-cost prices, under **Domain Registration**), or add an existing domain with **Add a domain** and change its nameservers at your current registrar to the two Cloudflare gives you. Wait until the domain is **Active** (minutes to a few hours).
2. **Workers & Pages → personalweb → Settings → Domains & Routes → Add → Custom domain**.
3. Enter the bare domain, for example `example.com`, and confirm. Cloudflare creates the DNS record and the HTTPS certificate itself.
4. Repeat for `www.example.com` if you want it to work too, or send `www` to the bare domain with the domain's **Rules → Redirect Rules → "Redirect from WWW to root"** template.
5. Optionally, turn off the `workers.dev` address under **Domains & Routes** so the site has one public address.

Then set `site` in `astro.config.mjs` so canonical URLs and social previews use the real address, and merge that as a normal PR:

```js
export default defineConfig({
  site: 'https://example.com',
});
```

## Step 6: Clean up the old setup

The site was first deployed to Cloudflare **Pages** by GitHub Actions. That setup is gone from the repo, so remove what is left of it:

1. GitHub repo **Settings → Secrets and variables → Actions**: delete `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
2. Cloudflare **My Profile → API Tokens**: delete the token you made for GitHub Actions.
3. Cloudflare **Workers & Pages**: open the old **Pages** project `personalweb` (the one with a `pages.dev` address), **Settings → Delete project**. Do this after the new Worker is live, and move any custom domain over first.
4. GitHub repo **Settings → Environments**: delete `preview` and `production` if you no longer want them listed.

## Optional extras

- **Web Analytics:** **Workers & Pages → personalweb → Metrics**, or the account-level **Web Analytics** page, then enable it for the site's domain. It is free and cookie-free, so no consent banner is needed.
- **Build watch paths:** under **Settings → Build → Build watch paths** you can skip builds for commits that only touch `docs/**`, for example.

## Day to day

| You want to | Do this |
| --- | --- |
| Publish a change | Merge a PR into `main`. Live in about a minute. |
| See a change before it goes live | Push to a branch or open a PR and use the preview URL from the Cloudflare check. |
| Redeploy without a code change | **Workers & Pages → personalweb → Deployments**, pick the latest build and **Retry build**. |
| Roll back a bad release | **Workers & Pages → personalweb → Deployments**, find the last good version, **⋯ → Rollback**. Then fix or revert on `main`, because the next commit deploys `main` again. |

## Upcoming talks and the build date

The site is fully static, so anything that depends on today's date is fixed at build time. Upcoming talks are listed while their date is today or later, and move to past talks (and into the "sessions delivered" count) once it has passed (see the main [README](../README.md#adding-an-upcoming-talk)). Since the site only rebuilds on a commit, a talk stays "upcoming" until the next deploy after its date. Adding or updating a talk, article or anything else moves it along.

## Troubleshooting

| Symptom | Likely cause and fix |
| --- | --- |
| `personalweb` does not appear under "Select a repository" | The Cloudflare GitHub App has no access to it. Add the repo in step 1, then refresh. |
| Build fails on `astro check` or a Node error | Usually the Node version. Check the `NODE_VERSION` build variable matches `.nvmrc`. |
| Deploy step fails with a name mismatch | The Worker name in the dashboard and `name` in `wrangler.jsonc` must be the same. |
| PRs get no preview | **Builds for non-production branches** is off, or the non-production deploy command is missing (step 3). |
| Custom domain cannot be added | The domain's DNS is not on Cloudflare yet, or it is still pending. |
| A past talk still shows as upcoming | The site has not been rebuilt since the talk's date. The next commit to `main` fixes it, or use **Retry build**. |
