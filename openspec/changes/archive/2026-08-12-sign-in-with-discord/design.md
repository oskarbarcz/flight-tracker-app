## Context

See proposal.md — Why. The constraints that shape the approach:

1. **Discord has no client-side identity token.** Google Identity Services hands the browser a signed JWT that the app POSTs to `POST /api/v1/auth/google`. Discord has no equivalent: authorization codes must be exchanged using a client secret, so the exchange belongs to the API and the browser must make a full-page trip to `discord.com` and back. Every difference between the Google flow and this one follows from that single fact.

2. **DM delivery depends on server membership.** The API's Discord gateway resolves a DM recipient through the guild before sending. A stored Discord ID belonging to someone who is not in the Flight Tracker server is undeliverable, so membership is user-visible state, not an implementation detail.

3. **The API's Discord gateway is disabled outside production.** Membership therefore cannot be determined in development, and the UI must be able to say so rather than reporting "not a member".

4. **Production hosting rewrites URLs.** The app is a `ssr: false` SPA on GitHub Pages using the `spa-github-pages` technique (`public/404.html` + `public/ghspa.js`), with a service worker whose `navigateFallback` serves `index.html`. A deep link like `/auth/discord/callback?code=…&state=…` therefore arrives by two different mechanisms depending on whether the service worker is active, and by neither mechanism in `npm run dev`.

5. **The account page's generic requirements live in the `google-account-link` spec.** The "Account page" requirement — section order, one-credential-per-section, authentication guard — is defined inside a provider-specific capability.

## Goals / Non-Goals

**Goals:**

- One redirect flow serving both sign-in and connecting, differing only in intent and scope.
- Session tokens never travel through a URL.
- Connection state and server membership are read from the profile and reported honestly, including when unknown.
- Google reaches parity — persistent state and disconnect — using the same profile field.
- Every Discord surface disappears cleanly when `VITE_DISCORD_CLIENT_ID` is unset, matching Google's existing behaviour.

**Non-Goals:**

- No account creation from a Discord sign-in. Connect-first, mirroring Google.
- No storing of Discord OAuth tokens anywhere, browser or server.
- No "join the server later" API capability — see the join-timing decision below.
- No change to how briefings are composed or sent; that side already works.
- No extraction of the account page into its own capability (see Risks).

## Decisions

### The callback belongs to the app, not the API

The redirect URI points at `/auth/discord/callback` in the SPA. The callback route reads the authorization code and POSTs it to the API, which performs the secret-bearing exchange and answers with the app's own tokens in a JSON body.

*Alternative considered:* pointing the redirect URI at the API, letting it exchange the code and then redirect back to the app. Rejected because a sign-in would have to hand `accessToken` and `refreshToken` back through a URL or fragment, where they land in browser history and any referrer. It would also make the API depend on the app's deployed URL. The chosen shape keeps tokens in a response body and preserves the existing `POST → SignInResponse` service pattern.

### Scope is decided before the redirect, so the join ask is conditional

The choice to join the server is made on the account page *before* leaving for Discord, so the authorize request can ask for exactly what is needed:

| Intent | Scope |
| --- | --- |
| Sign-in | `identify` |
| Connect, join not chosen | `identify` |
| Connect, join chosen | `identify guilds.join` |

*Alternative considered:* always requesting `identify guilds.join` and letting the checkbox decide whether the join is performed. Rejected because it shows "Join servers for you" on the consent screen to people who explicitly declined, which is a worse consent story for no gain. Both variants are a single consent pass.

### The join happens during connecting, and only then

Adding someone to a guild requires the *user's* OAuth access token, not just the bot token. That token exists only during the connect request. Joining later would mean persisting Discord access and refresh tokens at rest.

We do not. Connecting is the only moment a programmatic join happens. A user who is connected but not a member is offered the existing `VITE_DISCORD_INVITATION_HASH` invite link instead, which takes them to Discord to join themselves. This trades a small amount of convenience for holding zero third-party tokens.

*Alternative considered:* persist the Discord refresh token to support a "join now" button indefinitely. Rejected on the storage-of-secrets trade-off; the invite link covers the same need without it.

### A failed join does not fail the connection

The API answers a successful connect with a join outcome, and reports `failed` rather than erroring when the guild join does not happen. The connection is independently valuable — it is what makes Discord sign-in possible — so the UI keeps it and surfaces the delivery consequence separately.

### Membership is fetched separately from the profile

Connection state rides on `GET /api/v1/user/me` because it is stored data and the account page needs it immediately. Membership is a live probe against Discord, so it gets its own request issued only by the account page. `/api/v1/user/me` runs on every app load — twice per load in development, since the router and Vite both mount — and must not become a per-load round trip to Discord.

Membership is three-valued: `member`, `not_member`, `unknown`. `unknown` covers a disabled gateway and an unreachable Discord, and renders as an inability to check rather than a negative answer.

### Request integrity is client-side

The app generates a `state` value and a PKCE verifier before redirecting, retains them for the duration of the round trip, and rejects a callback whose `state` does not match. PKCE binds the authorization code to the browser session that started the flow, which matters because the code lands in the app's own URL. The verifier travels to the API with the code so the API can complete the exchange.

Retained values are scoped to the browsing session and cleared as soon as the callback consumes them, whether it succeeds or fails.

### Google parity uses the same profile field

`identities.google` from the profile replaces the Google section's per-visit "connected" state, which allows the section to report its real state and to offer disconnecting via the already-shipped `POST /api/v1/user/me/unlink-google-account`. Disconnecting either provider requires confirming the current password, matching the API's guard, and is unavailable on an account that has no password — the API refuses it to prevent locking the account out of every sign-in method.

## Risks / Trade-offs

- **The callback route reaches the router through a URL rewrite that does not exist in dev.** → Verified against a built app served with GitHub Pages semantics, both with no service worker registered and with one controlling the page. In both states the navigation went through the `spa-github-pages` rewrite (`&` encoded as `~and~`, reversed before routing) and both `code` and `state` arrived intact. `navigateFallback` did not intercept navigations in that test — a deep link with no callback involvement took the same rewrite — so the rewrite is the only path in play and the one that must keep working. This is exactly the kind of thing that only breaks in production, so it stays a build-time check rather than a dev-server one.
- **Leaving the app mid-flow loses in-memory context.** → The intent (sign in vs connect), the join choice, and the integrity values are retained across the redirect rather than held in component state, and the callback route is responsible for resuming or abandoning cleanly.
- **The consent screen shows "Join servers for you" to users who chose to join.** → Accepted, and the reason is stated at the point of the choice, so the permission is not a surprise when Discord asks for it.
- **A user can be connected yet unreachable.** → This is the failure mode the feature exists to prevent, so it is reported explicitly rather than inferred, with the invite link offered as the way out.
- **Account page requirements live inside `google-account-link`.** → Modified in place rather than extracted, to keep this change to one subject. Extracting an `account-page` capability is worth doing when a third section needs the same treatment; noted here so the next person does not think it went unnoticed.
- **The frontend cannot ship before the API.** → Every Discord surface is gated on `VITE_DISCORD_CLIENT_ID`, so the code can merge and stay dark until the endpoints exist and the variable is set.
- **`discordId` is writable through `PATCH /api/v1/user/me` today.** → Discord sign-in must not be enabled until the API stops accepting it, because sign-in matches accounts on a value users can currently assert about themselves. Called out in the API requirements as a blocking fix.

## Migration Plan

1. API lands the Discord endpoints, adds `identities` to the profile, and removes `discordId` from the profile update payload.
2. This change merges with `VITE_DISCORD_CLIENT_ID` unset in production, leaving every Discord surface hidden.
3. Register `http://localhost:5173/auth/discord/callback` and `https://flights.barcz.me/auth/discord/callback` on the Discord application; confirm the bot can create invites in the Flight Tracker server.
4. Verify the callback against a built app, cold and service-worker-warm.
5. Set `VITE_DISCORD_CLIENT_ID` to enable the feature.

Rollback is unsetting `VITE_DISCORD_CLIENT_ID`: sign-in and the account page return to their Google-and-password shape. Connections already stored stay stored, and briefings keep being delivered to them.

## Open Questions

- Whether the account page should surface briefing delivery readiness as a single derived statement spanning both conditions, or leave the connection and membership rows to be read together. The specs require both facts and the consequence to be reported; how they are composed visually can be settled during implementation.
