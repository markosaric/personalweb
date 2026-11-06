import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Articles are Markdown files in src/content/articles/. The homepage shows the
// three newest; the section and its menu link stay hidden until one exists.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tag: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

// Talks live in src/content/talks/: one Markdown file per talk.

// Sessions offered to conferences and meetups, shown as cards.
const talkOffers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/talks/offers' }),
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    blurb: z.string(),
    /** Card position, lowest first. */
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

// Talks already given. Sorted newest year first; within a year, higher `order`
// comes first. Files are named <year>-<event>.md.
const pastTalks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/talks/past' }),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    year: z.number().int(),
    order: z.number().default(0),
    /** How many sessions this entry stands for, when one entry covers several events. */
    sessions: z.number().int().positive().default(1),
    slides: z.url().optional(),
    video: z.url().optional(),
  }),
});

// Booked talks. Shown under "Upcoming talks" until their date passes; after
// that the next build lists them under past talks. Files are named
// <year>-<event>.md, the same as past talks.
const upcomingTalks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/talks/upcoming' }),
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.coerce.date(),
    city: z.string().optional(),
    url: z.url().optional(),
  }),
});

export const collections = { articles, talkOffers, pastTalks, upcomingTalks };
