import type { ImageMetadata } from 'astro';

import solutionsArchitect from '../assets/certifications/azure-solutions-architect-expert.png';
import devopsExpert from '../assets/certifications/devops-engineer-expert.png';
import azureDeveloper from '../assets/certifications/azure-developer-associate.png';
import m365Fundamentals from '../assets/certifications/microsoft-365-fundamentals.png';
import aiFundamentals from '../assets/certifications/azure-ai-fundamentals.png';
import azureFundamentals from '../assets/certifications/azure-fundamentals.png';
import psm1 from '../assets/certifications/professional-scrum-master-i.png';
import mcseCloud from '../assets/certifications/mcse-cloud-platform-infrastructure.png';
import mcsdAppBuilder from '../assets/certifications/mcsd-app-builder.png';
import mcsdAlm from '../assets/certifications/mcsd-application-lifecycle-management.png';
import mcsdWeb from '../assets/certifications/mcsd-web-applications.png';
import mcsaCloud from '../assets/certifications/mcsa-cloud-platform.png';
import mcsaWeb from '../assets/certifications/mcsa-web-applications.png';
import html5 from '../assets/certifications/specialist-html5-javascript-css3.png';
import mta from '../assets/certifications/mta-software-development-fundamentals.png';

export interface Certification {
  name: string;
  issuer?: string;
  image: ImageMetadata;
  /**
   * "badge": a colour badge shown with its name and issuer.
   * "logo": an older black-on-transparent Microsoft logo that already carries
   * the title; it is shown on its own and inverted in dark mode.
   */
  kind: 'badge' | 'logo';
  /** Short name used in the logo's alt text. */
  abbr?: string;
}

/** Display order. The first five show on the homepage; the rest sit behind "Show all". */
export const certifications: Certification[] = [
  { name: 'Azure Solutions Architect Expert', issuer: 'Microsoft', image: solutionsArchitect, kind: 'badge' },
  { name: 'DevOps Engineer Expert', issuer: 'Microsoft', image: devopsExpert, kind: 'badge' },
  { name: 'Azure Developer Associate', issuer: 'Microsoft', image: azureDeveloper, kind: 'badge' },
  { name: 'Microsoft 365 Fundamentals', issuer: 'Microsoft', image: m365Fundamentals, kind: 'badge' },
  { name: 'Azure AI Fundamentals', issuer: 'Microsoft', image: aiFundamentals, kind: 'badge' },
  { name: 'Azure Fundamentals', issuer: 'Microsoft', image: azureFundamentals, kind: 'badge' },
  { name: 'Professional Scrum Master I', issuer: 'Scrum.org', image: psm1, kind: 'badge' },
  { name: 'Solutions Expert: Cloud Platform and Infrastructure', abbr: 'MCSE', image: mcseCloud, kind: 'logo' },
  { name: 'Solutions Developer: App Builder', abbr: 'MCSD', image: mcsdAppBuilder, kind: 'logo' },
  { name: 'Solutions Developer: Application Lifecycle Management', abbr: 'MCSD', image: mcsdAlm, kind: 'logo' },
  { name: 'Solutions Developer: Web Applications', abbr: 'MCSD', image: mcsdWeb, kind: 'logo' },
  { name: 'Solutions Associate: Cloud Platform', abbr: 'MCSA', image: mcsaCloud, kind: 'logo' },
  { name: 'Solutions Associate: Web Applications', abbr: 'MCSA', image: mcsaWeb, kind: 'logo' },
  { name: 'Specialist: Programming in HTML5 with JavaScript and CSS3', abbr: 'HTML5', image: html5, kind: 'logo' },
  { name: 'Technology Associate: Software Development Fundamentals', abbr: 'MTA', image: mta, kind: 'logo' },
];
