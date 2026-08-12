## Why

The Discord section shipped functionally correct but visually unresolved — it read, in the owner's words, "like a prototype". Three things were wrong at the craft level rather than the behavior level:

- The connected account rendered as a card nested in the row's content column, leaving dead space beside it while the action button orbited the top-right corner. The account page already owns a full-width slot for exactly this, used by the email section.
- The section invented its own visual vocabulary instead of reusing the page's. The Discord login was set in the proportional body font while the email address directly above it — the same class of value — is monospaced. The status marker used `green-500`/`amber-500` where the page's existing status markers use the `green-700`/`amber-700` semantic tokens. Panel padding and radius drifted from the inner-panel spec.
- Nothing identified the integration as Discord beyond a gray glyph, so a third-party connection looked like a native app section.

The account record was also wider than it needed to be for rows that are mostly a label, a short value, and one action.

## What Changes

- Move the connected-account card into the account row's full-width detail slot, so it spans the record instead of floating beside the action.
- Set the Discord login in the same monospaced treatment the page already uses for account identifiers, so it reads as a value of the same class as the email address.
- Replace the ad-hoc status marker colors with the semantic success and warning tokens the account page's existing status markers use, and adopt the canonical inner-panel radius, padding, and dark-mode fill.
- Introduce a Discord brand mark: a brand-colored ring on the account avatar and a brand-colored glyph on the Discord controls, so the integration is recognisable as Discord. **New design-system rule**: an integration's brand hue is permitted on identifying marks only — never on actions, text, or surfaces.
- Add `--color-discord` and a lighter `--color-discord-light` for dark mode, because the base brand color fails 4.5:1 on the dark canvas.
- Bring the Discord sign-in control to visual parity with the adjacent Google branded button — matching border weight and label weight — so the third-party options read as one set rather than two designs.
- Narrow the account record's measure.

No behavior, copy, data, or endpoint changes. This is refinement of the shipped Discord integration; every requirement it touches keeps its meaning and gains a presentation constraint.

## Capabilities

### New Capabilities

None. This change refines the presentation of capabilities that already exist.

### Modified Capabilities

- `discord-account-link`: the connected-account card gains presentation constraints — full-width placement, monospaced login, semantic status marker, and the brand mark that identifies the integration.
- `discord-sign-in`: the Discord control must sit as a visual peer of the other third-party options rather than merely being "recognisably Discord".
- `google-account-link`: the account record is constrained to a narrow measure.

## Impact

- **Design system**: `DESIGN.md` gains "The Integration Brand Exception" under the color rules, scoping the one sanctioned second accent. `app/styles/index.css` gains the two brand tokens in `@theme`.
- **Frontend code**: `DiscordConnectionCard`, `DiscordAccountSection`, `DiscordFeatureRow`, `DiscordIntegrationModal`, `DiscordSignInButton`, `AccountRoute`.
- **No API involvement**, no new dependency, no route change.
- **Accessibility**: the brand hue is confined to marks, so no text contrast depends on it; the dark-mode token exists because the base hue measures 3.82:1 on the dark canvas against a 4.5:1 bar.
