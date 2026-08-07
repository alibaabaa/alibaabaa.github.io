---
# ============================================================================
# EXAMPLE POST — delete before merging to main, or keep as a reference.
#
# To publish a new article:
#   1. Copy this file into _posts/ named  YYYY-MM-DD-your-slug.md
#      The date controls ordering; the slug becomes /writing/your-slug/
#   2. Fill in title and standfirst below. Both appear on the article cards
#      on the homepage (latest three) and the /writing/ index — nothing else
#      to update anywhere.
#   3. Write the body in Markdown. Push. GitHub Pages builds and publishes.
#
# The layout (article) is applied automatically by _config.yml.
# ============================================================================
title: "How to publish on this site"
standfirst: "An example post. Copy this file, rename it, replace the words. Everything below the front matter is ordinary Markdown."
---
This post exists so there is one worked example in `_posts/`. The text you
are reading is the article body: plain Markdown, rendered into the site's
`.prose` styles. Delete this post or keep it; it is the only thing here
that is not real.

## Headings are the sans, not the serif

The display serif appears once per section, and on an article page that is
the title in the page head. Body headings like the one above use the sans
at a heavier weight, so the hierarchy stays quiet.

A second paragraph, to show spacing. Links look like this:
[the styleguide rules still apply](/writing/) — underlined in the hairline
colour, darkening to ink on hover. The accent blue is never text.

## Lists, quotes and code

- First item of an unordered list
- Second item, long enough to wrap onto a second line on a phone so you can
  see the line height holding
- Third item

> A pulled line or a quotation sits against a hairline rule, set slightly
> fainter than body copy.

Inline code like `permalink: /writing/:title/` gets a soft chip. Blocks too:

    # a code block, indented four spaces
    bundle exec jekyll serve

---

A horizontal rule above closes a thought. That is the whole toolkit; if an
article needs more than this, copy component markup from `styleguide.html`
into the Markdown — raw HTML is allowed inline.
