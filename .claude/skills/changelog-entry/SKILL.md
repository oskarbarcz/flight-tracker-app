---
name: changelog-entry
description: Write a MyPreflight changelog entry for the website (mypreflight.io/changelog) and open its PR to mypreflight/landing. Pins the app version and date, writes the title, summary and body in the product's voice, and adds real before and after screenshots captured with the app-screenshots skill. Use whenever a feature or a fix pilots will notice ships in the app, the API or the Transponder, whenever an AGENTS.md asks for a changelog PR, and whenever the user asks for a changelog entry, release note or "what's new" text for the website, even if they don't say "changelog".
---

# Changelog entry

One entry tells a pilot what changed, why it was worth building and what it looks like. It lives in the landing repo (`~/Projects/ft/landing`, `mypreflight/landing`) as a folder in `src/content/changelog/`. The landing repo's `AGENTS.md`, section "Changelog", is the source of truth for the schema and how entries render; read it first. This skill is how to produce a good one.

Product facts come from the knowledge base, read by URL:

- Feature status: https://raw.githubusercontent.com/mypreflight/product/main/features/catalogue.md
- Voice: https://raw.githubusercontent.com/mypreflight/product/main/product/brand/voice.md
- Screenshot rules: https://raw.githubusercontent.com/mypreflight/product/main/product/brand/screenshots.md

## 1. Decide whether it gets an entry

- A feature marked **Live** in the catalogue gets an entry. Partial and Planned ones wait until they're Live.
- A fix a pilot would notice gets a short entry, usually just a summary.
- Dependency bumps, CI, refactors, tests and docs get nothing.
- One entry per change a pilot experiences. A feature built across the app, the API and the Transponder is one entry, not three.

## 2. Collect the facts

Read every PR involved, not just the titles:

```bash
gh pr view <n> --repo mypreflight/app --json title,body,mergedAt
gh pr view <n> --repo mypreflight/api --json title,body,mergedAt
gh pr view <n> --repo mypreflight/transponder-app --json title,body,mergedAt
```

Write down what the pilot sees now, what was wrong or missing before, and the exact names and units on screen. Never describe behaviour you haven't confirmed in a PR, the code or the running app.

Then pin the three fields the build checks:

- **`date`**: the UTC merge time of the PR that made the change live, the last one if several had to land, e.g. `2026-11-03T10:31:52Z`.
- **`version`**: the web app version current once the change is live. For an app PR, its own `package.json` version. For an API- or Transponder-only change, the app version that was live at that moment:

  ```bash
  git -C ~/Projects/ft/flight-tracker-app fetch -q
  sha=$(git -C ~/Projects/ft/flight-tracker-app log origin/main -1 --before=<date> --format=%H)
  git -C ~/Projects/ft/flight-tracker-app show $sha:package.json | grep -m1 '"version"'
  ```

  Versions must not go backwards in date order; the landing build fails if one does. Check the release page exists: `https://github.com/mypreflight/app/releases/tag/<version>`. The app links to the changelog by its own version, so this field matters more than any other.
- **`area`**: one of `CHANGELOG.areas` in the landing repo's `src/constants.ts`.

## 3. Write it

The entry has three layers of text. Each does one job.

**Title**: a claim in a full sentence, at most 60 characters, saying what the pilot can now do. No full stop at the end; the build rejects one.

| Instead of | Write |
| --- | --- |
| Fuel reports | Report your fuel at any fix |
| Improved maps with FIR support | See the FIRs you fly through |
| GSX integration update | GSX can start boarding and deboarding |

**Summary**: one or two sentences, at most 320 characters: what changed and where, with the names and units the pilot will see. It is also the feed summary and the page's meta description, so it must stand alone.

> In cruise, the fix card and the nav log take the fuel on board at a fix, in tonnes, and show it against the plan's EFOB. Below the plan reads amber, above it green, and below the minimum fuel it turns red with a warning sign.

**Body** (features only): one short paragraph, two at most, of plain prose that weaves together:

1. what was missing or wrong before,
2. what the change does for a flight, the value in practice,
3. how airline crews do the same, but only when you're sure it's accurate.

Weave, don't label. No "Why it matters", no "How airline crews do it", no headings, no bullet lists of sub-features, nothing the summary already said. Read it aloud: it should sound like a pilot explaining it to another pilot.

> SimBrief tells you how much fuel you should have at every fix, but until now nothing showed what you actually had. Airline crews make the same check at set waypoints, writing the fuel on board next to the planned figure in the nav log, on paper or on the tablet that holds their flight plan. Done in cruise, it shows early whether a stronger headwind or a faster cruise is eating into your reserves, while there's still time to change speed, level or plan.

Airline comparisons already checked and used, as a guide to the level of certainty needed:

- Fuel checks against the planned figure at set waypoints, logged on the nav log or an electronic flight plan.
- The four times airlines log for every flight: out of the gate, off the ground, on the ground, in at the gate.
- The nav log lists track, MORA, altitude, wind, fuel and timings for every waypoint.
- Enroute charts mark FIR boundaries; crews change frequency there and need a clearance to enter oceanic airspace.
- Long-haul flights follow great circles, bent by winds and airspace.
- At a real gate the ground handling agent opens and closes boarding, not the crew.
- Crews read the ETA off the FMC's progress page and send revised times to their company by datalink.

If a comparison needs hedging to be true, leave it out. Some features have none (globe maps, sign-in, dashboard changes), and that's fine.

Voice rules that apply everywhere:

- Plain English, short sentences, aviation terms used correctly, units written the product's way (`7.90 t`, `06:20Z`, `FL330`, `243 nm`).
- Address the pilot as "you". Specific beats generic: name the screen, the button, the figure.
- No hype. Cut "seamless", "powerful", "enhanced", "game-changing", "we're excited", "now you can easily".
- No em dashes; the build rejects them in frontmatter. Use a colon, a comma or a full stop.
- Flight simulation only. Never suggest MyPreflight is for real-world flying, training or operations.
- Write quotes, apostrophes and the space between a number and its unit plainly; the site typesets them.
- Short beats padded. If a fix needs one sentence, it gets one sentence.

## 4. Screenshots

Use the `app-screenshots` skill in this repo. Its Discord graphics and this entry share the same captures; the slide's headline, lede and Before and After lines map to the title, summary and captions.

- **Before** from `main` (or the release before the change), **after** from the branch, against the same seeded flight, clock, theme, viewport (1440x900) and crop, at `CDP_SCALE=2`.
- Crop to the component that changed. The changelog column is about 850 px wide and images render at half their pixel size, so a whole 1440 px view shrinks; keep whole views for layout changes.
- Capture light and dark.
- A new screen with no previous version gets an after only. A change with nothing to see gets no figure.
- Never fake the UI or edit a rendered value. If demo data looks broken, fix the data.
- If a shot needs a typed value, type it against the local API only and say so in `footnote`. Open dialogs and cancel them, and say that too. Nothing else goes in a footnote: demo data, the shifted clock and UTC are how every shot is made, not news to the reader.

Good subjects in the seed: AA4912 (`2d1c92f6-8ed1-4921-9a70-f71b1ed2e72d`), Boston to Philadelphia, in cruise with a planned route at `CDP_CLOCK=2025-01-01T14:40:07Z`; LH102 (`1e9f4176-188f-41a5-a9d1-25a96579f46d`), New York JFK to Frankfurt, for long-haul maps at the same clock; the cabin crew dashboard at `2025-01-01T12:20:00Z`.

Encode to AVIF and name the files after their role:

```bash
avifenc -q 72 -y 444 -s 4 before-light.png before-light.avif
```

Each shot needs `alt` text describing what the screen shows, with the real figures, and an optional one-sentence `caption`. Before and after captions say what the pilot would recognise, not what the code does.

## 5. Write the files

In the landing repo, on a branch named `changelog/<slug>`:

```text
src/content/changelog/YYYY-MM-DD-<slug>/
├── index.md
├── before-light.avif
├── before-dark.avif
├── after-light.avif
└── after-dark.avif
```

The folder name is the entry's URL; never rename one once published.

```markdown
---
title: "Report your fuel at any fix"
date: 2026-11-03T10:31:52Z
version: "2.124.0"
area: "Flight tracking"
summary: "In cruise, the fix card and the nav log take the fuel on board at a fix, in tonnes, and show it against the plan's EFOB."
figures:
  - before:
      light: ./before-light.avif
      dark: ./before-dark.avif
      alt: "The fix card for CMK, folded to its Fuel section: EFOB 8.05 t, MFOB 2.15 t, burn to this point 3.55 t and leg burn 0.90 t."
      caption: "The Fuel section showed the flight plan's figures, and nothing else."
    after:
      light: ./after-light.avif
      dark: ./after-dark.avif
      alt: "The same fix card with an actual 7.90 t reading 0.15 t under the plan, next to an Update button."
      caption: "Report once at a fix, then Update it as often as you need until you land."
footnote: "Fuel reports typed in for the demo."
---

SimBrief tells you how much fuel you should have at every fix, but until now nothing showed what you actually had. ...
```

Bump `version` in the landing `package.json` (and `package-lock.json`); the PR check fails when the version is already tagged.

## 6. Check and open the PR

```bash
npm run lint && npm run astro check && npm run build
npm run preview
```

Open `/changelog/` and `/changelog/<folder>/` and look at the entry in light and dark, on desktop and at phone width. Switch Before and After, open `/changelog/?version=<version>` and confirm it lands on the entry, and follow "See on GitHub".

Then open the PR to `mypreflight/landing`, titled `Add the changelog entry for <title>`. Link the feature PRs in the body. Open it as a draft while any of them is unmerged, and say so. No Claude attribution in commits or the PR body.

## Before you finish

- [ ] The feature is Live in the catalogue, or the fix is one a pilot would notice.
- [ ] `version` is the app version live once the change shipped, and its GitHub release exists.
- [ ] The title is a claim without a full stop at the end, at most 60 characters.
- [ ] The summary stands alone and names what's on screen.
- [ ] The body reads as prose, without labels or a repeat of the summary.
- [ ] Every airline comparison is one you're sure of.
- [ ] Screenshots are real, cropped to the change, in both themes, before and after from the same crop.
- [ ] Lint, `astro check` and the build pass, and you looked at the rendered entry.
