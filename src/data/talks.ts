export interface TalkOffer {
  tag: string;
  title: string;
  blurb: string;
}

export interface PastTalk {
  year: number;
  title: string;
  event: string;
  /** How many sessions this row stands for, when one row covers several events. Defaults to 1. */
  sessions?: number;
  slides?: string;
  video?: string;
}

export const offers: TalkOffer[] = [
  {
    tag: 'AI · Azure',
    title: 'From Prompts to Purpose: Architecting Agentic AI in the Azure Cloud',
    blurb: 'Build goal-driven AI agents that plan, reason and act, using Azure AI Foundry and Microsoft Agent Framework.',
  },
  {
    tag: 'Azure · Data',
    title: 'Demystifying Azure Cosmos DB',
    blurb: 'Where Cosmos DB costs really come from, how to keep them under control, and when Azure SQL or Blob Storage is the better choice.',
  },
  {
    tag: 'AI · .NET',
    title: 'Honey, AI will replace me',
    blurb: 'A real-world look at GitHub Copilot in a .NET project: what it does to productivity and code quality, and whether AI will really replace us.',
  },
];

/** Newest first. The first five show on the homepage; the rest sit behind "Show all". */
export const pastTalks: PastTalk[] = [
  { year: 2026, title: 'From Prompts to Purpose: Architecting Agentic AI in the Azure Cloud', event: 'Weblica 2026' },
  { year: 2026, title: 'From Prompts to Purpose: Architecting Agentic AI in the Azure Cloud', event: '.debug 2026' },
  { year: 2026, title: 'Demystifying Azure Cosmos DB', event: 'NetWork 14' },
  { year: 2024, title: 'Honey, AI will replace me', event: 'Advanced Technology Days 19' },
  { year: 2024, title: 'Battle of Titans: EF Core vs Dapper', event: 'Weblica 2024' },
  { year: 2022, title: 'Troubles during migration: On-premise MongoDB on Azure Cosmos DB', event: 'Advanced Technology Days 17' },
  { year: 2020, title: 'Building The Pipeline', event: 'WinDays 2020' },
  { year: 2019, title: 'Enforcing Agile Teams with Azure DevOps', event: 'Advanced Technology Days 15' },
  { year: 2019, title: 'Enforcing Agile Teams with Azure DevOps', event: 'Global Azure Bootcamp 2019' },
  { year: 2019, title: 'Building Cross-Platform Native Mobile Apps with NativeScript', event: 'NetWork, WinDays and Weblica 2019', sessions: 3 },
  { year: 2019, title: 'Azure DevOps practices in Agrivi', event: 'Algebra' },
  { year: 2018, title: 'Crazy little thing called Serverless', event: 'Change 2018' },
  { year: 2018, title: 'Crazy little thing called Serverless', event: 'CrisCon 2018' },
  { year: 2018, title: 'Azure Beyond Websites', event: 'Weblica 2018' },
  { year: 2018, title: 'A DevOps Guide for Developers', event: 'WinDays 2018' },
  { year: 2017, title: 'Azure Beyond Websites', event: 'Advanced Technology Days 13' },
  { year: 2017, title: 'Continuous Delivery: A Roadmap To Failure', event: 'Weblica 2017' },
  { year: 2017, title: 'Bite the Apple: EF Core on macOS and SQL Server in container', event: 'WinDays 2017' },
  { year: 2017, title: 'EF Core on macOS and Azure SQL', event: 'Microsoft Community' },
];

export const sessionsDelivered = pastTalks.reduce((sum, t) => sum + (t.sessions ?? 1), 0);
