# STOPAZ GitHub upload QA — 2026-09-11

This flat package supersedes the previous STOPAZSITE upload build.

## Completed changes

- Home (`index.html` and its `home.html` alias), About, and Vision use the exact computed color values from the current live StopAZ.org site: red `#BF233E`, blue `#2C419A`, navy `#151F49`, pale blue `#A8B2CC`, white, and black where used by the live design.
- Orange is overridden throughout Home, About, and Vision, including navigation, section accents, controls, counters, cards, footer, hover, focus, and motion effects.
- Brian Cugelman is restored once as a picture-less full Team biography, using the current live wording.
- Home, About, Vision, and Team/Partners were compared with the current live pages for prose, headings, images, biographies, sections, buttons, links, embedded media, and store cards.
- Existing visible wording was retained or copied verbatim from the current live source. No new marketing copy was written.
- Existing JavaScript, hero video files, images, motion behavior, counter, mega-menu, search, and responsive rules were retained.

## Validation

- 42 HTML pages and 62 flat root-level files.
- 1,219 local `href`, `src`, `srcset`, poster, and video references checked: 0 unresolved.
- Simulated GitHub Pages `/STOPAZSITE/` subpath references checked: 0 path escapes or unresolved assets.
- Duplicate IDs: 0 pages.
- H1 structure: exactly one H1 on every page.
- JavaScript syntax: pass; `script.js` remains byte-identical to the supplied baseline.
- CSS braces: balanced.
- Both H.264 hero videos decode fully without FFmpeg errors; desktop hero is 1600×900 at 30 fps for 30 seconds.
- Current published GitHub Pages runtime at 1363px: no horizontal overflow, hero playing, counters animate to 2,500+ / 50+ / 1,000+, search opens, About loads with its Facebook embed, Team content is visible, and loaded images report no failures.
- Brian appears once on each Team alias and has no image in his biography.

## Upload

Extract the ZIP and upload every file directly to the repository root. Do not upload a containing folder.
