# Keynote design

The approved homepage design, exported from the design canvas on 5 Nov 2026.

- `keynote.dc.html`: the design source. It holds the markup, the light and dark themes, and the content data: talks, past talks, jobs and certifications. It is a canvas component, so it won't open as a normal web page. Use it as the reference when building the Astro components.
- `canvas.json`: the canvas layout.
- `assets/`: every image the design uses.

## Image map

The design references images as `/_blob/<id>`. This table shows the local file for each one.

| Blob id | File |
| --- | --- |
| `ad63537c7b225fbd3853059a070afb2b` | `assets/photos/header.jpg` |
| `91d9b8565c8853b1b47db5621c5dbb25` | `assets/photos/headshot.jpg` |
| `993c451d655edee90cd3a08bea28b0a2` | `assets/certifications/azure-solutions-architect-expert.png` |
| `53c2a8fefa84e4868a2932d8d5f04cd7` | `assets/certifications/devops-engineer-expert.png` |
| `36354f0b827c87b7963e5d1bdccb9636` | `assets/certifications/azure-developer-associate.png` |
| `18d7ca52065068b0bcfa1f4e85ce5a7a` | `assets/certifications/microsoft-365-fundamentals.png` |
| `0dbd7f78d9797166fb0407d5bc6539db` | `assets/certifications/azure-ai-fundamentals.png` |
| `94cb1ad0efdb478db0d3f0d55995ef95` | `assets/certifications/azure-fundamentals.png` |
| `23b5df0879f5c830a74ca511883c747f` | `assets/certifications/professional-scrum-master-i.png` |
| `0e60c156905c7b89a1a7907af98dc259` | `assets/certifications/mcse-cloud-platform-infrastructure.png` |
| `943dff86fc65cf6692bdefec563e04d9` | `assets/certifications/mcsd-app-builder.png` |
| `bef1f774729a5afdc72eca24fc950d3b` | `assets/certifications/mcsd-application-lifecycle-management.png` |
| `190c5d671d1aad5c8b39d22dc1a9b92e` | `assets/certifications/mcsd-web-applications.png` |
| `1857fd41878e9989eaeb04ba423e12ea` | `assets/certifications/mcsa-cloud-platform.png` |
| `3fa6317c6d3b22fe6366b468b66c037d` | `assets/certifications/mcsa-web-applications.png` |
| `dc1f0a274a205c6a6d872914aee0e7e0` | `assets/certifications/specialist-html5-javascript-css3.png` |
| `5c2b0e212fdb73decff60509d160985b` | `assets/certifications/mta-software-development-fundamentals.png` |
| `5a64759dd2124100989ccc2b47e4109a` | `assets/certifications/microsoft-certified-professional.png` (photo badge) |

`portrait-blue.jpg` and `stage-atd15.jpg` aren't used in the design yet. They're here for later pages.

The older logos (MCSE, MCSD, MCSA, HTML5, MTA, MCP) are black on a transparent background. In dark mode the design inverts them with `filter: invert(1) hue-rotate(180deg)`.
