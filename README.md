# Menahil Fatima: Portfolio

A celestial, Netflix-style portfolio. Live at **https://menahilfatima.vercel.app**

Plain HTML, CSS and JavaScript with no build step. Vercel deploys `main` automatically.

## Structure

```
index.html              The whole page (landing, sections, episode modal)
assets/
  css/style.css         All styles, animation utilities and poster keyframes
  js/data.js            Seasons and episodes (the content). Edit this to add work.
  js/posters.js         One animated SVG poster per episode
  js/script.js          Starfield, reveals, nav, season rows, episode modal
  images/logo/          Logo mark, app icon and favicons
  cv/menahil-cv.pdf     Downloadable CV
docs/                   Not deployed (see .vercelignore)
  content/              Source copy for the site
  wireframes/           Original screen wireframes
  reference/            Earlier PDF and extraction script
  archive/images/       Retired images
```

## Common edits

- **Add an episode:** add an entry to `EPISODES` in `assets/js/data.js`, then add its id to a season in `SEASONS`.
  Give it a poster in `assets/js/posters.js` (same id), or it falls back to a generated planet poster.
- **Change the featured banner:** set `FEATURED` at the bottom of `assets/js/data.js`.
- **Replace the CV:** overwrite `assets/cv/menahil-cv.pdf`.

## Run locally

```
python -m http.server 5500
```

Then open http://127.0.0.1:5500
