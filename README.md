# Bedrock Cyber — website

Jekyll on GitHub Pages, native build. No Actions workflow, no Node, no build
tooling to maintain: push to the publishing branch and GitHub builds and
deploys. Not published: this README, `styleguide.html`, `page-template.html`,
`scripts/`, the Gemfile, and the individual CSS source files (they are
concatenated into one file at build time).

---

## Publishing an article

Copy `_posts/2026-08-07-how-to-publish-on-this-site.md`, rename it
`YYYY-MM-DD-your-slug.md`, set `title` and `standfirst`, write Markdown,
push. That is the whole job:

- it publishes at `/writing/your-slug/`
- the homepage grid shows the latest three posts automatically
- the `/writing/` index lists everything
- `/feed.xml` and the sitemap update themselves

The `standfirst` is the card text on listings. The date in the filename
controls ordering and the date shown on the article.

## Building a new page

Create `whatever.html` in the root with front matter:

```yaml
---
layout: page            # page head (eyebrow, title, standfirst) + footer
title: The page title.
eyebrow: Section label
standfirst: Optional. Omit the key to drop the element.
permalink: /whatever/
---
```

then compose the body from strata, exactly as before: alternate
`stratum--pale` and `stratum--warm`, close on `{% include stratum-cta.html %}`.
Copy component markup from `styleguide.html`. Add the page to
`_data/nav.yml` if it belongs in the nav.

## Where things live now

```
├── _config.yml           Site config. Excludes, permalinks, local_fonts flag.
├── _data/nav.yml         Navigation, defined once. Header and footer read it,
│                         so they cannot drift. aria-current is automatic.
├── _includes/            head, site-header, site-footer, stratum-cta
├── _layouts/             default → page → article
├── _posts/               Articles, in Markdown
├── writing/index.html    Article listing
├── index.html            Homepage (grid fills from _posts)
├── css/
│   ├── bedrock.css       BUILD FILE: Liquid-concatenates the sources below
│   │                     into the single stylesheet the site serves.
│   ├── main.css          Dev entry point (@imports). Keeps styleguide.html
│   │                     working offline. Add new components in BOTH files.
│   └── …                 tokens, base, typography, layout, components/
├── scripts/fetch-fonts.sh  Self-host the Google fonts (see below)
├── styleguide.html       Component reference. Private. Open from disk.
└── page-template.html    Full-page skeleton reference. Private.
```

The design system, naming, responsive behaviour and accessibility notes from
before the migration all still hold — see `styleguide.html`. Two additions:
`css/components/article.css` styles Markdown article bodies (headings are the
sans; the accent is still never text), and the design rules live on unchanged.

## Fonts

Currently loaded from Google Fonts. To self-host (removes the third-party
request — worth doing before launch):

```sh
bash scripts/fetch-fonts.sh     # Git Bash or WSL
```

then set `local_fonts: true` in `_config.yml` and commit
`assets/fonts/`, `css/fonts.css` and the config change.

## Local preview (optional)

Needs Ruby. `bundle install`, then `bundle exec jekyll serve`. You do not
need this to publish — GitHub Pages is the build machine. To preview pages
marked `published: false`, add `--unpublished`.

## Moving to bedrockcyber.co.uk

Every internal link is root-relative, so the move is configuration only:

1. Add a `CNAME` file containing `bedrockcyber.co.uk`; set the custom domain
   in repo Settings → Pages and enforce HTTPS.
2. Change `url:` in `_config.yml` (used by the feed and sitemap).

## Known placeholders

- `services`, `about`, `contact` and `eu-cyber-resilience-act` pages are
  drafts, marked `[Draft]` in their copy. Services is a launch dependency.
- `_posts/2026-07-14-utility-third-party-risk.md` has a placeholder body and
  a guessed date; paste the real piece and fix the filename date.
- The example post `how-to-publish-on-this-site` should be deleted (or
  rewritten) before merging to main.
- No favicon yet. No company number in the footer if one is needed.
