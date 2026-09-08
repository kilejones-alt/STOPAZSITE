# STOPAZ final forward-facing QA — 2026-09-08

This package supersedes the previous interaction build.

## User-requested fixes
- Homepage Contact Us and info@stopaz.org removed from hero and homepage footer.
- Desktop header enlarged and rebalanced while keeping all eight navigation items on one line.
- Desktop mega-menu top edge dynamically aligns to the larger header.
- Historical hero no longer depends on HTML video autoplay. It uses looping animated WebP motion assets, with a lighter mobile version.
- Team/Partners `Meet the Team` section no longer waits on the whole-grid reveal observer.
- Team/Partners begins with an immediate Naya → Natasha → Kile three-portrait strip at matching 4:5 proportions, then preserves all existing bios.
- No new visible wording was introduced.

## Checks
- 42 HTML pages.
- 61 root-level files for GitHub browser upload.
- 1,523 local href/src/srcset/CSS URL references checked: 0 broken.
- Duplicate IDs: 0 pages.
- H1 structure: exactly one H1 on every page.
- JavaScript syntax: pass.
- CSS braces: balanced 952 / 952.
- Animated historical hero: desktop 800×450 / 80 frames / infinite loop; mobile 480×270 / 60 frames / infinite loop.
- Responsive browser geometry: 126 render cases at 390, 1366 and 1648 CSS px; 0 horizontal overflow cases.
- Desktop mega-menu hover test: opens successfully; panel begins at the measured 126px header edge.
- Team section test: team strip contains 3 portraits; leadership grid and first article are visible at opacity 1.

## Visible-text control
Compared with the prior approved interaction build, Team/Partners visible text is unchanged. Homepage visible-text changes are limited to the user-requested deletion of `Contact Us (info@stopaz.org)` and the homepage footer email; the remaining existing phrase `Stop Antizionism. Restore Moral Clarity.` is preserved.
