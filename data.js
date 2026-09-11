// ============================================================
//  Boston Longevity Hub — content
//  Edit this file to update the site. No build step needed.
// ============================================================

const SITE = {
  title: "Boston Longevity Hub",
  tagline: "Events, labs, companies, and organizations working on longevity, aging, and development research across Greater Boston.",
  contactEmail: "",          // e.g. "hello@bostonlongevity.org" — leave "" to hide
  eventFormUrl: "",          // link to a Google Form / Tally for event submissions, or ""
  placeFormUrl: "",          // link to a form for adding a lab / company / organization, or ""
  map: { lat: 42.352, lng: -71.09, zoom: 12 }
};

// ------------------------------------------------------------
//  Events
//  Fields:
//    title        required
//    subtitle     optional, one line
//    start        required, "YYYY-MM-DD"
//    end          optional, "YYYY-MM-DD" for multi-day events
//    time         optional, free text ("2–6:30 PM")
//    type         "conference" | "symposium" | "hackathon" | "networking" | "talk" | "other"
//    venue        where it happens
//    host         who organizes it (shown as "Organized by")
//    url          event website
//    description  one or two sentences
//    featured     true = highlighted as a main event
//    inviteOnly   true = registration by invitation
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
    venue: "Rubenstein Treehouse, Harvard University",
    url: "https://agingpharma.org/",
    description: "The 13th annual meeting on the molecular biology of aging, longevity medicine, and drug discovery for age-related diseases.",
    featured: true,
    lat: 42.3631, lng: -71.126
  },
  {
    title: "Sundai Hack 143: Biomarkers of Aging",
    start: "2026-10-04",
    time: "10 AM–10 PM",
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
    title: "Longevity Biotech Pitch Night",
    start: "2026-10-04",
    type: "networking",
    venue: "Boston, venue to be announced",
    host: "Boston Longevity Investor Network and Lifespan Research Institute",
    url: "https://luma.com/l2q5uxj4",
    inviteOnly: true,
    description: "Selected longevity biotech startups pitch to investors from venture firms focused on the field."
  },
  {
    title: "2026 Biomarkers of Aging Conference",
    subtitle: "Measuring the biology of aging",
    start: "2026-10-05", end: "2026-10-06",
    type: "conference",
    venue: "Harvard Medical School, Boston",
    host: "Biomarkers of Aging Consortium",
    url: "https://www.agingconsortium.org/2026-conference",
    description: "The annual meeting on standardized, clinically validated measures of biological aging and their use in testing interventions.",
    featured: true,
    lat: 42.3359, lng: -71.1046
  },
  {
    title: "Boston LongevityTech Night",
    subtitle: "Boston Health Innovation Night series",
    start: "2026-10-06",
    time: "6:30 PM",
    type: "networking",
    venue: "The Liberty Hotel, Boston",
    host: "Boston Health Innovation Night",
    url: "https://luma.com/cj9mf9o3",
    description: "Short talks and networking for founders, investors, and researchers working in longevity biotech.",
    lat: 42.3614, lng: -71.0703
  },
  {
    title: "2026 Brain Aging Symposium",
    subtitle: "Biomarkers of the aging brain",
    start: "2026-10-07",
    type: "symposium",
    venue: "Harvard Medical School, Boston",
    host: "Biomarkers of Aging Consortium",
    url: "https://www.agingconsortium.org/brain-aging",
    description: "A half-day symposium on cognitive aging, neuroimaging, Alzheimer's disease, and the biomarkers used to track age-related cognitive decline.",
    lat: 42.3359, lng: -71.1046
  },
  {
    title: "2026 Reproductive Aging Symposium",
    subtitle: "Biomarkers of reproductive aging",
    start: "2026-10-07",
    time: "2–6:30 PM",
    type: "symposium",
    venue: "Harvard Medical School, Boston",
    host: "Biomarkers of Aging Consortium",
    url: "https://www.agingconsortium.org/reproductive-aging-symposium-2026",
    description: "An afternoon of talks on biomarkers of reproductive aging, with speakers from institutions in the US and Israel.",
    lat: 42.3359, lng: -71.1046
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
    lat: 42.3631, lng: -71.126
  },
  {
    title: "TEDxBerkshires",
    start: "2026-10-08",
    type: "talk",
    venue: "Berkshire Innovation Center, Pittsfield, MA",
    url: "https://www.tedxberkshires.com/",
    description: "An independently organized TEDx event in western Massachusetts.",
    lat: 42.4485, lng: -73.2447
  },
  {
    title: "2026 Healthy Aging Symposium at Harvard Chan",
    subtitle: "From cells to society: the science of extending healthspan",
    start: "2026-10-09",
    type: "symposium",
    venue: "Joseph B. Martin Conference Center, Boston",
    host: "Harvard T.H. Chan School of Public Health",
    url: "https://hsph.harvard.edu/healthy-aging/events/2026-healthy-aging-symposium/",
    description: "A full-day symposium spanning the biology, nutrition, epidemiology, social science, and policy of healthy aging.",
    lat: 42.3359, lng: -71.1046
  },

  // ---- Drafts: fill in and remove "draft: true" ----
  { title: "TBA: event organized by Doga and Adrian", start: "2026-10-10", type: "other", venue: "TBA", draft: true },
  { title: "TBA: David Sinclair event", start: "2026-10-10", type: "other", venue: "TBA", draft: true }
];

// ------------------------------------------------------------
//  Places: labs, companies, and organizations
//  Fields:
//    name          required
//    type          "lab" | "company" | "organization"
//    pi            principal investigator(s), for labs
//    institution   affiliation or location
//    topics        list of research areas
//    url           website, or ""
//    lat, lng      map coordinates; leave out to keep an entry off the map
//  Coordinates: right-click a building in Google Maps, the first menu
//  item is "lat, lng"; click it to copy.
//  SEED DATA — check every entry before launch.
// ------------------------------------------------------------
const PLACES = [
  // ---- Labs ----
  { name: "Gladyshev Lab", type: "lab", pi: "Vadim N. Gladyshev", institution: "Brigham and Women's Hospital, Harvard Medical School", topics: ["biomarkers of aging", "rejuvenation", "lifespan control"], url: "", lat: 42.3362, lng: -71.1069 },
  { name: "Sinclair Lab", type: "lab", pi: "David A. Sinclair", institution: "Harvard Medical School", topics: ["epigenetics", "reprogramming", "NAD+ biology"], url: "https://sinclair.hms.harvard.edu", lat: 42.3357, lng: -71.1035 },
  { name: "Guarente Lab", type: "lab", pi: "Leonard Guarente", institution: "MIT", topics: ["sirtuins", "NAD+ biology", "metabolism"], url: "https://guarentelab.mit.edu", lat: 42.3616, lng: -71.0906 },
  { name: "Haigis Lab", type: "lab", pi: "Marcia Haigis", institution: "Harvard Medical School", topics: ["mitochondria", "metabolism"], url: "", lat: 42.3357, lng: -71.1035 },
  { name: "Wagers Lab", type: "lab", pi: "Amy Wagers", institution: "Harvard University", topics: ["stem cells", "regeneration"], url: "", lat: 42.3792, lng: -71.116 },
  { name: "Blackwell Lab", type: "lab", pi: "T. Keith Blackwell", institution: "Joslin Diabetes Center, Harvard Medical School", topics: ["stress resistance", "C. elegans"], url: "", lat: 42.3389, lng: -71.1053 },
  { name: "Yankner Lab", type: "lab", pi: "Bruce A. Yankner", institution: "Harvard Medical School", topics: ["brain aging", "neurodegeneration"], url: "", lat: 42.3357, lng: -71.1035 },

  // ---- Organizations ----
  { name: "Biomarkers of Aging Consortium", type: "organization", institution: "Boston", topics: ["biomarkers", "standards", "clinical translation"], url: "https://www.agingconsortium.org", lat: 42.3359, lng: -71.1046 },
  { name: "Paul F. Glenn Center for Biology of Aging Research", type: "organization", institution: "Harvard Medical School", topics: ["biology of aging"], url: "", lat: 42.3357, lng: -71.1035 },
  { name: "Broad Institute", type: "organization", institution: "Cambridge", topics: ["genomics", "single-cell biology"], url: "https://www.broadinstitute.org", lat: 42.3628, lng: -71.0866 },
  { name: "Wyss Institute", type: "organization", institution: "Harvard University", topics: ["bioengineering", "organs-on-chips"], url: "https://wyss.harvard.edu", lat: 42.3392, lng: -71.103 },

  // ---- Companies ----
  { name: "Life Biosciences", type: "company", institution: "Boston", topics: ["partial reprogramming", "eye disease"], url: "", lat: 42.3467, lng: -71.0972 },
  { name: "Elevian", type: "company", institution: "Newton", topics: ["GDF11", "regeneration"], url: "", lat: 42.337, lng: -71.2092 }
];
