## 1. Brand tokens

- [x] 1.1 Add `--color-discord` (`#5865f2`) and `--color-discord-light` (`#949cf7`) to the `@theme` block in `app/styles/index.css`
- [x] 1.2 Record "The Integration Brand Exception" under the colour rules in `DESIGN.md`, scoping the hue to identifying marks and noting why a dark-mode variant exists

## 2. Connected-account card

- [x] 2.1 Move the card into `RecordRow`'s full-width `detail` slot and drop it from the content column, matching `EmailSection`
- [x] 2.2 Adopt the canonical inner-panel treatment — `rounded-xl`, `p-4`, `dark:bg-gray-800/60` — from `PendingEmailChange`
- [x] 2.3 Set the Discord login in the monospaced treatment the page uses for account identifiers, keeping the display name as the primary line
- [x] 2.4 Replace the status marker colours with `green-700`/`green-400` and `amber-700`/`amber-400`, matching the page's existing status markers
- [x] 2.5 Separate the consequence copy with a `border-t` divider, matching `PendingEmailChange`
- [x] 2.6 Add the brand-hue ring on the avatar and the brand-hue glyph on the placeholder, using the new tokens

## 3. Discord controls

- [x] 3.1 Apply the brand-hue glyph to the Connect, sign-in, and Join-the-server controls
- [x] 3.2 Bring the sign-in button to parity with Google's adjacent branded button — `gray-300` border and `font-medium` label to match its measured `#dadce0` and weight 500
- [x] 3.3 Give the feature rows the inner-panel radius and padding (`rounded-xl`, `p-4`)
- [x] 3.4 Constrain the Join-the-server control to its content width so it does not read as a primary action

## 4. Account record measure

- [x] 4.1 Narrow the account record on `AccountRoute` and confirm rows keep label, value, and action legible

## 5. Verification

- [x] 5.1 Confirm the section in light and dark for connected, not-in-server, and unknown-membership states
- [x] 5.2 Confirm the avatar placeholder renders when no avatar is reported and when the reported avatar fails to load
- [x] 5.3 Confirm the brand hue appears only on marks — no action, body text, or surface carries it
- [x] 5.4 Measure the sign-in button's border colour and label weight against Google's rendered button
- [x] 5.5 Run `npm run lint`, `npm run typecheck`, and `npm run build` clean
