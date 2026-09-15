# Boston Longevity Hub

Static site: `index.html`, `style.css`, `render.js`, `app.js`, `data.js`, `hero-map.js`, plus `build.js` (prerender step).
To open it locally, double-click `index.html` (the map and fonts are loaded from the network).

## How to update

All content lives in a single file — **`data.js`**:

- `SITE` — tagline, contact e-mail, sign-up / submission form links, map center, and the `week` block
  that defines Boston Longevity Week (dates, "and beyond" window, intro text).
- `EVENTS` — events. One entry = one `{ ... }` object; fields are described in a comment in the file.
  `host` is required and is shown as "Organized by" on every card, so that nobody assumes the Hub runs the event.
  `featured: true` marks the anchor events of the Week (large map marker, highlighted card); `draft: true` hides an entry.
- `PLACES` — companies and organizations in the Community directory (`type: "company" | "organization" | "lab"`).
  Research labs are deliberately not listed yet.

The order of entries doesn't matter: the site sorts events by date and the directory by name.
The "Add all to my calendar" button builds an `.ics` file from `EVENTS` automatically.

**After editing `data.js`, run `node build.js`.** This writes the event program, calendar, and directory
into `index.html` as static HTML so search engines and link previews see real content (the browser
still re-renders everything live on load, so the site works without this step, just with empty markup for crawlers).

To preview the site as of a specific day: `index.html?today=2026-10-07`.

## Activating "Join" and submissions

In `SITE`, fill in one or more of:

- `joinFormUrl` — a mailing-list sign-up page (Google Form, Buttondown, Mailchimp…); the Join form sends people there.
- `contactEmail` — used as a fallback for Join (opens a pre-filled e-mail) and shown as the contact address.
- `eventFormUrl`, `placeFormUrl` — forms for submitting an event or adding a group; every
  "Submit an event" / "Add your group" link points there when set, and to the Join section otherwise.

## Hero map

The dark panel on the first screen has a simplified map of Boston behind it (`hero-map.js`: water and
coastline from OpenStreetMap, already generated and committed). Event and organization dots are placed on it
from `data.js` at load time, so nothing needs regenerating when events change. Only if you want to change the
map frame or the level of detail, edit `BBOX` / `TOL` in `make-hero-map.js` and run `node make-hero-map.js`
(downloads from the Overpass API, takes a minute or two). The map is hidden on screens narrower than 900px.

## Publishing

Put the contents of the folder in the root of a repository and enable GitHub Pages (Deploy from a branch, `/ (root)`),
or upload the folder to any static hosting.
