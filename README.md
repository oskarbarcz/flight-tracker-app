<div align="center">

[![oskar barcz / flight-tracker-app][banner]][homepage]

The web app of [**MyPreflight**][homepage] platform. The electronic flight board itself: dispatch, briefing, check-in
and live tracking, in the browser.
</div>

## About

**MyPreflight** is a briefing service and electronic flight board app for your virtual flights, providing you realistic
figures, checklists, procedures and data to perform your flight like a real pilots do. You can customize your
experience, integrate with SimBrief and other tools. Check out our homepage at [mypreflight.io][homepage].

**This module** is the part running in your browser. It is where every role does its work:
- dispatches flights — schedules, fleet, crew and passengers, preliminary loadsheet and fuel figures,
- walks the pilot through check-in, boarding, off-block, airborne and on-block, with the timesheet, the OFP and the
  final loadsheet filled at finish-boarding,
- draws the live map from the ADS-B feed and the flight event stream, and gives every flight a public link to share,
- keeps the airport library — runways, terminals, parking positions, gates and NOTAMs,
- installs as a PWA on desktop and phone, and prompts to reload when a new version ships.

The API lives in [flight-tracker-api][repo-api] and the desktop companion in
[flight-tracker-transponder-app][repo-transponder].

[![integrity][ci-badge]][ci-url]
[![release][release-badge]][release-url]
[![license][license-badge]][license-url]

### Built with

[![TypeScript][ts-badge]][ts-url]
[![React][react-badge]][react-url]
[![React Router][rr-badge]][rr-url]
[![Vite][vite-badge]][vite-url]
[![Tailwind CSS][tw-badge]][tw-url]
[![Flowbite][flowbite-badge]][flowbite-url]
[![Leaflet][leaflet-badge]][leaflet-url]

A React Router SPA — `ssr: false`, no server of its own, deployed as static files. Code is sliced by domain under
`app/features/<domain>`, each owning its service, model and components; state is React Context only, no store library.
Forms are Formik with Yup schemas, maps are Leaflet, and the tracking dashboard listens on a socket.io flight event
stream.

## Getting started

### Requirements

- **Node 26** (see `.nvmrc`)
- A running **MyPreflight API** — locally or the production one. Without it you get no further than the sign-in screen.

### Install with a local API (recommended)

1. Clone both projects:

   ```shell
   git clone git@github.com:oskarbarcz/flight-tracker-app.git
   git clone git@github.com:oskarbarcz/flight-tracker-api.git
   ```

2. Prepare an environment variable file by copying `.env` to `.env.local` and fill it with your data.

   ```shell
   cd flight-tracker-app
   cp .env .env.local
   ```

   `.env` holds the production defaults, so point the copy at your local API:

   ```shell
   VITE_NODE_ENV=development
   VITE_FLIGHT_TRACKER_API_HOST=http://localhost
   VITE_ADSB_API_HOST=http://localhost:1080
   ```

3. Set up the API. Packages, database schema and seed data are configured automatically.

   ```shell
   cd ../flight-tracker-api
   docker compose up -d --build
   ```

4. Set up this project:

   ```shell
   cd ../flight-tracker-app
   nvm use          # optional
   npm install
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173). The seeded accounts all share the password `P@$$w0rd`:

   | Role           | Username                 |
   |----------------|--------------------------|
   | **Operations** | `operations@example.com` |
   | **Cabin crew** | `cabin-crew@example.com` |
   | **Admin**      | `admin@example.com`      |

   The API's README lists the rest, including the users seeded with SimBrief, Google and Discord already connected.

6. Enjoy!

### Install against the production API

Clone this repository alone, `npm install`, `npm run dev`, and leave `.env` as it is. There are no public accounts —
you have to be registered already to sign in.

### Environment

| Variable                       | Required | Description                                                                      |
|--------------------------------|----------|----------------------------------------------------------------------------------|
| `VITE_NODE_ENV`                | yes      | `development` turns on debug surfaces, `production` marks the build as released.  |
| `VITE_FLIGHT_TRACKER_API_HOST` | yes      | Base URL of the API. The app throws on start without it.                         |
| `VITE_ADSB_API_HOST`           | yes      | Base URL of the ADS-B receiver serving live positions.                            |
| `VITE_DISCORD_INVITATION_HASH` | yes      | Invite hash behind the "join the community" links.                               |
| `VITE_GOOGLE_CLIENT_ID`        | no       | Enables Google sign-in and account linking.                                      |
| `VITE_DISCORD_CLIENT_ID`       | no       | Enables Discord sign-in and account linking.                                     |

`import.meta.env.PACKAGE_VERSION` is injected by Vite from `package.json`.

Third-party sign-in is off unless configured. Leave both client IDs unset and the app runs on email and password alone,
with no Google or Discord identity surface anywhere — `VITE_DISCORD_INVITATION_HASH` is separate and keeps working,
because the community invite needs no client.

`VITE_GOOGLE_CLIENT_ID` must be the same OAuth 2.0 Web client ID as the API's `GOOGLE_CLIENT_ID` — the API checks the ID
token's audience against its own value, and a mismatch surfaces as `Google token is not valid.` The app's origin has to
be an authorized JavaScript origin on that client.

`VITE_DISCORD_CLIENT_ID` needs `<origin>/auth/discord/callback` registered as a redirect URI on the Discord
application, exact match included (`http://localhost:5173/auth/discord/callback` for local dev). Discord OAuth is a
full-page redirect, unlike Google's in-page token, and the deep link reaches the router through `public/404.html` plus
`public/ghspa.js` — a rewrite that only exists in a built app, so test that flow on a build, not on `npm run dev`.

## Development

```shell
npm run dev        # vite dev server with hmr on :5173
npm run lint       # biome, linter and formatter
npm run lint:fix   # biome, autofix
npm run typecheck  # react-router typegen, then tsc
npm run build      # production build into build/client
```

No test framework is configured; CI runs lint, typecheck and build.

Two things to know when working locally. The dev server mounts twice, so every API call fires about twice — production
does not, so check network volume on a build. And the service worker and the GitHub Pages deep-link rewrite are absent
from `npm run dev` entirely, so anything touching them needs `npm run build` and a static server on port 5173, which
keeps the API's CORS origin valid.

Design context lives in [`PRODUCT.md`](PRODUCT.md), the visual system in [`DESIGN.md`](DESIGN.md) and the component
inventory in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Build, test and deploy

This project uses [semantic versioning](https://semver.org/spec/v2.0.0.html). The version in `package.json` must be
bumped before a pull request merges — `bin/check_version_is_free` fails the build otherwise.

Continuous integration and deployment run on GitHub Actions, configured in `.github/workflows`. Pull requests are
linted, typechecked and built; a push to `main` builds, tags the release from `package.json` and deploys to GitHub
Pages.

## Contact

My name is Oskar, an experienced programmer, cybersecurity enthusiast, and conference speaker from Poland. Feel free to
contact me via the platforms below:

<div align="center">

[![LinkedIn][linkedin-badge]][linkedin-url]
[![GitHub][github-badge]][github-url]
[![Website][web-badge]][web-url]

</div>

## License

A public domain under the [Unlicense][license-url]. Do what you want with it. I am an experienced software engineer, but
I am not connected anyhow with the airline industry. This project is created for educational purposes only and should
not be used for real-world aviation operations.

[linkedin-badge]: https://img.shields.io/badge/Oskar%20Barcz-0A66C2?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZiI%2BPHBhdGggZD0iTTIwLjQ1IDIwLjQ1aC0zLjU1di01LjU3YzAtMS4zMy0uMDMtMy4wNC0xLjg1LTMuMDQtMS44NSAwLTIuMTQgMS40NS0yLjE0IDIuOTR2NS42N0g5LjM1VjloMy40MXYxLjU2aC4wNWMuNDgtLjkgMS42NC0xLjg1IDMuMzctMS44NSAzLjYgMCA0LjI3IDIuMzcgNC4yNyA1LjQ2djYuMjl6TTUuMzQgNy40M2MtMS4xNCAwLTIuMDYtLjkzLTIuMDYtMi4wNiAwLTEuMTQuOTItMi4wNiAyLjA2LTIuMDYgMS4xNCAwIDIuMDYuOTMgMi4wNiAyLjA2IDAgMS4xNC0uOTMgMi4wNi0yLjA2IDIuMDZ6bTEuNzggMTMuMDJIMy41NlY5aDMuNTZ2MTEuNDV6TTIyLjIzIDBIMS43N0MuNzkgMCAwIC43NyAwIDEuNzN2MjAuNTRDMCAyMy4yMy43OSAyNCAxLjc3IDI0aDIwLjQ1QzIzLjIgMjQgMjQgMjMuMjMgMjQgMjIuMjdWMS43M0MyNCAuNzcgMjMuMiAwIDIyLjIzIDB6Ii8%2BPC9zdmc%2B&logoColor=white
[linkedin-url]: https://www.linkedin.com/in/oskarbarcz
[github-badge]: https://img.shields.io/badge/@oskarbarcz-181717?style=for-the-badge&logo=github&logoColor=white
[github-url]: https://github.com/oskarbarcz
[web-badge]: https://img.shields.io/badge/barcz.me-4A5568?style=for-the-badge&logo=googlechrome&logoColor=white
[web-url]: https://barcz.me

[banner]: .github/image/banner.png
[homepage]: https://mypreflight.io
[repo-api]: https://github.com/oskarbarcz/flight-tracker-api
[repo-transponder]: https://github.com/oskarbarcz/flight-tracker-transponder-app
[ci-badge]: https://img.shields.io/github/actions/workflow/status/oskarbarcz/flight-tracker-app/integrity.yaml?branch=main&style=for-the-badge&label=integrity
[ci-url]: https://github.com/oskarbarcz/flight-tracker-app/actions/workflows/integrity.yaml
[release-badge]: https://img.shields.io/github/v/release/oskarbarcz/flight-tracker-app?style=for-the-badge
[release-url]: https://github.com/oskarbarcz/flight-tracker-app/releases/latest
[license-badge]: https://img.shields.io/github/license/oskarbarcz/flight-tracker-app?style=for-the-badge
[license-url]: https://unlicense.org
[ts-badge]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[ts-url]: https://www.typescriptlang.org
[react-badge]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black
[react-url]: https://react.dev
[rr-badge]: https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white
[rr-url]: https://reactrouter.com
[vite-badge]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[vite-url]: https://vite.dev
[tw-badge]: https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white
[tw-url]: https://tailwindcss.com
[flowbite-badge]: https://img.shields.io/badge/Flowbite-1A56DB?style=for-the-badge&logo=flowbite&logoColor=white
[flowbite-url]: https://flowbite-react.com
[leaflet-badge]: https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white
[leaflet-url]: https://leafletjs.com
