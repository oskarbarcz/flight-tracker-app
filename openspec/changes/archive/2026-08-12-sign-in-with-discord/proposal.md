## Why

The API already sends flight briefings to pilots as Discord direct messages, but nothing can reach them: the `discordId` those DMs are addressed to is write-only on `PATCH /api/v1/user/me` and no frontend surface has ever set it. The delivery machinery is built and starved of data.

Discord is also where this community already lives, and Discord's DM policy means a bot can only message someone it shares a server with. So the identifier, the server membership, and the sign-in option are one problem, not three: a pilot who connects Discord but never joins the server gets briefings that silently go nowhere.

Alongside it, the account page's Google section cannot tell the truth about itself. It has no disconnect action and its "connected" confirmation is per-visit state that disappears on refresh, because the profile never reported whether a Google account was linked. The backend work that reports linked identities fixes both providers at once, so both are addressed here.

## What Changes

- Add **sign in with Discord** to the sign-in screen, alongside the existing Google option. Like Google, it works only for accounts that have already connected Discord — no account is created by signing in.
- Add a **Discord connection section** to `/me/account` that connects an account, reports the connection persistently, and disconnects it.
- At connect time, offer an explicit **choice to join the Flight Tracker Discord server**. When taken, the server join happens as part of connecting, so briefings are deliverable the moment the connection exists.
- Report **Discord server membership** on the account page as its own observable state, including an honest "unknown" where it cannot be determined, and explain the consequence for briefing delivery when the user is connected but not a member.
- Add a **Discord OAuth callback route** with client-side `state` and PKCE integrity checks. Unlike Google, Discord requires a full-page redirect, so the app leaves and returns.
- **BREAKING (deployment)**: the app now requires `VITE_DISCORD_CLIENT_ID`, and both the production and local callback URLs must be registered as redirect URIs on the Discord application. Every Discord surface disappears when the client ID is unset, matching how `VITE_GOOGLE_CLIENT_ID` already behaves.
- Report **Google connection state persistently** and add a **disconnect action** for Google, retiring the current "state is not claimed beyond what is known" limitation now that the profile reports linked identities.

Depends on new API endpoints (`POST /api/v1/auth/discord`, `link-discord-account`, `unlink-discord-account`, `identities` on `GET /api/v1/user/me`, and a Discord server-membership probe), specified separately and handed to the API project. This change is frontend-only and cannot ship before those land.

## Capabilities

### New Capabilities

- `discord-sign-in`: Signing in with Discord from the sign-in screen, and how that sign-in fails understandably.
- `discord-account-link`: Connecting and disconnecting Discord on the account page, the choice to join the Discord server, and reporting server membership and its effect on briefing delivery.
- `discord-oauth-redirect`: The redirect out to Discord and the callback route back — request integrity, resumption of the interrupted intent, decline and tamper handling, and arrival under the production hosting's URL rewriting.

### Modified Capabilities

- `google-sign-in`: The sign-in screen now presents more than one third-party option, so the single-alternative layout requirement no longer holds.
- `google-account-link`: The account page gains a Discord section in its section order; the Google section now reports its connection state persistently and offers disconnecting, replacing the requirement that forbade both.

## Impact

- **Routes**: new `/auth/discord/callback` under the auth layout.
- **Frontend code**: `app/features/auth/` (Discord service calls, redirect and callback handling, connection section, sign-in button), `app/features/user/` (profile response gains `identities`), `app/routes/auth/`, `app/routes/common/AccountRoute.tsx`.
- **Configuration**: `VITE_DISCORD_CLIENT_ID` added to `.env`, `.env.local` guidance, and the environment documentation in `CLAUDE.md` and the README. `VITE_DISCORD_INVITATION_HASH` is already present and is reused as the join fallback.
- **Hosting**: the callback path reaches the router two different ways in production — via `public/404.html` plus `public/ghspa.js` on a cold visit, and via the service worker's `navigateFallback` once it is active. Neither path exists in `npm run dev`, so the callback must be verified against a built app.
- **API**: consumes the new Discord endpoints and the `identities` field; no API code in this change.
- **Security**: `discordId` must stop being writable through `PATCH /api/v1/user/me` before Discord sign-in is enabled, since sign-in matches on it. Tracked in the API requirements, noted here because enabling the frontend flow without it would be unsafe.
