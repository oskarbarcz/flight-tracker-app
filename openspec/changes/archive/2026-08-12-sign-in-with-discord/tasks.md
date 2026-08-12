## 1. Configuration and profile types

- [x] 1.1 Add `VITE_DISCORD_CLIENT_ID` to `.env` with a placeholder value, mirroring how `VITE_GOOGLE_CLIENT_ID` is declared
- [x] 1.2 Add `getDiscordClientId()` in `app/shared/lib/`, returning `null` for missing, non-string, or blank values, mirroring `getGoogleClientId`
- [x] 1.3 Extend the own-profile response type in `app/features/user/` with the `identities` field carrying Google and Discord connection state, with unlinked providers expressible without further keys
- [x] 1.4 Document `VITE_DISCORD_CLIENT_ID` in `CLAUDE.md` (environment variables) and the README, including that unsetting it removes every Discord identity surface and that the callback URL must be registered on the Discord application

## 2. Service layer

- [x] 2.1 Add `signInWithDiscord(code, redirectUri, codeVerifier)` to `AuthService`, posting to `/api/v1/auth/discord` and returning `SignInResponse`
- [x] 2.2 Add the Discord request/response types to `app/features/auth/model.ts` and export them from the feature barrel
- [x] 2.3 Add `linkDiscordAccount({ code, redirectUri, codeVerifier, joinServer })` to `UserService`, posting to `/api/v1/user/me/link-discord-account` and returning the resulting connection state including the join outcome
- [x] 2.4 Add `unlinkDiscordAccount(currentPassword)` to `UserService`, posting to `/api/v1/user/me/unlink-discord-account` without retry, matching how `changePassword` avoids the refresh retry for password-bearing requests
- [x] 2.5 Add `fetchDiscordServerMembership()` to `UserService`, returning the three-valued membership result
- [x] 2.6 Add `unlinkGoogleAccount(currentPassword)` to `UserService`, posting to the already-implemented `/api/v1/user/me/unlink-google-account` without retry

## 3. Redirect and callback plumbing

- [x] 3.1 Add a PKCE helper producing a verifier and its S256 challenge via Web Crypto, base64url-encoded
- [x] 3.2 Add a flow-state helper that stores the intent (`signin` or `link`), the join choice, the `state` value, and the PKCE verifier in session storage, and that reads-and-clears them in one operation so they are consumed exactly once
- [x] 3.3 Add a helper that builds the Discord authorize URL from the client id, the callback URL, `state`, the PKCE challenge, and the scope selected by intent — `identify` for sign-in and for connecting without a join, `identify guilds.join` when the join was chosen
- [x] 3.4 Add a helper that derives the callback URL from the current origin so it matches what is submitted to the API and what is registered on the Discord application
- [x] 3.5 Register the `/auth/discord/callback` route in `app/routes.ts` under the existing auth layout
- [x] 3.6 Implement the callback route: read and clear flow state, handle Discord's `error` parameter as a cancellation, verify `state`, reject mismatched or missing values without sending a request, then dispatch to the sign-in or connect completion by intent
- [x] 3.7 Have the callback show an in-progress state while completing, and send a visitor with no retained intent to the sign-in screen when signed out or the account page when signed in
- [x] 3.8 Ensure the authorization code is not left in the address bar of the page the user is left on after the callback completes

## 4. Failure messaging

- [x] 4.1 Add `describeDiscordSignInFailure` and `describeDiscordLinkFailure` in `app/features/auth/lib/`, matching the API's message substrings the way `describeGoogleFailure` does, and covering not-connected, invalid authorization, conflict, unauthorized join, Discord unreachable, no status, and `5xx`
- [x] 4.2 Add `describeDiscordUnlinkFailure` and `describeGoogleUnlinkFailure` covering wrong password, no password set, nothing to disconnect, no status, and `5xx`
- [x] 4.3 Extend `serviceFailureMessages.ts` with the shared strings the new describers need, keeping the existing provider-neutral messages reusable rather than duplicating them per provider

## 5. Sign-in screen

- [x] 5.1 Extract the third-party options on `SignInRoute` into a group introduced by a single divider, so the divider is rendered when at least one provider is configured and omitted when none is
- [x] 5.2 Add a Discord sign-in control that stores flow state and navigates to the authorize URL, recognisably Discord and not imitating Google's branded button
- [x] 5.3 Report Discord sign-in failures in the same alert region password sign-in uses, and lock the password form and every third-party option while a sign-in is being completed
- [x] 5.4 Verify the screen renders unchanged from today when neither provider is configured

## 6. Account page — Discord section

- [x] 6.1 Add `DiscordAccountSection` built on the existing `RecordRow` and `RecordNote` primitives, omitted entirely when no Discord client is configured
- [x] 6.2 Render the not-connected state, and put the feature choices in a Discord settings modal opened by the connect action: briefings listed as always on and not turn-off-able, joining the server as a toggle that starts off, each named and explained
- [x] 6.3 Render the connected state: the connected account by display name falling back to username, and the disconnect action, using the themed flowbite `Badge` for connection state rather than a hand-rolled pill
- [x] 6.4 Request server membership only from this section and only for a connected account, rendering checking, member, not-member, and could-not-check states without ever presenting could-not-check as not-member
- [x] 6.5 State the briefing-delivery consequence for each membership outcome, and offer the invite link from `VITE_DISCORD_INVITATION_HASH` when not a member, omitting the control when no invite is configured
- [x] 6.6 Report the join outcome returned by the connect request across joined, already-member, not-requested and failed, keeping the connection reported as connected; treat a not-authorized response as a rejected connection, and send `prompt=consent` when a join is requested so it stays rare
- [x] 6.7 Add the disconnect confirmation using the shared modal chrome with `ModalTitle` and `ModalActions`, stating that Discord sign-in stops working and briefings stop arriving before the request is sent
- [x] 6.8 Place the section on `AccountRoute` after the Google section, and confirm the surrounding sections keep their order when either provider is unconfigured

## 7. Account page — Google parity

- [x] 7.1 Replace the Google section's per-visit connected state with state read from `identities.google`, so it is correct on first render and survives a reload
- [x] 7.2 Show the connected Google account by email address, and report it as connected without naming it when no email is reported
- [x] 7.3 Keep the section hidden while Google's branded control is loading only when no account is connected, and render the connected state regardless of whether that control ever arrives
- [x] 7.4 Add the Google disconnect action with the same shared-modal password confirmation, stating that Google sign-in will stop working
- [x] 7.5 Refresh the reported state in place after connecting or disconnecting either provider, without a page reload

## 8. Quality gates

- [x] 8.1 Bump the version in `package.json`, which CI enforces before merge
- [x] 8.2 Run `npm run lint` and `npm run typecheck` clean
- [x] 8.3 Run `npm run build` clean
- [x] 8.4 Confirm no code comments were introduced, per the repository's style rule

## 9. Verification against a deployed build

- [x] 9.1 Verify the flow start in `npm run dev` for sign-in and for connecting, with and without the join choice — authorize URL, scope and PKCE confirmed; completing a real Discord consent round trip is left to the owner of the Discord application
- [x] 9.2 Confirm no membership request is made for an unconnected account and none rides on `/user/me`; the could-not-check rendering for a connected account still needs a real connected Discord account to exercise
- [x] 9.3 Verify the callback against a built app served from disk on a cold visit with no active service worker, where the hosting's `404.html` rewrite carries the query string
- [x] 9.4 Verify the callback against the same build with the service worker controlling navigation — it also took the `404.html` rewrite rather than `navigateFallback`, so both states share one path; docs corrected
- [x] 9.5 Verify declining Discord's consent screen returns the user to where they started with no error and no request sent
- [x] 9.6 Verify a tampered `state`, a revisited callback URL, and a replayed authorization code are all refused without a request
- [x] 9.7 Confirm no Discord authorization code or token is present in local storage or cookies after any flow, and none remains in the address bar
- [x] 9.8 Confirm every Discord surface disappears with `VITE_DISCORD_CLIENT_ID` unset and that nothing is requested from `discord.com`
