# Hamza Syed - Portfolio

Personal portfolio site for [Hamza Syed](https://www.linkedin.com/in/hamza-syed), a Business Technologist studying at Toronto Metropolitan University. Built with React, TypeScript, Vite, and Tailwind CSS.

## Tech stack

- **Framework:** React 18 + TypeScript, built with Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Icons:** Lucide React
- **Contact form:** Formspree (with a `mailto:` fallback if unconfigured)

## Getting started

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

| Script              | Purpose                       |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start the local dev server     |
| `npm run typecheck` | Run TypeScript in check mode   |
| `npm run lint`      | Run ESLint                     |
| `npm run build`     | Production build to `dist/`    |
| `npm run preview`   | Preview the production build   |

## Project structure

```
src/
  components/   Reusable UI pieces (Navbar, Footer, Timeline, CyclingSkills, etc.)
  data/         Content: site.ts (bio, skills, experience) and projects.ts (case studies)
  pages/        One file per route (Home, About, Work, ProjectDetail, Contact, NotFound)
  index.css     Design tokens (colors, fonts) and global styles
public/
  projects/     Project cover images
  photo.jpg     Headshot, used on Home and About
```

## Editing content

Almost everything on the site is data-driven from two files, no need to touch
page components for routine updates:

- **`src/data/site.ts`**: name, title, bio, socials, skills, principles,
  experience timeline, and contact page copy.
- **`src/data/projects.ts`**: each entry becomes a case-study page at
  `/work/<slug>` automatically (`summary`, `problem` / `approach` / `outcome`,
  `cover` / `gallery` images, `liveUrl` / `repoUrl`, `status`, `domain`).

To swap images: replace the file at the same path (`public/photo.jpg`, files
under `public/projects/`) rather than renaming, so no code needs to change.

### Contact form

The form posts to [Formspree](https://formspree.io). To enable it:

1. Create a form at formspree.io and copy the form ID (the part after `/f/`
   in the endpoint it gives you).
2. Paste it into `contact.formspreeId` in `src/data/site.ts`.

Until that's set, the form falls back to opening the visitor's email client
with the message pre-filled.

## Deployment

The site is a static build (`npm run build` → `dist/`), deployable anywhere
that serves static files (Vercel, Netlify, GitHub Pages, etc.). It uses
client-side routing, so the host needs to rewrite all paths to `index.html`
(a single-page app fallback) for direct links like `/work/clinder` to work.

After deploying, update the placeholder domain in `public/robots.txt` and
`public/sitemap.xml`.

## License

Personal project, all rights reserved.
