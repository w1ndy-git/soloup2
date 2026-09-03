/**
 * SoloUp — single source of truth for copy, links and contact details.
 *
 * Every string here is either taken VERBATIM from the current soloup.org page
 * or is clearly marked as new. Nothing about the organisation is invented.
 *
 * ⚠️  FIELDS MARKED `null` ARE UNKNOWN — the current site publishes no email,
 *     phone or postal address anywhere on the page. Fill them in here once and
 *     they appear everywhere (header, footer, contact section, QR poster).
 *     Until then the UI hides those rows rather than showing a fake.
 */

export const SITE_URL = 'https://soloup.org';

export const org = {
  name: 'SoloUp',
  // The acronym is only visible in the logo artwork on the current site.
  tagline: 'Seeds of Limitless Opportunities',
  parentProgram: 'Cultivate Goodness',
  parentOrg: 'Queen Creek Botanical Gardens',
  heroKicker: 'A Cultivate Goodness Program',
  heroHeadline: 'Skills. Confidence. Purpose.',
  heroBody:
    'SoloUp helps young adults with disabilities grow beyond the classroom and into meaningful adult lives through hands-on learning, personalized coaching, real work experience, and supportive community.',
  footerBlurb:
    'SoloUp is a program of Cultivate Goodness, developed in partnership with community organizations and employers committed to helping young adults with disabilities build purposeful, productive lives.',
};

export const links = {
  donate: 'https://cultivategoodness.app.neoncrm.com/forms/donate',
  interestForm: 'https://cultivategoodness.app.neoncrm.com/forms/pathways-to-purpose-interest-form',
  volunteer: 'https://qcgardens.org/volunteering/',
  cultivateGoodness: 'https://qcgardens.org/cultivate-goodness/',
  parentSite: 'https://qcgardens.org/',
  instagram: 'https://www.instagram.com/QueenCreekBotanicalGardens',
  facebook: 'https://facebook.com/QC_Gardens',
};

/**
 * ⚠️ TODO(SoloUp): none of these exist on the current site. Add them here.
 * The Contact section renders a visible "not published yet" notice while they
 * are null, so the gap is obvious to staff and never shown as a fake value.
 */
export const contact = {
  email: null, // e.g. 'hello@soloup.org'
  phone: null, // e.g. '(480) 555-0134'
  addressLines: null, // e.g. ['Queen Creek Botanical Gardens', 'Queen Creek, AZ 85142']
  ein: null, // e.g. '00-0000000' — adds the EIN to the 501(c)(3) footer line
};

/*
 * Confirmed on the Cultivate Goodness donation form, so it can be stated
 * without an EIN: "Cultivate Goodness, Inc. is a federally recognized 501(c)(3)
 * nonprofit organization." Donors look for this before giving.
 */
export const isRegistered501c3 = true;

/*
 * On the donation form both the Fund and Campaign dropdowns default to BLANK.
 * A donor who leaves them alone gives to Cultivate Goodness generally rather
 * than to SoloUp, and nothing on the current site says so.
 *
 * These are the exact option labels a donor sees — do not paraphrase them, or
 * people will scan the dropdown for wording that is not there. The fund is not
 * called "SoloUp Program"; that text is a heading elsewhere on the form.
 */
export const donationFundName = 'SoloUP (Cultivating Independence)';
export const donationCampaignName = 'Solo-Up';

/* Anchor navigation. Replaces the six dead `href="##"` links on the current page. */
export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#how', label: 'How It Works' },
  { href: '#stories', label: 'Stories' },
  { href: '#impact', label: 'Impact' },
  { href: '#involved', label: 'Get Involved' },
  { href: '#share', label: 'Share' },
];

/* "The SoloUp Journey — From potential to purpose." (verbatim) */
export const journey = [
  { n: 1, title: 'Discover strengths', body: 'Interests, abilities, and goals' },
  { n: 2, title: 'Build confidence', body: 'Life, social, and work skills' },
  { n: 3, title: 'Practice with purpose', body: 'Supported hands-on experiences' },
  { n: 4, title: 'Step into opportunity', body: 'Employment and lasting belonging' },
];

/* "Why SoloUp — Adulthood should open doors, not close them." (verbatim) */
export const pillars = [
  {
    icon: 'Compass',
    title: 'Personal Direction',
    body: 'Each participant develops an individualized pathway based on interests, abilities, support needs, and long-term goals.',
  },
  {
    icon: 'Wrench',
    title: 'Practical Skills',
    body: 'Participants build confidence through real responsibilities, workplace routines, communication, problem-solving, and daily living skills.',
  },
  {
    icon: 'Sprout',
    title: 'Meaningful Belonging',
    body: 'Learning happens in supportive community settings where participants are known, valued, needed, and encouraged to contribute.',
  },
];

/* "How It Works — A supported pathway toward greater independence." (verbatim) */
export const phases = [
  {
    phase: 'Phase 1',
    title: 'Explore',
    body: 'Identify strengths, interests, motivations, support needs, and possible career directions.',
    icon: 'Search',
  },
  {
    phase: 'Phase 2',
    title: 'Prepare',
    body: 'Develop work habits, communication, teamwork, transportation, time management, and self-advocacy.',
    icon: 'GraduationCap',
  },
  {
    phase: 'Phase 3',
    title: 'Practice',
    body: 'Apply skills through supervised projects, internships, garden-based work, hospitality, events, and community service.',
    icon: 'Hammer',
  },
  {
    phase: 'Phase 4',
    title: 'Place & Support',
    body: 'Connect participants with employers and continue coaching to help both employee and workplace succeed.',
    icon: 'Handshake',
  },
];

/* "The Impact — Success is more than getting a job." (verbatim) */
export const impact = {
  heading: 'Success is more than getting a job.',
  body:
    'It is waking up with purpose, contributing something meaningful, developing trusted relationships, and knowing there is a place where your strengths matter.',
  pullQuote:
    'SoloUp is designed to help each participant move from dependence toward confidence, contribution, and a life of greater possibility.',
  /* These are the programme's own descriptors, not measured statistics. */
  markers: [
    { label: '1:1', body: 'Individualized growth planning' },
    { label: '360°', body: 'Whole-person skill development' },
    { label: 'Real', body: 'Workplace and community experience' },
    { label: 'Long-term', body: 'Coaching and employer support' },
  ],
};

/*
 * "Get Involved" — three audiences.
 * FIX: on the current site the Families and Employers buttons both point at the
 * same families interest form. Employers and volunteers now route somewhere
 * that actually matches the ask.
 */
export const audiences = [
  {
    key: 'families',
    icon: 'Heart',
    title: 'For Families',
    body: 'Learn whether SoloUp may be a fit for your young adult and join our interest list for upcoming enrollment opportunities.',
    cta: 'Join the interest list',
    href: links.interestForm,
    tone: 'gold',
  },
  {
    key: 'employers',
    icon: 'Building2',
    title: 'For Employers',
    body: 'Create supported internships, job trials, or employment opportunities that strengthen both your workplace and the community.',
    cta: 'Become a partner',
    href: '#partner',
    internal: true,
    tone: 'ocean',
  },
  {
    key: 'supporters',
    icon: 'Sparkles',
    title: 'For Supporters',
    body: 'Fund coaching, transportation, tools, training, scholarships, and job development for participants who are ready to grow.',
    note: 'On the donation form the Fund box starts blank. Choose “SoloUP (Cultivating Independence)” so your gift is earmarked for SoloUp rather than the general fund.',
    cta: 'Support the mission',
    href: links.donate,
    tone: 'leaf',
  },
];

export const closing = {
  heading: 'Let’s help more young adults SoloUp.',
  body: 'Join us in creating pathways to confidence, contribution, meaningful work, and lasting community.',
};

/* Pre-written captions offered on the Share panel. */
export const shareMessages = [
  {
    key: 'short',
    label: 'Short',
    text: `${org.name}: ${org.tagline}. Helping young adults with disabilities build skills, confidence and purpose. ${SITE_URL}`,
  },
  {
    key: 'why',
    label: 'Why it matters',
    text: `Too many young adults with disabilities lose structured support the moment school ends. ${org.name} bridges that gap with coaching, real work experience and a community that knows them. Learn more or help out: ${SITE_URL}`,
  },
  {
    key: 'employer',
    label: 'For employers',
    text: `Hiring? ${org.name} builds supported internships and job placements for young adults with disabilities — and coaches both the employee and the workplace. Partner with them: ${SITE_URL}`,
  },
  {
    key: 'ask',
    label: 'Direct ask',
    text: `I'm sharing ${org.name} — they help young adults with disabilities move from dependence toward confidence and meaningful work. Scan the code or visit ${SITE_URL} to give or get involved.`,
  },
];
