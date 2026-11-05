export const profile = {
  name: 'Marko Šarić',
  headline: 'Software Developer · Conference Speaker · Microsoft Certified',
  tagline:
    'Technology enthusiast building solutions and sharing knowledge. Senior Software Engineer at Syskit, speaking about Azure, DevOps, .NET and AI since 2017.',
  description:
    'Marko Šarić: Senior Software Engineer at Syskit, conference speaker and Microsoft Certified Professional. Talks on Azure, DevOps, .NET and AI.',
  about:
    'I started as a .NET developer in 2009 and have since led teams, run Scrum, and designed DevOps processes and cloud architecture on Azure. Today I am a Senior Software Engineer at Syskit in Zagreb. Off the keyboard: mountain biking, fitness and guitar.',
  /** Used for the "years in software" figure, computed at build time. */
  careerStartYear: 2009,
  linkedin: 'https://www.linkedin.com/in/saricmarko/',
  sessionize: 'https://sessionize.com/marko-saric/',
  learnTranscript: 'https://learn.microsoft.com/en-us/users/kommandant-mark/transcript/vpm4wimo29n83em',
};

export const socials = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/saricmarko/' },
  { name: 'Sessionize', url: 'https://sessionize.com/marko-saric/' },
  { name: 'GitHub', url: 'https://github.com/markosaric' },
  { name: 'Instagram', url: 'https://www.instagram.com/kommandant.mark/' },
  { name: 'Facebook', url: 'https://www.facebook.com/kommandant.mark' },
];

export const yearsInSoftware = new Date().getFullYear() - profile.careerStartYear;
