/* Boston Longevity Hub. Content lives in data.js, markup in render.js;
   this file wires up the page: rendering, calendar, search, map, join form. */
(function () {
  "use strict";
  var R = Render;

  // Open the page with ?today=2026-10-07 to preview it as of that day.
  function todayISO() {
    var forced = new URLSearchParams(location.search).get("today");
    if (forced && /^\d{4}-\d{2}-\d{2}$/.test(forced)) return forced;
    return R.iso(new Date());
  }
  var NOW = todayISO();
  function el(id) { return document.getElementById(id); }
  function esc(s) { return R.esc(s); }

  var events = R.prepareEvents(EVENTS, NOW);
  var places = R.preparePlaces(PLACES);
  var week = SITE.week;

  // ---------- forms & contact: point every "submit / add" link at the configured form ----------
  document.querySelectorAll("[data-form]").forEach(function (a) {
    var url = SITE[a.dataset.form];
    if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
    else if (SITE.contactEmail) { a.href = "mailto:" + SITE.contactEmail + "?subject=" + encodeURIComponent(a.textContent.trim() + " — Boston Longevity Hub"); }
  });
  document.querySelectorAll("[data-form-note]").forEach(function (n) {
    if (SITE[n.dataset.formNote]) return;
    n.textContent = SITE.contactEmail ? "Opens an e-mail to " + SITE.contactEmail + "." : "The submission form opens shortly.";
  });
  if (SITE.contactEmail) el("contact").innerHTML = 'Questions? Write to <a href="mailto:' + esc(SITE.contactEmail) + '">' + esc(SITE.contactEmail) + "</a>.";

  // Join form: a mailing-list form if one is configured, otherwise an e-mail to the contact address.
  var joinForm = el("join-form"), joinNote = el("join-note");
  if (SITE.joinFormUrl) {
    joinForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var u = new URL(SITE.joinFormUrl, location.href);
      u.searchParams.set(SITE.joinEmailParam || "email", el("join-email").value.trim());
      window.open(u.toString(), "_blank", "noopener");
    });
  } else if (SITE.contactEmail) {
    joinForm.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = el("join-email").value.trim();
      location.href = "mailto:" + SITE.contactEmail + "?subject=" + encodeURIComponent("Join the Boston longevity community") +
        "&body=" + encodeURIComponent("Please add me to the Boston Longevity Hub list.\n\nEmail: " + email + "\nName: \nAffiliation: ");
    });
    joinNote.textContent = "Opens an e-mail to " + SITE.contactEmail + ".";
  } else {
    joinForm.hidden = true;
    joinNote.textContent = "E-mail sign-up is being set up and will open here shortly.";
  }

  // ---------- hero + week program ----------
  el("week-anchors").innerHTML = R.anchors(events, week);
  el("featured-list").innerHTML = R.featured(events, week);
  el("program").innerHTML = R.program(events, week);

  // ---------- calendar: month grid + compact rows, upcoming / past ----------
  var when = "upcoming";
  function renderCalendar() {
    var list = events.filter(function (e) { return when === "past" ? e.isPast : !e.isPast; });
    if (when === "past") list = list.slice().reverse();
    el("month-grid").innerHTML = R.calendarGrid(list, NOW);
    el("month-grid").hidden = !list.length;
    el("event-rows").innerHTML = list.length ? R.eventRows(list)
      : '<p class="empty">' + (when === "past" ? "No past events listed yet." : "Nothing scheduled at the moment. Know of an event? Tell us below.") + "</p>";
  }
  el("when").addEventListener("click", function (ev) {
    var btn = ev.target.closest("button.chip");
    if (!btn) return;
    when = btn.dataset.when;
    el("when").querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", c === btn ? "true" : "false"); });
    renderCalendar();
  });
  renderCalendar();
  var upcoming = events.filter(function (e) { return !e.isPast; });
  if (upcoming.length) el("calendar-intro").textContent = upcoming.length + " upcoming events in and around Boston. Click a day to jump to it.";

  // click a day → highlight the first event on that day in the list
  el("month-grid").addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-day]");
    if (!btn) return;
    var k = btn.dataset.day;
    var target = Array.prototype.find.call(document.querySelectorAll("#event-rows .row"), function (r) { return r.dataset.start <= k && k <= r.dataset.end; });
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    document.querySelectorAll(".is-target").forEach(function (c) { c.classList.remove("is-target"); });
    target.classList.add("is-target");
    setTimeout(function () { target.classList.remove("is-target"); }, 2500);
  });

  // ---------- calendar file (.ics) ----------
  function icsDate(s) { return s.replace(/-/g, ""); }
  function icsText(s) { return String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\;"); }
  var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Boston Longevity Hub//EN", "X-WR-CALNAME:Boston Longevity events"];
  events.forEach(function (e) {
    ics.push("BEGIN:VEVENT", "UID:" + e.id + "@bostonlongevity.org", "DTSTAMP:" + icsDate(NOW) + "T000000Z",
      "DTSTART;VALUE=DATE:" + icsDate(e.start), "DTEND;VALUE=DATE:" + icsDate(R.addDays(e.end, 1)),
      "SUMMARY:" + icsText(e.title), e.venue ? "LOCATION:" + icsText(e.venue) : "",
      "DESCRIPTION:" + icsText((e.description || "") + (e.host ? "\nOrganized by " + e.host : "") + (e.url ? "\n" + e.url : "")),
      e.url ? "URL:" + e.url : "", "END:VEVENT");
  });
  ics.push("END:VCALENDAR");
  var icsLink = el("ics-link");
  try {
    icsLink.href = URL.createObjectURL(new Blob([ics.filter(Boolean).join("\r\n")], { type: "text/calendar" }));
  } catch (e) { icsLink.hidden = true; }

  // ---------- community directory + search ----------
  el("directory-list").innerHTML = R.community(places);
  var placeEls = Array.prototype.slice.call(document.querySelectorAll(".place"));
  function countText(n) { return n + (n === 1 ? " entry" : " entries"); }
  el("dir-count").textContent = countText(placeEls.length);
  el("dir-search").addEventListener("input", function () {
    var q = this.value.trim().toLowerCase(), n = 0;
    placeEls.forEach(function (p) { var ok = !q || p.dataset.search.indexOf(q) !== -1; p.hidden = !ok; if (ok) n++; });
    document.querySelectorAll(".dir-group").forEach(function (g) { g.hidden = !g.querySelector(".place:not([hidden])"); });
    el("dir-count").textContent = n ? countText(n) : "No matches";
  });

  // ---------- survival curves: two Kaplan–Meier steps, axes, and a shift arrow ----------
  (function () {
    var svg = el("curve");
    var W = 560, H = 360, L = 60, Rm = 24, T = 28, B = 40, N = 40, TMAX = 36;
    var A_CTRL = 2e-3, A_INTV = 2e-3 / 4.2, BG = 0.24; // Gompertz parameters
    var x0 = L, y0 = H - B;
    var x = function (t) { return x0 + (t / TMAX) * (W - L - Rm); };
    var y = function (s) { return y0 - s * (y0 - T); };
    function path(a) {
      var d = "M" + x(0) + " " + y(1);
      for (var k = 1; k <= N; k++) {
        var s = (N - k) / N;
        var t = s > 0 ? Math.log(1 - (BG / a) * Math.log(s)) / BG : Math.log(1 - (BG / a) * Math.log(0.5 / N)) / BG;
        d += " H" + x(Math.min(t, TMAX)).toFixed(1) + " V" + y(s).toFixed(1);
      }
      return d;
    }
    function median(a) { return Math.log(1 + (BG / a) * Math.LN2) / BG; }
    var mc = x(median(A_CTRL)), mi = x(median(A_INTV)), ym = y(0.5);
    svg.innerHTML =
      '<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 L10 5 L0 10 Z" class="c-arrow"/></marker></defs>' +
      '<line class="c-axis" x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - Rm) + '" y2="' + y0 + '"/>' +
      '<line class="c-axis" x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + T + '"/>' +
      '<text class="c-tick" x="' + (x0 - 8) + '" y="' + (y(1) + 4) + '" text-anchor="end">1.0</text>' +
      '<text class="c-tick" x="' + (x0 - 8) + '" y="' + (y(0) + 4) + '" text-anchor="end">0</text>' +
      '<text class="c-axis-label" x="' + (W - Rm) + '" y="' + (y0 + 24) + '" text-anchor="end">Age</text>' +
      '<text class="c-axis-label" transform="translate(' + (x0 - 34) + ' ' + ((y0 + T) / 2) + ') rotate(-90)" text-anchor="middle">Fraction alive</text>' +
      '<line class="c-median" x1="' + x0 + '" y1="' + ym + '" x2="' + (W - Rm) + '" y2="' + ym + '"/>' +
      '<path class="c-line c-ctrl" pathLength="1" d="' + path(A_CTRL) + '"/>' +
      '<path class="c-line c-intv" pathLength="1" d="' + path(A_INTV) + '"/>' +
      '<g class="c-shift"><line x1="' + (mc + 4) + '" y1="' + ym + '" x2="' + (mi - 4) + '" y2="' + ym + '" marker-end="url(#arrow)"/></g>';
  })();

  // ---------- hero map: simplified Boston with the Week's events lighting up ----------
  (function () {
    var svg = el("week-map");
    if (!svg || typeof HERO_MAP === "undefined") return;
    var M = HERO_MAP, b = M.bbox;
    function my(lat) { return Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)); }
    function project(lat, lng) {
      return [((lng - b.w) / (b.e - b.w)) * M.width, ((my(b.n) - my(lat)) / (my(b.n) - my(b.s))) * M.height];
    }
    function inside(p) { return p[0] > -20 && p[0] < M.width + 20 && p[1] > -20 && p[1] < M.height + 20; }
    svg.setAttribute("viewBox", "0 0 " + M.width + " " + M.height);
    svg.setAttribute("preserveAspectRatio", "xMaxYMid slice");
    var html = '<path class="hm-water" fill-rule="evenodd" d="' + M.water + '"/><path class="hm-coast" d="' + M.coast + '"/>';
    places.forEach(function (p) {
      if (p.lat == null) return;
      var q = project(p.lat, p.lng); if (!inside(q)) return;
      html += '<circle class="hm-place" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="3"/>';
    });
    var list = R.weekEvents(events, week).filter(function (e) { return e.lat != null; });
    var pts = [], seen = {};
    list.forEach(function (e) {
      var q = project(e.lat, e.lng); if (!inside(q)) return;
      // spread events that share a venue in a small ring
      var key = q[0].toFixed(0) + "," + q[1].toFixed(0), n = (seen[key] = (seen[key] || 0) + 1);
      if (n > 1) { var a = (n - 1) * 1.9; q = [q[0] + Math.cos(a) * 9, q[1] + Math.sin(a) * 9]; }
      pts.push({ e: e, q: q });
    });
    var total = pts.length, period = Math.max(8, total * 1.6);
    pts.forEach(function (p, i) {
      var delay = ((i * period) / total).toFixed(2) + "s";
      var x = p.q[0].toFixed(1), y = p.q[1].toFixed(1);
      html += '<g class="hm-event' + (p.e.featured ? " hm-anchor" : "") + '" style="--d:' + delay + ';--p:' + period + 's">' +
        '<circle class="hm-ring" cx="' + x + '" cy="' + y + '" r="' + (p.e.featured ? 11 : 7) + '"/>' +
        '<circle class="hm-dot" cx="' + x + '" cy="' + y + '" r="' + (p.e.featured ? 6.5 : 4.5) + '"><title>' + esc(p.e.title) + "</title></circle></g>";
    });
    svg.innerHTML = html;
  })();

  // ---------- nav: mark the section in view ----------
  var links = Array.prototype.slice.call(el("nav").querySelectorAll("a"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function spy() {
    var line = window.scrollY + window.innerHeight * 0.35, current = "";
    sections.forEach(function (s) { if (s && s.offsetTop <= line) current = "#" + s.id; });
    if (window.scrollY < 100) current = "";
    links.forEach(function (a) { if (a.getAttribute("href") === current) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
  }
  window.addEventListener("scroll", spy, { passive: true });
  spy();

  // ---------- map ----------
  function initMap() {
    if (typeof L === "undefined") return;
    var map = L.map("leaflet-map", { scrollWheelZoom: false, attributionControl: false }).setView([SITE.map.lat, SITE.map.lng], SITE.map.zoom);
    L.control.attribution({ prefix: false }).addAttribution("© OpenStreetMap contributors").addTo(map);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
    map.createPane("anchors").style.zIndex = 650; // anchor events always on top

    // Collect everything with coordinates. Events first (anchors first of all),
    // so that an anchor sits at the centre of any cluster it shares.
    var items = [];
    events.forEach(function (e) {
      if (e.lat == null || e.lng == null) return;
      var popup = "<strong>" + esc(e.title) + "</strong><br><span class='pop-date'>" + R.shortRange(e.start, e.end) + "</span>" +
        (e.venue ? "<br><span class='pop-sub'>" + esc(e.venue) + "</span>" : "") +
        (e.host ? "<br><span class='pop-sub'>Organized by " + esc(e.host) + "</span>" : "") +
        (e.url ? "<br><a href='" + esc(e.url) + "'>Website</a>" : "");
      items.push({ lat: e.lat, lng: e.lng, popup: popup, anchor: !!e.featured, label: e.featured ? e.title : "",
        opts: { radius: e.featured ? 13 : 8, className: "pin " + (e.featured ? "pin-anchor" : "pin-event") + (e.isPast ? " pin-past" : ""), pane: e.featured ? "anchors" : "markerPane" } });
    });
    items.sort(function (a, b) { return (b.anchor ? 1 : 0) - (a.anchor ? 1 : 0); });
    places.forEach(function (p) {
      if (p.lat == null || p.lng == null) return;
      items.push({ lat: p.lat, lng: p.lng, anchor: false,
        popup: "<strong>" + esc(p.name) + "</strong>" + (p.institution ? "<br><span class='pop-sub'>" + esc(p.institution) + "</span>" : "") + (p.url ? "<br><a href='" + esc(p.url) + "'>Website</a>" : ""),
        opts: { radius: 7, className: "pin pin-" + p.type } });
    });

    // Group points that share (almost) the same spot, then fan each group out in
    // a small ring in screen pixels so that nothing hides under another marker.
    var clusters = [];
    items.forEach(function (it) {
      var c = clusters.find(function (c) { return Math.abs(c.lat - it.lat) < 0.0025 && Math.abs(c.lng - it.lng) < 0.0035; });
      if (c) c.items.push(it); else clusters.push({ lat: it.lat, lng: it.lng, items: [it] });
    });
    var placed = [];
    clusters.forEach(function (c) {
      c.items.forEach(function (it, i) {
        var m = L.circleMarker([c.lat, c.lng], it.opts).bindPopup(it.popup).addTo(map);
        if (it.label) m.bindTooltip(it.label, { permanent: true, direction: "right", offset: [10, 0], className: "pin-label", pane: "anchors" });
        var n = c.items.length, ring = n > 1 && !(i === 0 && c.items[0].anchor);
        var slots = c.items[0].anchor ? n - 1 : n, slot = c.items[0].anchor ? i - 1 : i;
        placed.push({ marker: m, base: L.latLng(c.lat, c.lng), ring: ring, angle: ring ? (2 * Math.PI * slot) / slots - Math.PI / 2 : 0, radius: n > 4 ? 26 : 14 });
      });
    });
    function layout() {
      placed.forEach(function (p) {
        if (!p.ring) return;
        var pt = map.latLngToLayerPoint(p.base);
        p.marker.setLatLng(map.layerPointToLatLng(pt.add([Math.cos(p.angle) * p.radius, Math.sin(p.angle) * p.radius])));
      });
    }
    map.on("zoomend", layout);

    var bounds = placed.filter(function (p) { return Math.abs(p.base.lat - SITE.map.lat) < 0.55 && Math.abs(p.base.lng - SITE.map.lng) < 0.75; }).map(function (p) { return p.base; });
    if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    layout();
  }
  if (document.readyState === "complete") initMap(); else window.addEventListener("load", initMap);
})();
