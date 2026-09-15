#!/usr/bin/env node
/* Prerender the event lists and directory into index.html so that search
   engines and crawlers that do not run JavaScript still see the content.
   Usage:  node build.js            (renders as of today)
           node build.js 2026-10-07 (renders as of that day)
   The browser re-renders everything on load, so the page stays live. */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dir = __dirname;
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(dir, "data.js"), "utf8") + "\nthis.SITE = SITE; this.EVENTS = EVENTS; this.PLACES = PLACES;", ctx);
const R = require(path.join(dir, "render.js"));

const NOW = /^\d{4}-\d{2}-\d{2}$/.test(process.argv[2] || "") ? process.argv[2] : R.iso(new Date());
const events = R.prepareEvents(ctx.EVENTS, NOW);
const places = R.preparePlaces(ctx.PLACES);
const upcoming = events.filter((e) => !e.isPast);

const blocks = {
  anchors: R.anchors(events, ctx.SITE.week),
  featured: R.featured(events, ctx.SITE.week),
  program: R.program(events, ctx.SITE.week),
  grid: R.calendarGrid(upcoming, NOW),
  rows: R.eventRows(upcoming),
  community: R.community(places),
  contact: ctx.SITE.contactEmail ? 'Questions? Write to <a href="mailto:' + R.esc(ctx.SITE.contactEmail) + '">' + R.esc(ctx.SITE.contactEmail) + "</a>." : ""
};

const file = path.join(dir, "index.html");
let html = fs.readFileSync(file, "utf8");
let missing = [];
for (const [name, content] of Object.entries(blocks)) {
  const re = new RegExp("(<!-- build:" + name + " -->)[\\s\\S]*?(<!-- /build:" + name + " -->)");
  if (!re.test(html)) { missing.push(name); continue; }
  html = html.replace(re, (m, open, close) => open + "\n" + content + "\n" + close);
}
fs.writeFileSync(file, html);
console.log("index.html prerendered as of " + NOW + ": " + events.length + " events (" + upcoming.length + " upcoming), " + places.length + " community entries.");
if (missing.length) console.warn("Markers not found in index.html: " + missing.join(", "));
