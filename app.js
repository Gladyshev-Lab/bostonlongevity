/* Boston Longevity Hub — v2. Content lives in data.js; this file only renders it. */
(function () {
  "use strict";

  // ---------- dates ----------
  // Open the page with ?today=2026-10-07 to preview it as of that day.
  function todayISO() {
    var forced = new URLSearchParams(location.search).get("today");
    if (forced && /^\d{4}-\d{2}-\d{2}$/.test(forced)) return forced;
    return iso(new Date());
  }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function toDate(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  var NOW = todayISO();
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  function el(id) { return document.getElementById(id); }

  // ---------- site text ----------
  el("tagline").textContent = SITE.tagline;
  if (SITE.contactEmail) el("contact").innerHTML = ' Write to <a href="mailto:' + esc(SITE.contactEmail) + '">' + esc(SITE.contactEmail) + "</a>.";
  el("events-foot").innerHTML = SITE.eventFormUrl ? 'Know of an event that is missing? <a href="' + esc(SITE.eventFormUrl) + '">Tell us about it</a>.' : "";
  el("dir-foot").innerHTML = SITE.placeFormUrl ? 'Is your group missing? <a href="' + esc(SITE.placeFormUrl) + '">Add it to the directory</a>.' : "The directory is being built. If your group is missing, or anything here is out of date, please get in touch.";

  // ---------- events ----------
  var events = EVENTS.filter(function (e) { return !e.draft; }).map(function (e) {
    var end = e.end || e.start;
    return Object.assign({}, e, {
      end: end,
      id: "ev-" + e.start + "-" + slug(e.title),
      isNow: e.start <= NOW && NOW <= end,
      isPast: end < NOW
    });
  }).sort(function (a, b) { return a.start < b.start ? -1 : a.start > b.start ? 1 : (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });

  var upcoming = events.filter(function (e) { return !e.isPast; });
  if (upcoming.length) {
    el("events-intro").textContent = upcoming.length === 1 ? "One event coming up in and around Boston." : upcoming.length + " events coming up in and around Boston.";
  }

  function dateBlock(e) {
    var s = toDate(e.start), t = toDate(e.end), multi = e.end !== e.start;
    var month = MONTHS[s.getMonth()] + (multi && t.getMonth() !== s.getMonth() ? "–" + MONTHS[t.getMonth()] : "");
    var day = s.getDate() + (multi ? "–" + t.getDate() : "");
    var wd = DAYS[s.getDay()] + (multi ? "–" + DAYS[t.getDay()] : "");
    return '<div class="event-date"><span class="event-month">' + month + '</span><span class="event-day">' + day + '</span><span class="event-weekday">' + wd + " · " + s.getFullYear() + "</span></div>";
  }
  function typeLabel(t) { t = t || "event"; return t.charAt(0).toUpperCase() + t.slice(1); }
  function meta(label, value) { return value ? "<div><dt>" + label + "</dt><dd>" + esc(value) + "</dd></div>" : ""; }

  function eventCard(e) {
    var cls = "event" + (e.featured ? " is-featured" : "") + (e.isPast ? " is-past" : "") + (e.isNow ? " is-now" : "");
    var tags = (e.featured ? '<span class="tag tag-featured">Featured</span>' : "") +
      (e.isNow ? '<span class="tag tag-now">Happening now</span>' : "") +
      '<span class="tag">' + esc(typeLabel(e.type)) + "</span>" +
      (e.inviteOnly ? '<span class="tag tag-invite">Invite only</span>' : "");
    var title = e.url ? '<a href="' + esc(e.url) + '">' + esc(e.title) + "</a>" : esc(e.title);
    return '<article class="' + cls + '" id="' + e.id + '" data-start="' + e.start + '">' +
      dateBlock(e) +
      '<div class="event-body"><p class="event-tags">' + tags + '</p><h3 class="event-title">' + title + "</h3>" +
      (e.subtitle ? '<p class="event-subtitle">' + esc(e.subtitle) + "</p>" : "") +
      (e.description ? '<p class="event-desc">' + esc(e.description) + "</p>" : "") +
      '</div><dl class="event-meta">' + meta("Time", e.time) + meta("Where", e.venue) + meta("Organized by", e.host) + "</dl></article>";
  }

  var when = "upcoming";
  function renderEvents() {
    var list = events.filter(function (e) { return when === "past" ? e.isPast : !e.isPast; });
    if (when === "past") list = list.slice().reverse();
    el("event-list").innerHTML = list.map(eventCard).join("");
    el("events-empty").hidden = list.length > 0;
    renderCalendar(list);
  }
  el("when").addEventListener("click", function (ev) {
    var btn = ev.target.closest("button.chip");
    if (!btn) return;
    when = btn.dataset.when;
    el("when").querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", c === btn ? "true" : "false"); });
    renderEvents();
  });

  // ---------- calendar: a plain month grid per month that has events ----------
  function renderCalendar(list) {
    var cal = el("calendar");
    if (!list.length) { cal.hidden = true; return; }
    cal.hidden = false;

    // which days have events, which are featured, which lie inside a multi-day event
    var byDay = {}, featured = {}, range = {}, rangeStart = {}, rangeEnd = {};
    list.forEach(function (e) {
      for (var d = toDate(e.start); iso(d) <= e.end; d.setDate(d.getDate() + 1)) {
        var k = iso(d);
        (byDay[k] = byDay[k] || []).push(e);
        if (e.featured) featured[k] = true;
        if (e.end !== e.start) { range[k] = true; if (k === e.start) rangeStart[k] = true; if (k === e.end) rangeEnd[k] = true; }
      }
    });

    // months to draw: from the first to the last event, at most three
    var first = toDate(list.reduce(function (m, e) { return e.start < m ? e.start : m; }, list[0].start));
    var last = toDate(list.reduce(function (m, e) { return e.end > m ? e.end : m; }, list[0].end));
    var months = [];
    for (var m = new Date(first.getFullYear(), first.getMonth(), 1); m <= last && months.length < 3; m.setMonth(m.getMonth() + 1)) months.push(new Date(m.getTime()));

    cal.innerHTML = months.map(function (m0) {
      var y = m0.getFullYear(), mo = m0.getMonth();
      var daysInMonth = new Date(y, mo + 1, 0).getDate();
      var lead = (m0.getDay() + 6) % 7; // Monday first
      var html = '<div class="month"><p class="month-name">' + MONTHS_LONG[mo] + " " + y + '</p><div class="month-grid">' +
        ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(function (w) { return '<span class="wd">' + w + "</span>"; }).join("");
      for (var i = 0; i < lead; i++) html += '<span class="day is-out"></span>';
      for (var d = 1; d <= daysInMonth; d++) {
        var k = y + "-" + pad(mo + 1) + "-" + pad(d);
        var has = byDay[k];
        var cls = "day" + (has ? " has-events" : "") + (featured[k] ? " is-featured" : "") + (k < NOW ? " is-past" : "") + (k === NOW ? " is-today" : "") +
          (range[k] ? " in-range" : "") + (rangeStart[k] ? " range-start" : "") + (rangeEnd[k] ? " range-end" : "");
        html += has
          ? '<button type="button" class="' + cls + '" data-day="' + k + '" title="' + esc(has.map(function (e) { return e.title; }).join(", ")) + '">' + d + "</button>"
          : '<span class="' + cls + '">' + d + "</span>";
      }
      return html + "</div></div>";
    }).join("");
  }
  el("calendar").addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-day]");
    if (!btn) return;
    var k = btn.dataset.day;
    var target = Array.prototype.find.call(document.querySelectorAll(".event"), function (c) {
      var e = events.find(function (x) { return x.id === c.id; });
      return e && e.start <= k && k <= e.end;
    });
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    document.querySelectorAll(".event.is-target").forEach(function (c) { c.classList.remove("is-target"); });
    target.classList.add("is-target");
    setTimeout(function () { target.classList.remove("is-target"); }, 2500);
  });

  renderEvents();

  // ---------- calendar file (.ics) ----------
  function icsDate(s) { return s.replace(/-/g, ""); }
  function icsText(s) { return String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\;"); }
  var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Boston Longevity Hub//EN", "X-WR-CALNAME:Boston Longevity events"];
  events.forEach(function (e) {
    var endNext = toDate(e.end); endNext.setDate(endNext.getDate() + 1);
    ics.push("BEGIN:VEVENT", "UID:" + e.id + "@bostonlongevity.org", "DTSTAMP:" + icsDate(NOW) + "T000000Z",
      "DTSTART;VALUE=DATE:" + icsDate(e.start), "DTEND;VALUE=DATE:" + icsDate(iso(endNext)),
      "SUMMARY:" + icsText(e.title), e.venue ? "LOCATION:" + icsText(e.venue) : "",
      "DESCRIPTION:" + icsText((e.description || "") + (e.url ? "\n" + e.url : "")), e.url ? "URL:" + e.url : "", "END:VEVENT");
  });
  ics.push("END:VCALENDAR");
  var icsLink = el("ics-link");
  try {
    icsLink.href = URL.createObjectURL(new Blob([ics.filter(Boolean).join("\r\n")], { type: "text/calendar" }));
  } catch (e) { icsLink.hidden = true; }

  // ---------- directory ----------
  var groups = [["lab", "Labs", "labs"], ["company", "Companies", "companies"], ["organization", "Organizations", "organizations"]];
  var places = PLACES.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
  el("directory-list").innerHTML = groups.map(function (g) {
    var set = places.filter(function (p) { return p.type === g[0]; });
    if (!set.length) return "";
    return '<section class="dir-group" id="' + g[2] + '"><h3 class="dir-heading">' + g[1] + '</h3><ul class="places">' + set.map(function (p) {
      var hay = [p.name, p.pi, p.institution].concat(p.topics || []).join(" ").toLowerCase();
      return '<li class="place" data-search="' + esc(hay) + '"><div><h4>' + (p.url ? '<a href="' + esc(p.url) + '">' + esc(p.name) + "</a>" : esc(p.name)) + "</h4>" +
        (p.pi ? '<p class="place-pi">' + esc(p.pi) + "</p>" : "") + "</div>" +
        '<p class="place-inst">' + esc(p.institution || "") + "</p>" +
        '<p class="place-topics">' + (p.topics || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</p></li>";
    }).join("") + "</ul></section>";
  }).join("");
  var placeEls = Array.prototype.slice.call(document.querySelectorAll(".place"));
  function countText(n) { return n + (n === 1 ? " entry" : " entries"); }
  el("dir-count").textContent = countText(placeEls.length);
  el("dir-search").addEventListener("input", function () {
    var q = this.value.trim().toLowerCase(), n = 0;
    placeEls.forEach(function (p) { var ok = !q || p.dataset.search.indexOf(q) !== -1; p.hidden = !ok; if (ok) n++; });
    document.querySelectorAll(".dir-group").forEach(function (g) { g.hidden = !g.querySelector(".place:not([hidden])"); });
    el("dir-count").textContent = countText(n);
    el("dir-empty").hidden = n > 0;
  });

  // ---------- survival curves: two Kaplan–Meier steps, axes, and a shift arrow ----------
  (function () {
    var svg = el("curve");
    var W = 560, H = 360, L = 60, R = 24, T = 28, B = 40, N = 40, TMAX = 36;
    var A_CTRL = 2e-3, A_INTV = 2e-3 / 4.2, BG = 0.24; // Gompertz parameters: deaths begin early
    var x0 = L, y0 = H - B;
    var x = function (t) { return x0 + (t / TMAX) * (W - L - R); };
    var y = function (s) { return y0 - s * (y0 - T); };
    // deterministic step curve: ages at which survival crosses each 1/N
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
      '<line class="c-axis" x1="' + x0 + '" y1="' + y0 + '" x2="' + (W - R) + '" y2="' + y0 + '"/>' +
      '<line class="c-axis" x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + T + '"/>' +
      '<text class="c-tick" x="' + (x0 - 8) + '" y="' + (y(1) + 4) + '" text-anchor="end">1.0</text>' +
      '<text class="c-tick" x="' + (x0 - 8) + '" y="' + (y(0) + 4) + '" text-anchor="end">0</text>' +
      '<text class="c-axis-label" x="' + (W - R) + '" y="' + (y0 + 24) + '" text-anchor="end">Age</text>' +
      '<text class="c-axis-label" transform="translate(' + (x0 - 34) + ' ' + ((y0 + T) / 2) + ') rotate(-90)" text-anchor="middle">Fraction alive</text>' +
      '<line class="c-median" x1="' + x0 + '" y1="' + ym + '" x2="' + (W - R) + '" y2="' + ym + '"/>' +
      '<path class="c-line c-ctrl" pathLength="1" d="' + path(A_CTRL) + '"/>' +
      '<path class="c-line c-intv" pathLength="1" d="' + path(A_INTV) + '"/>' +
      '<g class="c-shift"><line x1="' + (mc + 4) + '" y1="' + ym + '" x2="' + (mi - 4) + '" y2="' + ym + '" marker-end="url(#arrow)"/></g>';
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
    var map = L.map("leaflet-map", { scrollWheelZoom: false }).setView([SITE.map.lat, SITE.map.lng], SITE.map.zoom);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19
    }).addTo(map);
    var bounds = [];
    function near(p) { return Math.abs(p.lat - SITE.map.lat) < 0.55 && Math.abs(p.lng - SITE.map.lng) < 0.75; }
    events.forEach(function (e) {
      if (e.lat == null || e.lng == null) return;
      var s = toDate(e.start), t = toDate(e.end);
      var date = MONTHS[s.getMonth()] + " " + s.getDate() + (e.end !== e.start ? "–" + (t.getMonth() !== s.getMonth() ? MONTHS[t.getMonth()] + " " : "") + t.getDate() : "");
      L.circleMarker([e.lat, e.lng], { radius: e.featured ? 11 : 9, className: "pin pin-event" + (e.isPast ? " pin-past" : "") })
        .bindPopup("<strong>" + esc(e.title) + "</strong><br><span class='pop-date'>" + date + "</span>" + (e.venue ? "<br><span class='pop-sub'>" + esc(e.venue) + "</span>" : "") + (e.url ? "<br><a href='" + esc(e.url) + "'>Website</a>" : ""))
        .addTo(map);
      if (near(e)) bounds.push([e.lat, e.lng]);
    });
    places.forEach(function (p) {
      if (p.lat == null || p.lng == null) return;
      L.circleMarker([p.lat, p.lng], { radius: 7, className: "pin pin-" + p.type })
        .bindPopup("<strong>" + esc(p.name) + "</strong>" + (p.institution ? "<br><span class='pop-sub'>" + esc(p.institution) + "</span>" : "") + (p.url ? "<br><a href='" + esc(p.url) + "'>Website</a>" : ""))
        .addTo(map);
      if (near(p)) bounds.push([p.lat, p.lng]);
    });
    if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }
  if (document.readyState === "complete") initMap(); else window.addEventListener("load", initMap);
})();
