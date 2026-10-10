# Marvin Lirio — Portfolio

Personal portfolio and interactive resume showcasing my background in quality engineering, technical compliance, systems delivery, automation, and AI-assisted software development.

**Live site:** https://marvin-lirio.github.io/resume-portfolio/  
**Repository:** https://github.com/marvin-lirio/resume-portfolio

## About

This project began as a static HTML resume and has evolved into a responsive, interactive portfolio. It presents my professional experience alongside independent development work and tools built throughout my career.

The site is also a practical development exercise: define requirements, implement functionality, review the result, test interactions, refine the design, and deploy changes. My quality engineering background informs that process.

## Technology

- HTML5, CSS3, and vanilla JavaScript
- Git and GitHub for version control
- GitHub Pages for static hosting
- AI-assisted development for implementation and iteration

The site does not use a frontend JavaScript framework.

## Features

- Responsive layouts for desktop, tablet, and mobile
- Dark/light themes, system preference support, and saved theme selection
- Interactive career timeline and expandable role details
- Selected Work decks with animated navigation, selectable rear cards, and expandable project details
- Dynamic project-card stacking for **2–5 projects per deck**, including progressively fanned rear cards and visible numbered corners
- Separate decks for **Independent & Contract Development** and **Career-Built Tools & Automation**
- The current published-content baseline contains **2 independent projects and 3 career-built projects**; additional card counts were tested with temporary placeholders, not published as actual work
- Custom visual assets and theme-aware artwork
- Beyond Work carousel, scroll reveals, active navigation indicators, and responsive navigation
- Keyboard and reduced-motion considerations across interactive components
- Contact links to email, LinkedIn, and GitHub

## Selected Work — Card Deck Behavior

Each deck displays one face-up project and up to four face-down projects. The remaining cards rotate through the stack as the active project changes. Both decks use distinct, intentionally arranged fan directions.

The card system was tested with **4 independent / 5 career-built** and **5 independent / 4 career-built** configurations. Following visual review and approval, temporary test cards were removed and the original **2 / 3** project counts were restored without reverting the multi-card behavior.

These tests validate the approved desktop layouts; they do not replace a full post-deployment browser and mobile regression pass.

## Project Structure

```text
resume-portfolio/
├── index.html       # Site markup and portfolio content
├── styles.css       # Themes, layout, visual design, and card stacks
├── app.js           # Interactive behavior and deck navigation
├── assets/          # Images and other visual assets
│   └── images/
└── README.md
```

The repository should use the top-level files as its authoritative site source. A duplicate `root/` directory is not required for deployment.

## Development Approach

AI is used as an implementation and problem-solving tool. I remain responsible for requirements, design direction, review, testing, and acceptance of the final behavior.

1. **Define** — establish requirements and intended behavior.
2. **Direct** — use AI-assisted development to explore and implement solutions.
3. **Understand** — inspect the resulting HTML, CSS, and JavaScript.
4. **Validate** — check functionality, responsive behavior, and edge cases.
5. **Iterate** — refine issues found during review.
6. **Ship** — version changes and deploy through GitHub Pages.

**Guiding principle:** *AI accelerates the code. I own the outcome.*

## Local Preview

Clone or download the repository, then open `index.html` in a browser. Keep the `assets/` directory alongside the site files so referenced artwork loads correctly. For a local HTTP preview, run a static development server from the repository directory.

## Deployment & Validation

The site is hosted on GitHub Pages. Before deploying, confirm that the authoritative `index.html`, `styles.css`, `app.js`, and `assets/` directory are included in the commit. After deployment, verify navigation, theme switching, image loading, project-deck rotation and expansion, keyboard interactions, and desktop/mobile layouts.

## Status

Active portfolio project. The current update finalizes the Selected Work multi-card deck behavior while preserving the existing 2-independent / 3-career-built project content.
