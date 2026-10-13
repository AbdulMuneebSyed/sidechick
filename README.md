# Indilabs.ai website

A rebuild of [indilabs.ai](https://indilabs.ai) in Next.js. The layout and motion take their cues from Ramp and Attio; the words, figures, images and videos all come from Indilabs' own site.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # content check + unit tests
npm run lint
npm run build && npm start
```

Requires Node 20.9 or newer.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home: hero with dashboard tour, results, pillars, lifecycle stepper, Riskube Engine, customer types, before/after, call to action |
| `/about` | About Indilabs |
| `/demo` | Book a Demo form |
| `/demo/thanks`, `/demo/unsent` | Where the form lands when JavaScript is off |
| `/api/lead` | Receives form submissions |

## Demo form: one setting needed

Submissions are forwarded as JSON to the URL in `LEADS_WEBHOOK_URL`. Copy `.env.example` to `.env.local` (or add the variable in Vercel → Settings → Environment Variables) and point it at any webhook: Zapier, Make, Slack incoming webhook, HubSpot, a Google Apps Script, etc.

```json
{ "name": "…", "company": "…", "email": "…", "message": "…", "source": "indilabs.ai/demo", "receivedAt": "2026-10-13T12:00:00.000Z" }
```

Without it, the form tells visitors their message couldn't be sent and points them to info@indilabs.ai. It never shows a false thank-you.

## Deploy (Vercel)

1. Push this folder to a GitHub repository.
2. Import it at vercel.com/new. The defaults are correct; no build settings to change.
3. Add `LEADS_WEBHOOK_URL`.
4. Point the indilabs.ai domain at the project.

The sitemap, robots.txt, social share image and canonical URLs assume the site lives at `https://indilabs.ai` (set in `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`).

## Content rule: nothing invented

Every line of marketing copy lives in `content/site.ts` and is tagged with where it came from:

- **S1**: the indilabs.ai home page, including text inside its images
- **S2**: indilabs.ai/about
- **S3**: copy shipped inside the indilabs.ai code bundle (sections that exist but weren't displayed)

`npm test` checks every string against snapshots of the live site in `sources/`. If a line isn't found there, the test fails. The three typo corrections ("a industry" → "an industry", and two doubled full stops) are listed in `content/edits.ts`.

To change copy, edit `content/site.ts`. If the new wording isn't on indilabs.ai yet, update the site first or refresh the snapshots in `sources/`.

### Text that isn't from indilabs.ai

For the owners to approve or reword:

- **Form messages** (`content/ui.ts`): "Sending…", "(optional)", and the email-us line shown if a submission fails. The old form never actually sent anything, so it never needed these.
- **Accessibility labels**, which screen readers announce but aren't shown on the page: "Skip to content", "Open menu" / "Close menu", "Main" (navigation), "Results", "Lending lifecycle", "Dashboard tour", "Email", "Phone", and alt text describing each product screenshot.

## Media

All imagery and video comes from indilabs.ai. `scripts/extract-assets.py` downloads it and `scripts/process-assets.mjs` produces what's in `public/media/`. Derived pieces, approved in advance:

- **Dark-text logo** for light backgrounds: the original white wordmark, recoloured.
- **Dashboard tour** in the hero: an animated camera pan across the original 3-step dashboard image.
- **Step crops**: the Monitor, Optimize and Execute columns cut from that same dashboard.
- **Animated lifecycle loop and Riskube diagram**: drawn in code from the original diagrams.
- **Customer type videos**: the five videos shipped with indilabs.ai but never shown, re-encoded for the web.
- **Favicon and share image**: built from the logo mark, headline and dashboard.

## Structure

```
app/            routes, metadata, sitemap, robots, share image
components/
  home/         one file per home page section
  site/         nav, footer, logo
  forms/        Book a Demo form
  ui/           button, reveal-on-scroll, count-up
content/        all copy (site.ts), form messages (ui.ts), typo fixes (edits.ts)
lib/lead.ts     form validation shared by browser and server
sources/        snapshots of indilabs.ai used by the content test
tests/
```
