/* Boston Longevity Hub — rendering helpers shared by the browser (app.js)
   and the prerender step (build.js). Pure functions: data in, HTML out. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Render = factory();
}(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var DAYS_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var TYPES = { conference: "Conference", symposium: "Symposium", meeting: "Scientific meeting", workshop: "Workshop", hackathon: "Hackathon", networking: "Networking", talk: "Talk", other: "Event" };

  function pad(n) { return String(n).padStart(2, "0"); }
  function iso(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function toDate(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(s, n) { var d = toDate(s); d.setDate(d.getDate() + n); return iso(d); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  function typeLabel(t) { return TYPES[t] || TYPES.other; }

  // "Oct 1–3", "Oct 30–Nov 1", "Oct 4"
  function shortRange(start, end) {
    var s = toDate(start), t = toDate(end || start);
    if (!end || end === start) return MONTHS[s.getMonth()] + " " + s.getDate();
    return MONTHS[s.getMonth()] + " " + s.getDate() + "–" + (t.getMonth() !== s.getMonth() ? MONTHS[t.getMonth()] + " " : "") + t.getDate();
  }
  function longDay(k) { var d = toDate(k); return DAYS_LONG[d.getDay()] + ", " + MONTHS_LONG[d.getMonth()] + " " + d.getDate(); }

  // ---------- data preparation ----------
  function prepareEvents(EVENTS, NOW) {
    return EVENTS.filter(function (e) { return !e.draft; }).map(function (e) {
      var end = e.end || e.start;
      return Object.assign({}, e, {
        end: end,
        id: "ev-" + e.start + "-" + slug(e.title),
        isNow: e.start <= NOW && NOW <= end,
        isPast: end < NOW,
        multi: end !== e.start
      });
    }).sort(function (a, b) {
      if (a.start !== b.start) return a.start < b.start ? -1 : 1;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }
  function preparePlaces(PLACES) {
    return PLACES.filter(function (p) { return !p.draft; }).slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
  }
  function inWeek(e, week) { return e.start >= week.start && e.start <= week.end; }
  function beyondWeek(e, week) { return e.start > week.end && (!week.through || e.start <= week.through); }
  function weekEvents(events, week) { return events.filter(function (e) { return inWeek(e, week) || beyondWeek(e, week); }); }

  // ---------- event card ----------
  function dateBlock(e) {
    var s = toDate(e.start), t = toDate(e.end);
    var month = MONTHS[s.getMonth()] + (e.multi && t.getMonth() !== s.getMonth() ? "–" + MONTHS[t.getMonth()] : "");
    var day = s.getDate() + (e.multi ? "–" + t.getDate() : "");
    var wd = DAYS[s.getDay()] + (e.multi ? "–" + DAYS[t.getDay()] : "");
    return '<div class="event-date"><span class="event-month">' + month + '</span><span class="event-day">' + day + '</span><span class="event-weekday">' + wd + " · " + s.getFullYear() + "</span></div>";
  }
  function meta(label, value) { return value ? "<div><dt>" + label + "</dt><dd>" + esc(value) + "</dd></div>" : ""; }
  function eventCard(e) {
    var cls = "event" + (e.featured ? " is-featured" : "") + (e.isPast ? " is-past" : "") + (e.isNow ? " is-now" : "");
    var tags = (e.featured ? '<span class="tag tag-featured">Anchor event</span>' : "") +
      (e.isNow ? '<span class="tag tag-now">Happening now</span>' : "") +
      '<span class="tag">' + esc(typeLabel(e.type)) + "</span>" +
      (e.inviteOnly ? '<span class="tag tag-invite">By invitation</span>' : "");
    var title = e.url ? '<a href="' + esc(e.url) + '">' + esc(e.title) + "</a>" : esc(e.title);
    return '<article class="' + cls + '" id="' + e.id + '" data-start="' + e.start + '" data-end="' + e.end + '">' +
      dateBlock(e) +
      '<div class="event-body"><p class="event-tags">' + tags + '</p><h3 class="event-title">' + title + "</h3>" +
      (e.subtitle ? '<p class="event-subtitle">' + esc(e.subtitle) + "</p>" : "") +
      (e.description ? '<p class="event-desc">' + esc(e.description) + "</p>" : "") +
      '</div><dl class="event-meta">' + meta("Time", e.time) + meta("Where", e.venue) +
      meta("Organized by", e.host || "See the event website") + "</dl></article>";
  }

  // ---------- hero: anchor events + count ----------
  function anchors(events, week) {
    var list = weekEvents(events, week);
    var featured = list.filter(function (e) { return e.featured; });
    var html = '<p class="anchors-label">Anchor events</p><ul class="anchors-list">' + featured.map(function (e) {
      return '<li><a href="#' + e.id + '"><span class="anchors-date">' + shortRange(e.start, e.end) + '</span><span class="anchors-name">' + esc(e.title) + "</span>" +
        (e.subtitle ? '<span class="anchors-sub">' + esc(e.subtitle) + "</span>" : "") + "</a></li>";
    }).join("") + "</ul>";
    var n = list.length;
    html += '<p class="anchors-count"><a href="#week">See all ' + n + ' events, day by day</a></p>';
    return html;
  }

  // ---------- Week program: day by day, then "and beyond" ----------
  function program(events, week) {
    var html = "";
    for (var k = week.start; k <= week.end; k = addDays(k, 1)) {
      var starting = events.filter(function (e) { return e.start === k; });
      var continuing = events.filter(function (e) { return e.start < k && k <= e.end; });
      if (!starting.length && !continuing.length) continue;
      html += '<section class="day-group" id="day-' + k + '"><h3 class="day-heading">' + longDay(k) + "</h3>";
      continuing.forEach(function (e) {
        var n = Math.round((toDate(k) - toDate(e.start)) / 864e5) + 1, total = Math.round((toDate(e.end) - toDate(e.start)) / 864e5) + 1;
        html += '<p class="continues"><a href="#' + e.id + '">' + esc(e.title) + "</a> continues · day " + n + " of " + total + "</p>";
      });
      if (starting.length) html += '<div class="events">' + starting.map(eventCard).join("") + "</div>";
      html += "</section>";
    }
    var beyond = events.filter(function (e) { return beyondWeek(e, week); });
    if (beyond.length) {
      html += '<section class="day-group" id="day-beyond"><h3 class="day-heading">And beyond</h3><p class="day-note">Events in the days after the Week.</p><div class="events">' + beyond.map(eventCard).join("") + "</div></section>";
    }
    return html;
  }

  // ---------- Calendar: month grids + compact rows ----------
  function calendarGrid(list, NOW) {
    if (!list.length) return "";
    var byDay = {}, featured = {}, range = {}, rangeStart = {}, rangeEnd = {};
    list.forEach(function (e) {
      for (var k = e.start; k <= e.end; k = addDays(k, 1)) {
        (byDay[k] = byDay[k] || []).push(e);
        if (e.featured) featured[k] = true;
        if (e.multi) { range[k] = true; if (k === e.start) rangeStart[k] = true; if (k === e.end) rangeEnd[k] = true; }
      }
    });
    var first = toDate(list.reduce(function (m, e) { return e.start < m ? e.start : m; }, list[0].start));
    var last = toDate(list.reduce(function (m, e) { return e.end > m ? e.end : m; }, list[0].end));
    var months = [];
    for (var m = new Date(first.getFullYear(), first.getMonth(), 1); m <= last && months.length < 3; m.setMonth(m.getMonth() + 1)) months.push(new Date(m.getTime()));
    return months.map(function (m0) {
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
  function eventRows(list) {
    if (!list.length) return "";
    return '<ul class="rows">' + list.map(function (e) {
      var title = e.url ? '<a href="' + esc(e.url) + '">' + esc(e.title) + "</a>" : esc(e.title);
      return '<li class="row' + (e.featured ? " is-featured" : "") + (e.isPast ? " is-past" : "") + '" data-start="' + e.start + '" data-end="' + e.end + '">' +
        '<span class="row-date">' + shortRange(e.start, e.end) + "</span>" +
        '<span class="row-main"><span class="row-title">' + title + "</span>" +
        (e.venue ? '<span class="row-venue">' + esc(e.venue) + "</span>" : "") + "</span>" +
        '<span class="row-host">' + esc(e.host || "") + "</span>" +
        '<span class="row-type">' + esc(typeLabel(e.type)) + (e.inviteOnly ? " · by invitation" : "") + "</span></li>";
    }).join("") + "</ul>";
  }

  // ---------- Community directory ----------
  var GROUPS = [["organization", "Organizations", "organizations"], ["company", "Companies", "companies"], ["lab", "Labs", "labs"]];
  function community(places) {
    return GROUPS.map(function (g) {
      var set = places.filter(function (p) { return p.type === g[0]; });
      if (!set.length) return "";
      return '<section class="dir-group" id="' + g[2] + '"><h3 class="dir-heading">' + g[1] + '</h3><ul class="places">' + set.map(function (p) {
        var hay = [p.name, p.institution].concat(p.topics || []).join(" ").toLowerCase();
        return '<li class="place" data-search="' + esc(hay) + '"><div><h4>' + (p.url ? '<a href="' + esc(p.url) + '">' + esc(p.name) + "</a>" : esc(p.name)) + "</h4></div>" +
          '<p class="place-inst">' + esc(p.institution || "") + "</p>" +
          '<p class="place-topics">' + (p.topics || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</p></li>";
      }).join("") + "</ul></section>";
    }).join("");
  }

  return {
    MONTHS: MONTHS, pad: pad, iso: iso, toDate: toDate, addDays: addDays, esc: esc, shortRange: shortRange, typeLabel: typeLabel,
    prepareEvents: prepareEvents, preparePlaces: preparePlaces, weekEvents: weekEvents,
    eventCard: eventCard, anchors: anchors, program: program, calendarGrid: calendarGrid, eventRows: eventRows, community: community
  };
}));
