# Style guide

Design tokens live in `theme.css` as CSS custom properties. Components consume
them ONLY as `var(--token)`; never hardcode a hex color or a pixel value in a
component (the design-adherence gate flags hardcoded values).

The UX Designer's `design-guide.json` is the source of truth for the token
values; when it changes, update `theme.css` to match. The defaults shipped here
follow the Databricks brand:

- **Color**: navy `#1B3139` text, warm-oat `#F9F7F4` page surface, white cards,
  brand red `#FF3621` for the primary action / active state only.
- **Semantic**: `#2E844A` success, `#FFAB00` warning, `#0176D3` info, brand red
  for error. Meaning is always carried by text as well, never color alone.
- **Typography**: DM Sans for UI, DM Mono for code/numerics.
- **Spacing**: a 4px base grid (`--space-1` .. `--space-12`).
- **Radius**: soft containers (`--radius-lg` cards), sharp primary CTA
  (`border-radius: 0`, a Databricks brand signature).

Keep the token set small and named by role (surface, brand, text), not by raw
value, so a re-theme changes `theme.css` and nothing else.

## Component vocabulary (`global.css`)

`global.css` builds a small set of reusable component classes from the tokens,
so every feature page COMPOSES them instead of hand-rolling markup (and thereby
consumes the design system). The kit's UX gate (`lakebase-sftdd-ux-clean`) checks
that feature pages reference this vocabulary and are reachable from `App.tsx`:

- `page` (+ `page__header`, `page__title`, `page__title-icon`) , the centered
  content column with a titled header.
- `card` , white surface, soft shadow, gentle radius.
- `btn` (`btn--primary` sharp CTA, `btn--secondary`, `btn--ghost`).
- `field` (+ `field__label`, `field__input`, `field__error`) , a labelled input.
- `table` (+ `table__num` for right-aligned tabular numerics).
- `badge` (`badge--ok`/`--warn`/`--error`) , state pills (text + color, never
  color alone).
- `empty-state` , icon + teaching heading + copy + CTA, never a blank region.
- `toast` , fixed-position action feedback that does not shift layout.
- `navbar` (+ `navbar__brand`/`navbar__icon`/`navbar__link`) , the top nav; every
  feature page is reachable from a link here.

Add components as your design guide grows, always from `var(--token)`. Model new
pages on `pages/AboutPage.tsx` (routed in `App.tsx`, linked in the navbar, styled
with this vocabulary).

## App icon

`public/favicon.svg` is a generic brandable app icon (the Databricks spark mark),
wired into `index.html` and shown in the navbar / page titles. Replace it with
your product's icon; a bitmap icon can be added as `public/favicon.png` alongside.
