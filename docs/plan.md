# Personal speaker website plan

Nov 4, 2026 · @Marko Šarić

## Summary

We build a fast, single-page personal site that positions you as an IT professional, Microsoft Certified Professional and conference speaker, in three phases: research (now), proposal (a clickable mock-up for your sign-off), then build and launch.

The site must show five things: who you are (about + CV highlights), your certifications, your past and upcoming talks, your social profiles (Facebook, Instagram, LinkedIn, Sessionize, GitHub), and a way to contact or book you. My recommendation is a static site on Azure Static Web Apps or GitHub Pages, with certifications and sessions kept in simple data files that refresh automatically where the source allows it. Your answers to the questions at the end unlock the proposal phase.

## What the example sites teach

The [CodersRank list](https://blog.codersrank.io/10-inspiring-developer-websites-and-profile-pages/) shows that the strongest sites say who the person is in the first screen, then prove it with a timeline and a skills view. Those are the patterns worth copying; their CodersRank widgets are not needed, because your proof is certifications and talks.

| Example | Pattern to borrow |
| --- | --- |
| [Szymon Gackowski](https://gackowski.edu.pl/resume) | Resume page: summary, skills, work experience in order |
| [Atanas Atanasov](https://scriptex.js.org/) | Career timeline next to a skills chart |
| [David Toth](https://uigitdev.com/) | Widgets restyled to match one consistent theme |
| [Gerard Lewis](https://gerardoandresruizcastillo.com/#home) | Skills front and centre on the homepage |
| [Mattia Penna](https://tiapnn.netlify.app/) | A dedicated "achievements" block, which maps to your certifications |
| [Shady Khalifa](https://github.com/shekohex) | Short, direct bullet summary; your GitHub profile README can mirror the site |

What the list lacks is a speaker angle. For that, the usual pattern on speaker sites is a speaker bio you can copy, a headshot download, a talks list with slides and recordings, and a "book me" button.

## Proposed site structure

One scrolling homepage with a sticky menu, plus a separate Speaking page once you have more than about ten talks. Sections in page order:

Because organisers and attendees come first, Speaking moves up to sit right after the hero, and the hero's main button is "Invite me to speak". About, experience and a LinkedIn link follow for recruiters; there is no CV download. Attendees get slides and recordings next to each talk.

1. **Hero**: your headshot, name, the line "Software Developer · Conference Speaker · Microsoft Certified" with your tagline under it, and buttons for "Invite me to speak" and "Connect on LinkedIn".
2. **Speaking**: "Talks I offer" cards with session abstracts, then a "Past talks" list with links to slides and recordings where you have them. Between them sits an "Upcoming talks" block, shown only while a talk is booked: the soonest one as a highlighted "Next up" banner, any later ones as rows below it. A talk moves to Past talks on its own once its date passes. Each talk is a Markdown file in `src/content/talks/` (`offers/`, `upcoming/`, `past/`), the same way articles are kept.
3. **About me**: a short bio in first person, then CV highlights: current role, years of experience, key employers or projects, core skills grouped by area (cloud, DevOps, .NET, etc.).
4. **Experience timeline**: 4 to 6 roles or milestones, newest first, with a link to LinkedIn for the full history. No CV download.
5. **Certifications**: badge grid with the certification name, issuer, date and a "verify" link to Microsoft Learn. Active certs first, older ones in a collapsed list.
6. **Articles**: the 3 latest articles on the homepage, linking to a full Articles page with tags (Azure, DevOps, .NET, AI) and an RSS feed. Each talk can link to a matching article.
7. **Open source / GitHub**: pinned repositories or recent activity, optional if your GitHub is mostly private.
8. **Contact and social**: icons for LinkedIn, Sessionize, GitHub, Instagram and Facebook, plus an email link or a simple contact form.

Site-wide features in version 1: the site is English only, and a light/dark mode toggle starts from the visitor's system setting and remembers their choice. Articles are written as simple Markdown files. Talks given in Croatian keep their original title with an English subtitle.

## Data sources and integrations

Certifications come from your Microsoft Learn transcript, because Credly no longer carries official Microsoft certifications. Sessions mostly cannot refresh themselves, because Sessionize's API belongs to event organisers, not speakers. So the plan is automatic where possible, and a small data file you or I update where not.

| Content | Source | How it reaches the site | Effort to keep current |
| --- | --- | --- | --- |
| Microsoft certifications | Your shared Microsoft Learn transcript | Build step reads the transcript; each badge links to it as proof. Fallback is a hand-kept list | None once set up |
| Other certifications (PSM I, PSPO I) | Scrum.org certificate links | Hand-kept entries in the certifications file | Only when you earn a new one |
| Upcoming and past sessions | Your Sessionize speaker profile | A sessions data file (event, date, title, slides, video), plus a link to the Sessionize profile | A few minutes per new talk |
| GitHub activity | GitHub public API | Pinned repos fetched at build time | None |
| Social profiles | Your profile URLs | Icon links in the header and footer | None |
| Instagram / Facebook feeds | Meta APIs need an app and tokens | Links only in version 1; embedded feeds are not worth the upkeep | None |

Notes:

- Sessionize's [API](https://sessionize.com/playbook/developers/api) is created per event on the organiser's API/Embed page, so there is no speaker-level feed. Your public speaker profile still lists your events, which is why we link to it and mirror it in a data file.
- The Microsoft Learn transcript page loads its data with JavaScript, so during build I will confirm the build step can read it. If not, we keep a certifications file and update it when you pass an exam or renew.
- Each talk entry can later grow a detail page with abstract, slides embed and recording.

## Tech stack and hosting

I recommend **Astro on Azure Static Web Apps (free tier), with the code in a GitHub repo**. It fits a Microsoft-certified profile, costs nothing beyond the domain, includes free HTTPS and a custom domain, and deploys on every push. A static site also stays fast and has nothing to patch.

| Option | Cost | Strengths | Trade-offs |
| --- | --- | --- | --- |
| **Astro + Azure Static Web Apps** (recommended) | Free hosting + domain (\~10–15 EUR/year) | Shows your Azure skills, GitHub Actions deploy, serverless function for a contact form | Slightly more setup; smaller free-tier bandwidth (100 GB/month) |
| **Astro + Cloudflare Pages** (strong alternative) | Free hosting + domain at cost via Cloudflare Registrar | Unlimited bandwidth on the free tier, fastest global CDN, DNS + domain + hosting in one dashboard, Pages Functions for a contact form, free privacy-friendly analytics | No Microsoft angle; free tier caps builds at 500/month (plenty for this site) |
| Astro + GitHub Pages | Free + domain | Simplest; lives next to your GitHub profile | No built-in backend for a contact form |
| Hugo + Netlify | Free + domain | Very fast builds | Go templates are less friendly to edit |
| No-code builder (Framer, Wix, Squarespace) | \~10–25 EUR/month | Edit visually with no code | Monthly fee, auto-updating certs and sessions is hard, less "IT pro" signal |

Azure versus Cloudflare comes down to message versus convenience. Azure says "Microsoft professional" to anyone who looks at how the site is built. Cloudflare is the easier one to run day to day, especially if you buy or move your domain there. The site code is identical for both, so we can switch later at no cost.

With the recommended setup, updates work like this: you edit a small text file for a new talk or bio change (or ask me to), the push rebuilds the site, and a nightly scheduled build refreshes your Microsoft Learn certifications and GitHub repos.

## Phased plan

Four phases, each ending with something you approve before the next starts. Time estimates assume you answer the questions within a few days.

1. **Research (this week)**: done on my side with this plan. Gate: you answer the questions below and send photos, CV and links.
2. **Proposal (about 1 week)**: I write the copy draft (bio, CV highlights, talk list), pick 2 visual directions, and build one clickable mock-up of the homepage. Gate: you choose a direction and approve the copy.
3. **Build (1 to 2 weeks)**: set up the repo and hosting, build all sections, wire up Microsoft Learn and GitHub, load the sessions file, add the articles section, the dark mode toggle, the contact form and SEO basics (page titles, social preview image, sitemap). Gate: you review a preview link on desktop and phone.
4. **Launch and handover (1 to 2 days)**: connect your domain with HTTPS, add privacy-friendly analytics if you want them, update your LinkedIn, Sessionize and GitHub profiles to point at the site, and leave a one-page "how to add a talk" guide.

After launch, upkeep is adding a line to the sessions file per talk; certifications update themselves.

## Content gathered so far

Your CV (July 2025 version) covers most of the About, Certifications and Speaking sections already. Private details in it (date of birth, home address, phone) will not appear on the site.

**About me draft points**

- 15+ years in software, from .NET developer (2009) to Senior Software Engineer at Syskit today; before that Lead Software Engineer at [GlobalLogic Croatia](https://www.globallogic.com/hr/) from 2021 (end date to confirm, likely mid-2025).
- Team leadership: remote team management, Scrum Master, PSM I and PSPO I certification trainer.
- Earlier roles: Development Team Lead at Agrivi (DevOps process, cloud architecture), Application Development Consultant at Comminus (Daimler projects, DevOps consulting), Lead Developer at Microlab (Diglas ERP).
- Core skills: C#, .NET Core, ASP.NET MVC, Azure, Azure DevOps, serverless and microservices, CI/CD and GitOps, SQL Server and EF Core.
- Education: Faculty of Organization and Informatics, Varaždin. Languages: Croatian, English (C1), German (B1).
- Personal touch: mountain biking, fitness, guitar.

**Talks from the CV** (newest first; I will check these against Sessionize)

| Year | Event | Talk |
| --- | --- | --- |
| 2024 | Advanced Technology Days 19, Zagreb | Dušo, AI će me zamijeniti |
| 2024 | Weblica, Čakovec | Battle of Titans: EF Core vs Dapper |
| 2022 | Advanced Technology Days 17, Zagreb | Troubles during migration: On-premise MongoDB on Azure Cosmos DB |
| 2020 | WinDays, Zagreb | Building The Pipeline |
| 2019 | Global Azure Bootcamp; ATD 15 | Enforcing Agile Teams with Azure DevOps |
| 2019 | NetWork, WinDays, Weblica | Building Cross-Platform Native Mobile Apps with NativeScript |
| 2018 | CrisCon; Change | Crazy little thing called Serverless |
| 2018 | WinDays; Weblica | A DevOps Guide for Developers; Azure Beyond Websites |
| 2017 | WinDays; Weblica; ATD 13 | Bite the Apple: EF Core on macOS; Continuous Delivery: A Roadmap To Failure; Azure Beyond Websites |

**Certifications to feature first**: Microsoft Certified: Azure Solutions Architect Expert, DevOps Engineer Expert, Azure Developer Associate, Microsoft 365 Fundamentals and Professional Scrum Master I (decided 5 Nov). The rest sit behind "show all"; MCP is a badge on the About me photo. Your Microsoft Learn profile is [kommandant-mark](https://learn.microsoft.com/en-us/users/kommandant-mark/).

**Files found in your Career folder**: a stage photo from Weblica 2024, two profile photos, badge images for DevOps Engineer Expert, Azure Solutions Architect Expert and PSM I, and your Microsoft Learn transcript PDF.

**Checked against [Sessionize](https://sessionize.com/marko-saric/)** (as of 4 Nov 2026):

- Current role confirmed: Senior Software Engineer at Syskit (as on Sessionize). The CV's GlobalLogic role becomes the previous one. No upcoming talks for now, so the Speaking section leads with "Talks I offer" and past talks, and the Upcoming talks block stays hidden until there is one (design chosen 6 Nov 2026: option C, next talk featured).
- No upcoming events are listed; the latest is Weblica 2024. Advanced Technology Days 17 and 19 and Change 2018 are in the CV but not on Sessionize.
- Sessionize has sessions the CV lacks: "From Prompts to Purpose: Architecting Agentic AI in the Azure Cloud", "Well-being developer after 40", "Where Code Ends Logic Apps Starts", "Demistifikacija Azure Cosmos DB" and others. The Speaking section can show these as "Talks I offer" for organisers.

## Questions for you

Answer in the thread, in comments here, or by uploading files. The first group is all I need to start the proposal; the rest can follow.

**Needed to start the proposal**

- [x] Your full name and title. Answered: Marko Šarić · "Software Developer | Conference Speaker | Microsoft Certified Professional | Technology Enthusiast | Building Solutions & Sharing Knowledge". Proposed hero line: "Software Developer · Conference Speaker · Microsoft Certified", with the rest as the tagline under it.
- [x] Your CV and LinkedIn. Answered: CV from the Career folder (July 2025), LinkedIn linkedin.com/in/saricmarko.
- [x] Profile URLs. Answered: facebook.com/kommandant.mark, instagram.com/kommandant.mark, sessionize.com/marko-saric, github.com/markosaric, learn.microsoft.com/en-us/users/kommandant-mark, linkedin.com/in/saricmarko.
- [x] Your Microsoft Learn transcript link. Answered: transcript learn.microsoft.com/en-us/users/kommandant-mark/transcript/vpm4wimo29n83em.
- [x] Photos. Answered: studio headshot from 2024 for the hero, blue-background portrait for About me, and the on-stage photo from Advanced Technology Days 15 for Speaking.
- [x] Audience. Answered: conference organisers and attendees first, then employers and recruiters.

**Content**

- [x] Which 3 to 5 CV points matter most (roles, projects, numbers you are proud of)?
- [x] Which certifications to feature, and should expired ones show? Answered: first five are Azure Solutions Architect Expert, DevOps Engineer Expert, Azure Developer Associate, Microsoft 365 Fundamentals and Professional Scrum Master I, then Azure AI Fundamentals and Azure Fundamentals, then the older MCSE, MCSD, MCSA, HTML5 and MTA logos behind "show all" (15 in total, no "retired" label). MCP appears as a badge on the About me photo.
- [x] Talks: are all past talks on Sessionize, or are some missing? Do you have slides or recordings to link?
- [x] Any upcoming talks already confirmed? Answered: none for now, so the Upcoming block stays hidden.
- [x] Awards or community roles (for example MVP, user group lead, MCT) to highlight?
- [x] Language. Answered: English only, including articles. Open: do you have existing articles (LinkedIn, Medium, dev.to) to bring over?

**Style and setup**

- [ ] Do you own a domain already? If not, which name do you want (for example yourname.com or yourname.dev)?
- [x] 2 or 3 websites you like the look of, from the list or elsewhere, and anything you dislike. Answered: out of five design directions, you chose Keynote (5 Nov).
- [x] Colour or brand preferences: a personal logo, colours, light or dark look? Answered: the Keynote palette (navy with a blue accent), a light/dark toggle, header.jpg as the hero background, and a circular headshot with a vignette. No personal logo.
- [ ] Contact: show your email, a contact form, or both?
- [ ] Hosting: Azure Static Web Apps or Cloudflare Pages? If your domain is already on Cloudflare, that tips it to Cloudflare.
- [x] Do you have a GitHub account I should create the site repo under, so you own it? Answered: private repo github.com/markosaric/personalweb (5 Nov).
