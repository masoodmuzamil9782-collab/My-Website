# Muzamil Masood — Portfolio (Strategies by Maddy)

A one-of-one, cinematic portfolio site: dark + electric blue, a live WebGL hero
(particle field + distorted signal orb with bloom), smooth scrolling,
magnetic buttons, a custom cursor, scroll-scrubbed reveals and animated stats.

Built with **Vite + Three.js + GSAP + Lenis**. No framework, no backend.

---

## 1. Run it locally

You need [Node.js](https://nodejs.org) 18+ (you have v24 — good).

```bash
npm install      # first time only
npm run dev      # opens http://localhost:5173 with live reload
```

## 2. Build for the web

```bash
npm run build    # creates the dist/ folder
npm run preview  # preview the built site locally
```

The `dist/` folder is the whole website. Deploy it anywhere:

| Host | How |
| --- | --- |
| **Netlify** | drag the `dist` folder onto https://app.netlify.com/drop |
| **Vercel** | `npx vercel` in this folder, or connect the repo (build: `npm run build`, output: `dist`) |
| **GitHub Pages** | push `dist` to a `gh-pages` branch (set `base` in `vite.config.js` to `'/<repo-name>/'` first) |
| **Cloudflare Pages** | build command `npm run build`, output dir `dist` |

---

## 3. Edit the content — ONE file

Everything you'll want to change (name, bio, stats, projects, skills,
certificates, email, social links, timezone) lives in:

```
src/content.js
```

Open it in any text editor. Each block is labelled and commented.
Save the file and the site updates instantly while `npm run dev` is running.

## 4. Add Maddy's photo

There is already a placeholder at `public/portrait.jpg`. **Replace that file**
with Maddy's photo, keeping the exact same name:

```
public/portrait.jpg      <- overwrite this with the real photo
```

A vertical / portrait crop around 4:5 works best (e.g. 1000×1250px). The photo is
shown grayscale with a blue wash and returns to full colour on hover — that's the
intended look, no editing needed. Re-run `npm run build` after swapping it in.

Prefer PNG? Save it as `public/portrait.jpg` anyway (only the filename matters).

## 5. Optional polish

- **Favicon / social share image** — replace `public/favicon.svg` and
  `public/social-card.svg` (or swap the `.svg` for a `.png` and update the
  paths in `index.html`).
- **Accent colours** — `src/styles/main.css`, `:root { --accent: #2f6bff; ... }`
  block near the top. (Also `COL_A/COL_B/COL_C` in `src/three/scene.js` for the 3D.)
- **Reduce motion** — there's a "reduce motion" toggle in the footer;
  the site also fully respects the OS "reduce motion" setting (WebGL off,
  instant reveals).

---

## Project map

```
index.html              markup + section structure
src/
  content.js            <-- YOU EDIT THIS
  main.js               boot sequence
  styles/main.css       design system + every section
  three/scene.js        the WebGL hero (particles + orb + bloom)
  modules/
    render.js           builds the DOM from content.js
    preloader.js         0→100 intro
    scroll.js           Lenis smooth scroll + ScrollTrigger sync
    cursor.js           custom cursor
    animations.js       hero reveal, scramble, counters, marquee
    interactions.js     magnetic / tilt / accordions / slider / clock
public/
  portrait.jpg          <-- OVERWRITE with Maddy's photo (keep this filename)
  favicon.svg
  social-card.svg
  portrait-placeholder.svg   (source for the placeholder; safe to ignore)
```

## Browser support

Modern evergreen browsers. Older browsers and reduced-motion users get a
clean gradient fallback instead of WebGL — the site stays fully readable.
