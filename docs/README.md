# Docs

Planning and design material for Marko Šarić's personal website.

| File | What it is |
| --- | --- |
| [plan.md](plan.md) | The project plan: goals, site structure, data sources, tech stack, phases and answered questions. Exported from the Claude Doc on 5 Nov 2026. |
| [deployment.md](deployment.md) | Step-by-step setup of Cloudflare Workers hosting with its Git integration (GitHub access, builds, PR previews, production deploys, custom domain). |
| [design/](design/) | The approved **Keynote** homepage design (canvas source and every image it uses). |

## Decisions so far

- **Design:** Keynote direction, light/dark toggle, `header.jpg` as hero background, circular headshot with vignette and an MCP badge at about 4:30.
- **Language:** English only, including talk titles and articles.
- **Stack:** Astro static site. Hosted on Cloudflare Workers, built and deployed by Cloudflare's Git integration (decided 6 Nov 2026); see [deployment.md](deployment.md).
- **Certifications:** 15 cards. The first five are Azure Solutions Architect Expert, DevOps Engineer Expert, Azure Developer Associate, Microsoft 365 Fundamentals and Azure AI Fundamentals. The rest sit behind "Show all".
- **Talks:** three "Talks I offer" cards, plus 19 past talks (21 sessions delivered) with the top 5 visible and the rest behind "Show all".
- **Contact:** LinkedIn only; no email address or contact form.
- **No CV download** and no speaker kit.

## Still open

- Domain name
- Existing articles to bring over
