# Bedrock Cyber — website

Static HTML and CSS. No build step, no dependencies, no framework. Open
`index.html` in a browser and it works. Deploy by copying the folder to any
static host.

---

## Files

```
├── index.html            Homepage
├── page-template.html    Skeleton for services, about, writing, article pages
├── styleguide.html       Component reference. Not a public page.
├── assets/
│   ├── logo.png              For light surfaces
│   └── logo-reversed.png     For the dark footer
├── css/
│   ├── main.css          Entry point. Imports everything, in order.
│   ├── tokens.css        Colour, type, space, motion. Change values here.
│   ├── base.css          Reset, document defaults, focus, motion preferences
│   ├── typography.css    .lede  .prose  .label
│   ├── layout.css        .wrap  .stratum  .duo
│   ├── components/       One file per named block
│   └── utilities.css     Small helpers. Always imported last.
├── js/
│   └── reveal.js         Scroll reveal. The site works without it.
└── partials/             Header, footer and head, for copying or including
```

---

## The idea the design rests on

The site is a core sample. Every section is a stratum: a horizontal band with
a hairline at its boundary, descending from the palest cream at the top of the
page to ink at the bottom, where the call to action sits on bedrock. The datum
marker is the surveyor's disc hanging on a boundary.

Two rules keep it from becoming decoration:

- **The accent blue is never text.** It appears as a 28px rule, a 7px dot, and
  a hover rule on an article card. Nowhere else.
- **The display serif appears once per section.** Everything else is the sans
  at two sizes.

If a change would break either rule, it probably needs a different solution.

---

## Building a new page

1. Copy `page-template.html` and rename it.
2. Set the title and meta description in the head.
3. Add `aria-current="page"` to the matching nav link.
4. Compose the body from strata. Alternate `stratum--pale` and
   `stratum--warm` down the page, and close on `stratum--bedrock`.
5. Copy component markup from `styleguide.html` rather than writing new CSS.

Two-column sections take `<div class="wrap stratum__inner duo">`; single
column drops the `duo`.

---

## Naming

BEM: `.block`, `.block__element`, `.block--modifier`. Utilities are prefixed
`u-`. A class with no prefix and no underscores is a component root.

The one deliberate exception is `.dot` and `.label`, which are shared atoms
used inside several components.

---

## Changing things

**Colour, spacing, type scale** — `css/tokens.css`. Nothing else in the
codebase contains a hex value or a hard-coded typeface. Changing
`--c-accent` recolours every rule and dot on the site.

**Section rhythm** — `--band` in tokens controls the vertical padding of every
section at once.

**A component** — its own file in `css/components/`. Component files never
reference each other, so you can edit one without checking the rest.

**Something new** — add a file to `css/components/`, add an `@import` to
`main.css`, and add an entry to `styleguide.html`. That last step is what
keeps the system honest a year from now.

---

## Responsive behaviour

Type and space scale continuously with `clamp()`, so most sizes need no
breakpoints at all. There are two:

- **880px** — columns collapse to one, the article grid stacks, the nav's
  section links wrap onto a second row beneath the brand.
- **480px** — the fold's base row wraps, and micro-label tracking tightens so
  long labels do not overflow a 360px phone.

Specifically for phones:

- Nothing is hidden on small screens. The nav reflows rather than collapsing
  into a menu, so no JavaScript stands between a visitor and a page.
- Tap targets are 44px on touch devices.
- `viewport-fit=cover` plus safe-area insets on `.wrap` and the footer, so
  content clears the notch in landscape and the home indicator at the foot.
- No `100vh` anywhere, so nothing jumps when mobile Safari's toolbar hides.
- `-webkit-text-size-adjust:100%` stops iOS inflating type in landscape.

Tested layout targets: 360, 390, 430, 768, 1024, 1440, 1920.

---

## Accessibility

- Skip link to `#main`.
- Visible focus ring on every interactive element, with a lighter variant on
  reversed surfaces.
- Sections use `aria-labelledby` pointing at their opening statement.
- Decorative SVG and arrow glyphs are `aria-hidden`.
- All motion is disabled under `prefers-reduced-motion: reduce`.
- Body text meets WCAG AA against its surface. Micro labels are set in
  `--c-ink-faint`, which meets AA at their size but is the thinnest margin in
  the system: if you introduce a smaller label, darken the colour.

---

## Performance

The stylesheet is split into 14 files for maintenance, and `@import` loads
them serially. That is fine while the site is small and on a fast host. When
it matters, concatenate at deploy time and point the page at the result:

```sh
cat css/tokens.css css/base.css css/typography.css css/layout.css \
    css/components/*.css css/utilities.css > css/bedrock.css
```

Component files are alphabetised by `*.css`, which is safe: no component
depends on another's source order.

Fonts come from Google Fonts. Self-hosting them removes a third-party request
and a third-party dependency, and is worth doing before launch.

---

## Moving to a static site generator

The structure already assumes one. `partials/` holds the three fragments that
repeat on every page, and they map directly onto includes:

| This repo | Eleventy | Astro | Jekyll |
|---|---|---|---|
| `partials/head.html` | `_includes/head.njk` | layout `<head>` | `_includes/head.html` |
| `partials/site-header.html` | `_includes/header.njk` | `Header.astro` | `_includes/header.html` |
| `partials/site-footer.html` | `_includes/footer.njk` | `Footer.astro` | `_includes/footer.html` |

Nothing in the CSS or the markup needs to change. Move the fragments, replace
the three HTML comments in each page with include tags, and write article
pages as Markdown against `page-template.html`.

---

## Known placeholders

- The second article card carries `[ML integrity piece, published title]` from
  the copy deck. Swap it when the piece is published.
- Every `href` points at a path that does not exist yet: `/services/`,
  `/writing/`, `/about/`, `/contact/`, `/eu-cyber-resilience-act/`. The
  services page is a launch dependency, since two homepage links and the
  differentiation argument depend on it.
- The footer carries a copyright line only. If the practice is a registered
  company, a company number belongs beside it.
- No favicon yet.
