export interface Job {
  role: string;
  org: string;
  years: string;
  /** Earlier role at the same company, shown as "promoted from". */
  promotedFrom?: string;
}

/** Newest first. */
export const jobs: Job[] = [
  { role: 'Senior Software Engineer', org: 'Syskit', years: '2025 – now' },
  { role: 'Lead Software Engineer', org: 'GlobalLogic Croatia', years: '2021 – 2025' },
  { role: 'Development Team Lead', org: 'Agrivi', years: '2018 – 2021' },
  { role: 'Application Development Consultant', org: 'Comminus', years: '2015 – 2018', promotedFrom: 'Application Development Specialist' },
  { role: 'Lead Software Engineer / Team Lead', org: 'Microlab', years: '2009 – 2015', promotedFrom: 'Software Engineer' },
];
