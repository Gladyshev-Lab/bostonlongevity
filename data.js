// ============================================================
//  Boston Longevity Hub — content
//  Edit this file to update the site. After editing, run
//  `node build.js` so search engines see the content too (see README).
// ============================================================

const SITE = {
  title: "Boston Longevity Hub",
  tagline: "Connecting Boston's aging and longevity community",
  contactEmail: "hello@bostonlongevity.org",          // e.g. "hello@bostonlongevity.org" — leave "" to hide
  joinFormUrl: "",           // mailing-list / sign-up form (Google Form, Buttondown, Mailchimp…), or ""
  eventFormUrl: "",          // form for submitting an event, or "" (falls back to the Join section)
  placeFormUrl: "",          // form for adding a company / organization, or "" (falls back to the Join section)
  map: { lat: 42.352, lng: -71.09, zoom: 12 },

  // Boston Longevity Week. Events that start between `start` and `end` form
  // the day-by-day program; events after `end` and up to `through` are
  // listed under "and beyond".
  week: {
    name: "Boston Longevity Week 2026",
    year: 2026,
    start: "2026-10-01",
    end: "2026-10-07",
    through: "2026-10-31",
    dates: "October 1–7",
    datesNote: "(and beyond)",
    lede: "A series of conferences anchored by ARDD and Biomarkers of Aging, symposia, workshops, and community events bringing together aging and longevity science across Greater Boston.",
    intro: "Boston Longevity Week brings together independently organized conferences, symposia, scientific meetings, and community events taking place in Boston. Each event is run by its own organizers, named on every card below."
  }
};

// ------------------------------------------------------------
//  Events
//  Fields:
//    title        required
//    subtitle     optional, one line
//    start        required, "YYYY-MM-DD"
//    end          optional, "YYYY-MM-DD" for multi-day events
//    time         optional, free text ("2–6:30 PM")
//    type         "conference" | "symposium" | "meeting" | "workshop" |
//                 "hackathon" | "networking" | "talk" | "other"
//    venue        where it happens
//    host         who organizes it — REQUIRED, shown as "Organized by" on
//                 every card so that no one assumes the Hub runs the event
//    url          event website
//    description  one or two sentences
//    featured     true = anchor event of the Week (large marker, highlighted card,
//                 shown under "Featured Conferences")
//    focus        one line on the scope, for featured conferences
//    programUrl   link to the program; registerUrl  link to registration
//    program      forums / workshops / tracks per day, for featured conferences:
//                 [{ date: "YYYY-MM-DD", tracks: [{ name, room, items: [..] }] }]
//    inviteOnly   true = attendance by invitation
//    lat, lng     map coordinates; leave out to keep an event off the map
//    draft        true = not shown on the site
//  Order does not matter; the site sorts by date.
// ------------------------------------------------------------
const EVENTS = [
  {
    title: "ARDD 2026",
    subtitle: "Aging Research & Drug Discovery",
    start: "2026-10-01", end: "2026-10-03",
    type: "conference",
    venue: "David Rubenstein Treehouse, Harvard University, Boston",
    host: "ARDD organizing committee",
    url: "https://agingpharma.org/",
    programUrl: "https://agingpharma.org/program2026",
    registerUrl: "https://agingpharma.org/registration",
    focus: "Aging biology, drug discovery, AI, biotechnology, and translation.",
    description: "The 13th annual meeting on the molecular biology of aging, longevity medicine, and drug discovery for age-related diseases.",
    featured: true,
    lat: 42.3634, lng: -71.1266,
    // Forums and workshops, from agingpharma.org/program2026
    program: [
      { date: "2026-10-01", tracks: [
        { name: "Main track", room: "Canopy Hall, 3/F", items: ["Opening remarks and XPRIZE Healthspan overview", "Policy & regulatory address; ARPA-H PROSPR", "Clinical trials of therapeutics and regulatory mandates", "Clinical trials in diseases of aging", "AI & clinical trials in healthspan", "Healthspan in leading industries", "Aging research and pharma R&D productivity", "Clinical healthspan trials and practice"] },
        { name: "XPRIZE Healthspan: Meet the Finalists Workshop", room: "Cedar Grove, 2/F, 9:20–11:30", items: ["Multimodal & clinical approach teams", "Drug & biologics teams"] }
      ] },
      { date: "2026-10-02", tracks: [
        { name: "Main track", room: "Canopy Hall, 3/F", items: ["Reimagining drug discovery through the lens of aging biology", "Pharma chief executive panel", "Longevity therapeutics as an industry", "Aging clocks and GLP-1/GIP agonists", "New technology partnering & licensing", "Diseases as a pathway to longevity therapeutics", "Early-stage and growth-stage investor panels", "Epigenetic and biomarker insights"] },
        { name: "AI in Drug Discovery Forum", room: "Cedar Grove, 2/F, all day", items: ["AI & computational design", "Large-scale datasets", "Neurodegeneration", "Systems immunology"] }
      ] },
      { date: "2026-10-03", tracks: [
        { name: "Main track", room: "Canopy Hall, 3/F", items: ["Keynotes", "Search & evaluation strategies for longevity therapeutics", "Metabolic health and longevity", "Semaglutide and healthspan", "Aging research in pharma", "Therapeutic assets & licensing, late and early stage", "AMPK network activation", "Company talks", "Closing keynote and closing remarks"] },
        { name: "Pet and Animal Longevity Forum", room: "Cedar Grove, 2/F, morning", items: ["Canine aging", "Commercializing pet longevity"] },
        { name: "Virtual Cell in Time Forum", room: "Cedar Grove, 2/F, afternoon", items: ["Virtual biology models", "World models", "Single-cell approaches"] }
      ] }
    ]
  },
  {
    title: "Aging Theories",
    start: "2026-10-04",
    type: "meeting",
    venue: "Veritas Science Center, Conference Room 457",
    host: "A. Doga Yucel and Adrien Moliere",
    url: "",
    description: "An invitation-only scientific meeting on theories of aging.",
    inviteOnly: true,
    lat: 42.3386, lng: -71.1028
  },
  {
    title: "Sundai Hack 143: Biomarkers of Aging",
    start: "2026-10-04",
    time: "10 AM - 10 PM",
    type: "hackathon",
    venue: "Harvard University",
    host: "Sundai Club",
    url: "https://www.sundai.club/events/boston/sundai-hack-143-biomarkers-of-aging-hack",
    description: "A one-day AI hackathon to build and test aging biomarkers from imaging, wearables, and physiological signals.",
    lat: 42.377, lng: -71.1167
  },
  {
    title: "Longevity 121 Boston 2026",
    subtitle: "AI-driven healthy longevity",
    start: "2026-10-04",
    type: "conference",
    venue: "MIT Stata Center, Cambridge (tentative)",
    host: "Regenerative Bio",
    url: "https://longevity121.org/en-US/event/2026",
    description: "Researchers, clinicians, and industry on aging diagnostics, AI for drug discovery, regenerative medicine, and clinical translation.",
    lat: 42.3616, lng: -71.0906
  },
  {
    title: "Skin Aging Symposium",
    subtitle: "Skincare science meets longevity",
    start: "2026-10-04",
    time: "6–9 PM",
    type: "symposium",
    venue: "650 E Kendall St, Cambridge",
    host: "Longevity Global",
    url: "https://luma.com/longevity-y6hb",
    description: "A Longevity Global evening exploring the intersection of skincare science and longevity: an expert panel on protecting and treating the body's largest organ as we age, followed by extensive networking.",
    lat: 42.3655, lng: -71.0790
  },
  {
    title: "Longevity Biotech Pitch Night",
    start: "2026-10-04",
    time: "1:30 PM - 6 PM",
    type: "networking",
    venue: "650 E Kendall Street in Cambridge, Boston",
    host: "Boston Longevity Investor Network and Lifespan Research Institute",
    url: "https://luma.com/l2q5uxj4",
    inviteOnly: true,
    description: "Selected longevity biotech startups pitch to investors from venture firms focused on the field.",
    lat: 42.3644, lng: -71.0806
  },
  {
    title: "2026 Biomarkers of Aging Conference",
    subtitle: "Measuring the biology of aging",
    start: "2026-10-05", end: "2026-10-06",
    type: "conference",
    venue: "Joseph B. Martin Conference Center, Harvard Medical School, Boston",
    host: "Biomarkers of Aging Consortium",
    url: "https://www.agingconsortium.org/2026-conference",
    programUrl: "https://www.agingconsortium.org/s/2026-Biomarkers-of-Aging-Program.pdf",
    registerUrl: "https://www.agingconsortium.org/2026-tickets",
    focus: "Aging biology, biological age, aging biomarkers, intervention assessment, and their translation to human health.",
    description: "The annual meeting on standardized, clinically validated measures of biological aging and their use in testing interventions.",
    featured: true,
    lat: 42.3366, lng: -71.1039,
    // Tracks and workshops, from the 2026 conference program
    program: [
      { date: "2026-10-05", tracks: [
        { name: "Main Conference Track", room: "Auditorium", items: ["Welcome & opening", "Platforms, Screening & Molecular Detections", "Systems Aging", "Poster flash talks", "Immune Aging", "Stem Cells & Rejuvenation"] },
        { name: "Replacement in Aging Track", room: "Pechet", items: ["Keynote lecture: Reconstructing the Human Body", "Engineering Living Replacement", "From Spare Parts to Systemic Rejuvenation", "Bringing Replacement Medicine to the Clinic"] }
      ] },
      { date: "2026-10-06", tracks: [
        { name: "Main Conference Track", room: "Auditorium", items: ["Day 1 recap", "XPRIZE Healthspan Session", "Molecular, Digital & Functional Signatures of Aging", "Biomarkers in Trials & Population Cohorts", "Regulatory Panel", "Ethics & Future of Longevity", "Closing & Awards"] },
        { name: "Gerophysics Track", room: "Pechet", items: ["Gerophysics I", "Living Matter", "Theories of Aging", "Whiteboard Session"] }
      ] }
    ]
  },
  {
    title: "Student Networking Reception",
    subtitle: "For students in the aging space",
    start: "2026-10-05",
    time: "7–9 PM",
    type: "networking",
    venue: "Cambridge, MA",
    host: "Boston Longevity Week, with Changemakers in Aging and The Aging Initiative",
    url: "https://luma.com/d0quyu9d",
    description: "A networking reception for students attending Boston Longevity Week and local undergraduate and graduate students interested in aging biology."
  },
  {
    title: "Boston LongevityTech Night",
    subtitle: "Boston Health Innovation Night series",
    start: "2026-10-06",
    time: "6:30 PM - 9:30 PM",
    type: "networking",
    venue: "The Liberty, a Luxury Collection Hotel, Boston",
    host: "Boston Health Innovation Night",
    url: "https://luma.com/cj9mf9o3",
    description: "Short talks and networking for founders, investors, and researchers working in longevity biotech.",
    lat: 42.3619, lng: -71.0699
  },
  {
    title: "2026 Brain Aging Symposium",
    subtitle: "Biomarkers of the aging brain",
    start: "2026-10-07",
    time: "8 AM - 2 PM",
    type: "symposium",
    venue: "Veritas Science Center, Joseph B. Martin Conference Center at Harvard Medical School",
    host: "Biomarkers of Aging Consortium",
    url: "https://www.agingconsortium.org/brain-aging",
    description: "A half-day symposium on cognitive aging, neuroimaging, Alzheimer's disease, and the biomarkers used to track age-related cognitive decline.",
    lat: 42.3386, lng: -71.1028
  },
  {
    title: "2026 Reproductive Aging Symposium",
    subtitle: "Biomarkers of reproductive aging",
    start: "2026-10-07",
    time: "2 PM - 6:30 PM",
    type: "symposium",
    venue: "Veritas Science Center, Joseph B. Martin Conference Center at Harvard Medical School",
    host: "Biomarkers of Aging Consortium",
    url: "https://www.agingconsortium.org/reproductive-aging-symposium-2026",
    description: "An afternoon of talks on biomarkers of reproductive aging, with speakers from institutions in the US and Israel.",
    lat: 42.3386, lng: -71.1028
  },
  {
    title: "Translational Longevity Summit",
    subtitle: "From discovery to clinical practice",
    start: "2026-10-07", end: "2026-10-11",
    type: "conference",
    venue: "One Milestone, Harvard Enterprise Research Campus, Boston",
    host: "Boston BioLife and the Healthspan Action Coalition",
    url: "https://translationallongevity.com/",
    description: "A multi-day summit on bringing healthspan research into the clinic, with sessions on patient advocacy, translation, and policy.",
    lat: 42.3630, lng: -71.1201
  },
  {
    title: "TEDxBerkshires",
    start: "2026-10-08",
    type: "talk",
    venue: "Berkshire Innovation Center, Pittsfield, MA",
    host: "TEDxBerkshires",
    url: "https://www.tedxberkshires.com/",
    description: "An independently organized TEDx event in western Massachusetts.",
    lat: 42.4485, lng: -73.2447
  },
  {
    title: "2026 Healthy Aging Symposium at Harvard Chan",
    subtitle: "From cells to society: the science of extending healthspan",
    start: "2026-10-09",
    time: "9 AM - 7 PM",
    type: "symposium",
    venue: "Veritas Science Center, Joseph B. Martin Conference Center at Harvard Medical School",
    host: "Harvard T.H. Chan School of Public Health",
    url: "https://hsph.harvard.edu/healthy-aging/events/2026-healthy-aging-symposium/",
    description: "A full-day symposium spanning the biology, nutrition, epidemiology, social science, and policy of healthy aging.",
    lat: 42.3386, lng: -71.1028
  },

  // ---- Drafts: fill in and remove "draft: true" ----
  { title: "TBA: David Sinclair event", start: "2026-10-10", type: "other", venue: "TBA", host: "TBA", draft: true }
];

// ------------------------------------------------------------
//  Community: companies and organizations
//  (Research labs are deliberately not listed yet — there are too many
//   groups studying aging in Boston to list a handful fairly. To be decided.)
//  Fields:
//    name          required
//    type          "company" | "organization" | "lab"
//    institution   affiliation or location
//    topics        list of areas
//    url           website, or ""
//    lat, lng      map coordinates; leave out to keep an entry off the map
//    draft         true = not shown
//  Coordinates: right-click a building in Google Maps, the first menu
//  item is "lat, lng"; click it to copy.
//  SEED DATA — check every entry before launch.
// ------------------------------------------------------------
const PLACES = [
  // ---- Organizations ----
  { name: "Biomarkers of Aging Consortium", type: "organization", institution: "Boston", topics: ["biomarkers", "standards", "clinical translation"], url: "https://www.agingconsortium.org", lat: 42.3386, lng: -71.1028},
  { name: "Paul F. Glenn Center for Biology of Aging Research", type: "organization", institution: "Harvard Medical School", topics: ["biology of aging"], url: "", lat: 42.3386, lng: -71.1028 },
  { name: "Broad Institute", type: "organization", institution: "Cambridge", topics: ["genomics", "single-cell biology"], url: "https://www.broadinstitute.org", lat: 42.3628, lng: -71.0866 },
  { name: "Wyss Institute", type: "organization", institution: "Harvard University", topics: ["bioengineering", "organs-on-chips"], url: "https://wyss.harvard.edu", lat: 42.3392, lng: -71.103 },

  // ---- Labs ----
  { name: "Gladyshev Lab", type: "lab", institution: "Harvard Medical School", topics: ["biomarkers", "aging clocks", "longevity"], url: "https://gladyshevlab.bwh.harvard.edu/", lat: 42.3386, lng: -71.1028},
  { name: "Sinclair Lab", type: "lab", institution: "Harvard Medical School", topics: ["epigenetic reprogramming", "longevity"], url: "https://sinclair.hms.harvard.edu", lat: 42.3386, lng: -71.1028},

  // ---- Companies ----
  // { name: "Life Biosciences", type: "company", institution: "Boston", topics: ["partial reprogramming", "eye disease"], url: "", lat: 42.3467, lng: -71.0972 },
  // { name: "Elevian", type: "company", institution: "Newton", topics: ["GDF11", "regeneration"], url: "", lat: 42.337, lng: -71.2092 }
];
