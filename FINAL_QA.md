# STOPAZ — Final Production QA

Date: 2026-09-08

This is the superseding production candidate for the new STOPAZ repository. The existing live repository is not modified.

## Coverage
- 42 unique content pages.
- 43 renderable HTML routes, including `/learn/` as a convenience alias for `learn.html`.
- 203 image placements total.
- 195 Squarespace-hosted image placements with responsive `srcset` and `sizes`.
- 1,165 local link/asset references audited.

## Structural audit
- Broken local references: 0.
- Missing image alt attributes: 0.
- Missing Squarespace `srcset`: 0.
- Missing Squarespace `sizes`: 0.
- Duplicate HTML IDs: 0.
- Pages without exactly one H1: 0.
- Unlabelled buttons: 0.
- Unsafe `_blank` links without `noopener`: 0.
- JavaScript syntax: PASS.
- CSS brace balance: PASS.
- Google Fonts dependencies: 0.

## Responsive/runtime audit
Every one of the 43 routes was rendered and executed at:
- 320×720 small phone — PASS, zero overflow/errors/menu failures.
- 390×844 phone — PASS, zero overflow/errors/menu failures.
- 768×1024 tablet — PASS, zero overflow/errors/menu failures.
- 1366×768 laptop — PASS, zero overflow/errors.
- 1600×1000 desktop — PASS, zero overflow/errors.
- 1920×1080 wide desktop — PASS, zero overflow/errors.

All `main > section` elements receive the production motion hooks at runtime. Mobile menu behavior passed on all routes at phone/tablet widths. A separate text-clipping scan at 320 and 390 pixels found zero clipped text elements.

## Homepage-specific QA
- `STOP ANTIZIONISM` remains on one line from 320px through wide desktop.
- `New Jewish Leadership to Meet the New Era` is preserved in its dedicated statement band.
- `2,500+` and `PARTICIPANTS TRAINED` have a verified non-overlapping gap at every tested width.
- Impact animation resolves to `2,500+`, `50+`, and `1,000+`.
- Certification announcement is present and links to `/learn/`.
- Three supplied leadership/public-engagement images are present in `WHO WE ARE`.
- Stalin hero loop is 18 seconds, with separate desktop/mobile files.
- Desktop Stalin loop: 339,997 bytes.
- Mobile Stalin loop: 129,669 bytes.

## Motion system
- Page-load choreography and same-site page-exit transition.
- Sticky header scroll state and hide/reveal.
- Animated mobile menu.
- Hero staged entrance and cinematic Stalin loop.
- Section directional entrances and heading wipes.
- Staggered paragraphs/cards/lists/CTAs.
- Image shutter reveal, subtle parallax, hover movement.
- Magnetic desktop CTAs.
- Homepage auto-moving rails.
- Declaration endorsement auto-moving rail.
- Impact spinner/odometer sequence.
- Certification announcement marquee/entrance.
- Footer entrance.

## Performance/accessibility controls
- `prefers-reduced-motion` resolves counters immediately and disables nonessential motion.
- Save-Data prevents hero autoplay.
- Hero video pauses offscreen.
- Auto-moving rails allocate timers only while visible and pause in hidden tabs/user interaction.
- One delegated pointer handler is used for media/button movement rather than per-element pointer listeners.
- No external webfont dependency.
- Production CSS: 69,508 bytes; production JavaScript: 13,676 bytes.
- Responsive local flyer/leadership assets and responsive Squarespace image variants are used.

## Deployment robustness fixes from final audit
- Each page now declares its page identity with `data-page`, so the homepage is classified correctly even when deployed at a GitHub Pages repository root such as `/repo/`.
- Same-site page-transition handling accepts both `.html` routes and clean trailing-slash routes such as `/learn/`.
- The 320px hero headline typography was tightened so the requested one-line `STOP ANTIZIONISM` treatment fits exactly with no internal text overflow.

## Content fidelity
The September 2026 exact-content mirror remains the baseline. Main page copy is unchanged on 35 of the 42 content pages. The seven differing route files correspond to five intentional/current-live content areas: Home (`home.html` and `index.html`), About, Vision, Team/Partners (`team.html` and `partners.html`), and Declaration Endorsements. Those differences reflect current public-site material and/or explicit user-directed homepage additions (impact metrics, certification announcement, revised hero/statement placement, and leadership imagery), rather than accidental rewriting. Product-detail body copy remains unchanged from the exact-content source.

Five visible `New List Item — Description goes here` cards were removed from Declaration Endorsements during the final forward-facing pass because they are unfinished CMS placeholder entries rather than substantive endorsements; the real endorsement entries and the intended `ADD YOUR LOGO HERE` invitation remain.

The former homepage hero source image is the only exact-source image intentionally removed; it was explicitly replaced by the supplied Stalin hero treatment. All other original source image URLs remain represented, with current/live imagery and the user-supplied leadership/flyer assets added.


## Flat GitHub-browser package
This package contains every production file at the repository root. There are no required nested folders. This avoids browser-upload omission of `assets/`, `marketplace/p/`, or `learn/` contents.
