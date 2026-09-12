# Boston Longevity Hub — v2

Static version of the site: `index.html`, `style.css`, `app.js` and `data.js`. No build step.
To open it locally, just double-click `index.html` (the map and fonts are loaded from the network).

## How to update

All content lives in a single file — **`data.js`**:

- `SITE` — tagline, contact e-mail, links to forms, map center.
- `EVENTS` — events. One entry = one `{ ... }` object. Fields are described in a comment in the file.
  `featured: true` highlights key events, `draft: true` hides an entry.
- `PLACES` — labs, companies and organizations (`type: "lab" | "company" | "organization"`).

The order of entries doesn't matter: the site sorts events by date and the directory by name.
The "Add to calendar" button builds an `.ics` file from `EVENTS` automatically.

To preview how the site looks on a specific day: `index.html?today=2026-10-07`.

## Publishing

Put the contents of the folder in the root of a repository and enable GitHub Pages (Deploy from a branch, `/ (root)`),
or upload the folder to any static hosting.
