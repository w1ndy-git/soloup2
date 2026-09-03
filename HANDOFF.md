# SoloUp site rebuild — handoff

Rebuild of the SoloUp page currently at `soloup.org` (which redirects to
`qcgardens.org/soloup-2/`).

All body copy is carried over **verbatim** from the existing page. The brand
palette was lifted from the live stylesheet's own CSS variables, so colours
match the organisation's existing identity rather than being reinvented.

---

## Do this first: publish the app

**The Ask SoloUp assistant cannot work until you hit Publish in the Base44
editor.** Until then every API call returns 403 `not_deployed`, and the
assistant shows "The assistant goes live once this app is published" with a
link to the interest form. The same applies to the Testimonial and
PartnerInquiry entities — the testimonial gallery falls back to its placeholder
cards while unpublished, which is why it still looks correct in preview.

Once published, verify the assistant with:

```bash
npm i -D playwright jsqr && npx playwright install chromium
npm run build && node scripts/agentcheck.mjs
```

That script asks it nine questions, including four it must refuse (eligibility,
cost, contact details, start dates) and a prompt-injection attempt. See
"Verification" below.

---

## Things you need to fill in

These are the only places where real information is missing. Nothing has been
invented to paper over them.

### 1. Contact details — `src/lib/siteConfig.js` → `contact`

The current page publishes **no email address, phone number, or postal address
anywhere**. Set them once here and they appear in the footer automatically:

```js
export const contact = {
  email: 'hello@soloup.org',
  phone: '(480) 555-0134',
  addressLines: ['Queen Creek Botanical Gardens', 'Queen Creek, AZ 85142'],
  ein: '00-0000000',        // adds the 501(c)(3) line to the footer
};
```

While these are `null` the footer omits those rows rather than showing a
placeholder.

### 2. Real video testimonials — `Testimonial` entity

The gallery ships with **four placeholder cards**, each showing an amber
`SAMPLE` badge and an editor notice above the grid. They describe the kind of
story that belongs in each slot; **no real person is quoted anywhere.**

To replace them, add records under **Testimonial** in the Base44 dashboard:

| Field | Notes |
| --- | --- |
| `name` | First name + initial unless full-name consent is on file |
| `role` | e.g. "SoloUp participant", "Parent", "Partner employer" |
| `category` | `participant` / `family` / `employer` / `volunteer` — drives the filter tabs |
| `video_url` | YouTube, Vimeo, or a direct `.mp4`. All three are handled |
| `transcript` | **Required for accessibility** — screen reader users cannot access spoken video |
| `published` | Must be `true` to appear |
| `is_sample` | Leave `false` |
| `consent_on_file` | Internal tracking for signed media releases |

As soon as one record exists with `published: true` and `is_sample: false`, the
four placeholders disappear on their own.

Captions are switched on by default for YouTube embeds (`cc_load_policy=1`).

### 3. The interest form asks nothing about the programme

The form at the "Join the interest list" link is NeonCRM's stock **Account
Registration**: name, email, phone, address, a marketing-consent checkbox and an
optional login. It asks nothing about the young adult, and cannot tell a family
from an employer from a volunteer — the exact distinction the Get Involved
section draws. Its consent line also opts people into the Queen Creek Botanical
Gardens list rather than SoloUp's.

Worth adding programme questions to that form, or creating a SoloUp-specific
one. Until then the assistant tells people the form does not ask programme
questions, so specifics should go to staff.

### 4. Donations do not reach SoloUp unless the donor changes a dropdown

The donation form has a **Campaign Fund** selector with a **"SoloUp Program"**
option that is **not the default**. Someone who arrives from the SoloUp page,
clicks Donate and fills the form in without touching that dropdown funds
Cultivate Goodness generally.

The rebuild now says this on the Supporters card, and the assistant volunteers
it whenever anyone asks about giving. The better long-term fix is a donation
link that pre-selects the fund, if NeonCRM supports it.

### 5. Employer enquiries — `PartnerInquiry` entity

On the live site the **"For Employers"** button points at the *families*
interest form, so employers were being asked about their young adult. That CTA
now opens a proper employer intake form, and submissions land in the
`PartnerInquiry` entity.

**Someone needs to watch that entity**, or better: create a dedicated employer
form in NeonCRM and swap the link in `siteConfig.js` → `audiences` →
`employers.href`.

---

## Issues found on the live page, and what was done

| # | Issue on `qcgardens.org/soloup-2/` | Fix |
| --- | --- | --- |
| 1 | `maximum-scale=1` in the viewport meta blocked pinch-zoom — a WCAG 1.4.4 failure, on a site serving people with disabilities | Removed; zoom works |
| 2 | "For Employers" CTA pointed at the families interest form | Dedicated employer intake form |
| 3 | No email, phone or address anywhere on the page | Footer contact block, driven by `siteConfig` (awaiting real values) |
| 4 | SoloUp logo had `alt=""` in both places | Real alt text, and the logo is a link to the top |
| 5 | Six nav links with `href="##"` | Real anchors to real sections |
| 6 | Footer read "© Queen Creek Botanical Gardens" on a SoloUp page | Correct programme-within-organisation attribution, plus an EIN slot |
| 7 | No social links at all | Instagram and Facebook in the footer and share panel |
| 8 | Logo was a JPEG — white box on any coloured background | Transparent PNG, tinted to brand navy, white-inverted via CSS on dark surfaces |
| 9 | Page carried the full QC Gardens retail nav (Food & Drink, EGIFT Cards, Farmers Market) | SoloUp-only nav, so the ask is not competing with gift-shop links |
| 10 | Emoji (🧭 🛠️ 🌿 💛 🏢 🌟) used as icons — screen readers read them aloud | Labelled SVG icons, `aria-hidden` |
| 11 | Brand green `#5f8f4e` gives only 3.8:1 against white — fails AA for text | Text/gradient green darkened to `#3f6b33` (6.2:1). Original kept as `--leafbright` for decorative fills |
| 12 | No Open Graph tags — every share rendered as a bare URL | Full OG + Twitter card metadata |

## What was added

- **Video testimonials** — filterable gallery, accessible dialog (focus trap,
  Escape to close, focus restored), captions on by default, transcript panel.
- **QR + social sharing** — live QR code with the logo knocked out of the
  middle, retargetable at the homepage / donate form / interest form,
  downloadable as PNG, plus a printable flyer. Pre-written share captions,
  one-tap posting to Facebook / LinkedIn / WhatsApp / email / SMS, and the
  native share sheet on mobile.
- **Mobile** — real disclosure menu with scroll lock and Escape, no horizontal
  overflow at 390px, every tap target ≥24px.

---

## Verification

`scripts/audit.mjs` and `scripts/qrcheck.mjs` are dev-only tools. To run them:

```bash
npm i -D playwright jsqr && npx playwright install chromium
npm run build
node scripts/audit.mjs    # contrast, tap targets, keyboard paths, dialogs
node scripts/qrcheck.mjs  # decodes each QR back out of the canvas
```

Current status — all passing:

- WCAG AA contrast failures: **0**
- Tap targets under 24px: **0**
- Heading-level jumps: **0**
- Clipped or overflowing text: **0**
- Horizontal overflow at 390px: **none**
- Console errors: **none**
- Video dialog: `aria-modal`, labelled, focus trapped, Escape closes
- Mobile menu: `aria-expanded` correct, scroll locked, Escape closes
- QR codes: **3/3 decode correctly** through the logo knockout

`scripts/qrcheck.mjs` matters more than it looks — putting a logo in the middle
of a QR code can silently break scanning. It reads the pixels back and decodes
them, so a broken code fails the check instead of a printed flyer.
