#!/usr/bin/env node
/* Regenerates hero-map.js: simplified water and coastline for the hero map,
   from OpenStreetMap via the Overpass API (data © OpenStreetMap contributors, ODbL).
   Usage: node make-hero-map.js        (needs network; takes a minute or two)
   Only needed if the map frame (BBOX below) or the styling of the geometry changes. */
"use strict";
const fs = require("fs");
const path = require("path");
const UA = "bostonlongevity-hub map build (hello@bostonlongevity.org)";
const QUERIES = [
  '[out:json][timeout:150][maxsize:268435456];(way["natural"="coastline"](42.30,-71.40,42.43,-70.98);way["natural"="water"]["water"!="pond"](42.31,-71.40,42.42,-71.00););out geom;',
  '[out:json][timeout:150][maxsize:268435456];(relation["natural"="water"](42.31,-71.40,42.42,-71.00););out geom;'
];
async function overpass(q) {
  const r = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", headers: { "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded" }, body: "data=" + encodeURIComponent(q) });
  const text = await r.text();
  if (!text.startsWith("{")) throw new Error("Overpass did not return JSON (server busy?):\n" + text.slice(0, 300));
  return JSON.parse(text);
}
(async () => {
const d = { elements: [] }; const seen = new Set();
for (const q of QUERIES) {
  process.stderr.write("Querying Overpass…\n");
  for (const e of (await overpass(q)).elements) if (!seen.has(e.type + e.id)) { seen.add(e.type + e.id); d.elements.push(e); }
}
// ---- projection: Web Mercator into a 1000-wide viewBox ----
const BBOX = { w: -71.37, e: -71.03, s: 42.318, n: 42.402 };
const W = 1000;
const my = (lat) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const H = Math.round((W * (my(BBOX.n) - my(BBOX.s))) / (BBOX.e - BBOX.w) / (Math.PI / 180) * 1e4) / 1e4;
const proj = (lat, lon) => [((lon - BBOX.w) / (BBOX.e - BBOX.w)) * W, ((my(BBOX.n) - my(lat)) / (my(BBOX.n) - my(BBOX.s))) * H];
// ---- simplify (Douglas–Peucker) ----
function dp(pts, tol) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]]; let maxD = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i]; const dx = b[0] - a[0], dy = b[1] - a[1];
    const t = dx || dy ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy) : 0;
    const q = [a[0] + Math.max(0, Math.min(1, t)) * dx, a[1] + Math.max(0, Math.min(1, t)) * dy];
    const dist = Math.hypot(p[0] - q[0], p[1] - q[1]); if (dist > maxD) { maxD = dist; idx = i; }
  }
  if (maxD <= tol) return [a, b];
  return dp(pts.slice(0, idx + 1), tol).slice(0, -1).concat(dp(pts.slice(idx), tol));
}
const area = (r) => Math.abs(r.reduce((s, p, i) => { const q = r[(i + 1) % r.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2);
const toPath = (r) => "M" + r.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L");
// ---- assemble rings from relation outer/inner ways ----
function rings(members) {
  const segs = members.map((m) => m.geometry.map((g) => [g.lat, g.lon])); const out = [];
  while (segs.length) {
    let ring = segs.shift(); let grew = true;
    while (grew && !(ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1])) {
      grew = false; const end = ring[ring.length - 1];
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i], f = s[0], l = s[s.length - 1];
        if (f[0] === end[0] && f[1] === end[1]) { ring = ring.concat(s.slice(1)); segs.splice(i, 1); grew = true; break; }
        if (l[0] === end[0] && l[1] === end[1]) { ring = ring.concat(s.slice().reverse().slice(1)); segs.splice(i, 1); grew = true; break; }
      }
    }
    out.push(ring);
  }
  return out;
}
const TOL = 0.9, MIN_AREA = 25; // viewBox units
let waterOuter = [], waterInner = [], coast = [];
for (const e of d.elements) {
  if (e.type === "way" && e.tags && e.tags.natural === "coastline") coast.push(e.geometry.map((g) => proj(g.lat, g.lon)));
  else if (e.type === "way" && e.tags && e.tags.natural === "water" && e.geometry) {
    const r = e.geometry.map((g) => proj(g.lat, g.lon)); if (area(r) >= MIN_AREA) waterOuter.push(r);
  } else if (e.type === "relation" && e.members) {
    for (const role of ["outer", "inner"]) {
      const ms = e.members.filter((m) => m.type === "way" && m.role === role && m.geometry);
      for (const ring of rings(ms)) { const r = ring.map((p) => proj(p[0], p[1])); if (area(r) >= MIN_AREA) (role === "outer" ? waterOuter : waterInner).push(r); }
    }
  }
}
const clip = (r) => r; // keep everything; the SVG clips to the viewBox
const simp = (rs) => rs.map((r) => dp(r, TOL)).filter((r) => r.length > 2);
waterOuter = simp(waterOuter); waterInner = simp(waterInner); coast = coast.map((r) => dp(r, TOL)).filter((r) => r.length > 1);
const water = waterOuter.map((r) => toPath(r) + "Z").join("") + waterInner.map((r) => toPath(r) + "Z").join("");
const coastD = coast.map(toPath).join("");
const out = `// Simplified water and coastline for the hero map. Generated from OpenStreetMap data (© OpenStreetMap contributors, ODbL).
// Projection: Web Mercator over bbox ${JSON.stringify(BBOX)} into a ${W}×${H} viewBox.
const HERO_MAP = {
  bbox: ${JSON.stringify(BBOX)}, width: ${W}, height: ${H},
  water: "${water}",
  coast: "${coastD}"
};
`;
fs.writeFileSync(path.join(__dirname, "hero-map.js"), out);
console.log({ elements: d.elements.length, outer: waterOuter.length, inner: waterInner.length, coast: coast.length, bytes: out.length, H });
})().catch((e) => { console.error(e.message); process.exit(1); });
