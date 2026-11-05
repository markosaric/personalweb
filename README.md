# personalweb

Marko Šarić's personal website: an [Astro](https://astro.build) static site built from the approved Keynote design in [`docs/design/`](docs/design/).

## Run it

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-checks, then builds to dist/
npm run preview  # serves dist/
```

## Where the content lives

| What | File |
| --- | --- |
| Name, headline, tagline, bio, profile links, socials | `src/data/profile.ts` |
| Talks I offer and past talks | `src/data/talks.ts` |
| Experience timeline | `src/data/jobs.ts` |
| Certifications (order, badge images) | `src/data/certifications.ts` |
| Articles (Markdown) | `src/content/articles/*.md` |
| Images | `src/assets/` (optimised to WebP at build time) |

The hero numbers are computed at build time: years in software from 2009, sessions delivered from the past-talks list (a row covering several events sets `sessions`), and certifications from the certifications list.

### Adding a talk

Add a line at the top of `pastTalks` in `src/data/talks.ts`. `slides` and `video` are optional links shown next to the talk.

### Adding an article

Create `src/content/articles/my-article.md`:

```md
---
title: My article
summary: One or two sentences for the homepage card.
tag: Azure
date: 2026-11-05
---

Article body.
```

The "Latest articles" section and its menu link appear once there is at least one article.

## Theme

Light and dark follow the visitor's system setting until they use the toggle; the choice is saved in `localStorage`. Colours are CSS variables in `src/styles/global.css`.
