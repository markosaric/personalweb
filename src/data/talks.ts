import { getCollection } from 'astro:content';

export interface PastTalk {
  title: string;
  event: string;
  year: number;
  sessions: number;
  slides?: string;
  video?: string;
}

/** Start of today (UTC). "Upcoming" is decided when the site is built. */
function today() {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

/** Offers in card order. */
export async function getTalkOffers() {
  return (await getCollection('talkOffers', ({ data }) => !data.draft)).sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

/** Booked talks dated today or later, soonest first. */
export async function getUpcomingTalks() {
  const from = today();
  return (await getCollection('upcomingTalks', ({ data }) => data.date.valueOf() >= from)).sort(
    (a, b) => a.data.date.valueOf() - b.data.date.valueOf(),
  );
}

/**
 * Past talks, newest first: everything in talks/past plus upcoming talks whose
 * date has passed.
 */
export async function getPastTalks(): Promise<PastTalk[]> {
  const from = today();
  const passed = (await getCollection('upcomingTalks', ({ data }) => data.date.valueOf() < from))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map(({ data }) => ({ title: data.title, event: data.event, year: data.date.getUTCFullYear(), sessions: 1 }));

  const past = (await getCollection('pastTalks'))
    .sort((a, b) => b.data.year - a.data.year || b.data.order - a.data.order || a.id.localeCompare(b.id))
    .map(({ data }) => ({ title: data.title, event: data.event, year: data.year, sessions: data.sessions, slides: data.slides, video: data.video }));

  // Passed upcoming talks are the most recent of their year.
  return [...passed, ...past].sort((a, b) => b.year - a.year);
}

export async function getSessionsDelivered() {
  return (await getPastTalks()).reduce((sum, t) => sum + t.sessions, 0);
}
