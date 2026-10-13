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
| `/` | Home: hero film, results, pillars, lifecycle tabs, Riskube Engine, customer types, before/after, call to action |
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
- **Film controls** (`content/ui.ts`): "Pause" / "Play", the screen-reader names of the hero film's pause button.
- **Accessibility labels**, which screen readers announce but aren't shown on the page: "Skip to content", "Open menu" / "Close menu", "Main" (navigation), "Results", "Lending lifecycle", "Dashboard tour", "Email", "Phone", and alt text describing each product screenshot.

## Media

All imagery and video comes from indilabs.ai. `scripts/extract-assets.py` downloads it and `scripts/process-assets.mjs` produces what's in `public/media/`. Derived pieces, approved in advance:

- **Dark-text logo** for light backgrounds: the original white wordmark, recoloured.
- **Hero film**: a ~9-second looping sequence (overview → Monitor → Optimize → Execute → results) built from the original 3-step dashboard. Each of its nine cards (KPI tile and two charts per step) is cut out at native resolution (`public/media/film/`) and moves as its own layer, so nothing is ever enlarged past its source pixels. Captions are the step labels, actions and published results already on indilabs.ai.
- **Step crops**: the Monitor, Optimize and Execute columns cut from that same dashboard.
- **Lifecycle tabs**: Monitor / Optimize / Execute panels built from each step's three dashboard cards (the same native-size crops as the film).
- **Riskube Engine diagram**: the original "Platform Capabilities" diagram redrawn as an animated-beam flow (data → engine hub → seven capabilities) with real HTML text.
- **Customer type videos**: the five videos shipped with indilabs.ai but never shown, re-encoded for the web.
- **Favicon and share image**: built from the logo mark, headline and dashboard.

## Motion

Animations stay light enough for low-end phones:

- Only `transform` and `opacity` are animated (no animated blur, shadows or layout).
- The hero entrance is plain CSS, so it plays with the first paint instead of waiting for JavaScript.
- Scroll reveals and the nav menus are CSS transitions, with no animation library on the About and Demo pages.
- [Motion](https://motion.dev) is loaded only on the home page, for the film, the lifecycle tabs, the word-by-word "Why" statement and the customer-type panel. The Riskube diagram animates with CSS only. Its animation engine is fetched after first render.
- The film starts once it's scrolled into view, pauses when it's scrolled away or the tab is hidden, and has a pause button.
- With the system "reduce motion" setting on, movement is replaced by simple fades and the film doesn't auto-play.

## Structure

```
app/            routes, metadata, sitemap, robots, share image
components/
  home/         one file per home page section
  site/         nav, footer, logo
  forms/        Book a Demo form
  ui/           button, reveal-on-scroll, hero entrance, count-up, Motion setup
content/        all copy (site.ts), form messages (ui.ts), typo fixes (edits.ts)
lib/lead.ts     form validation shared by browser and server
sources/        snapshots of indilabs.ai used by the content test
tests/
```
