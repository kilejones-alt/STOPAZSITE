# STOPAZ final refinement QA — 2026-09-08

This package supersedes earlier STOPAZSITE upload ZIPs in this thread.

## User-requested refinements
- Homepage impact counter remains replayable: it resets after leaving the section and runs again on re-entry.
- Counter typography has more breathing room and no compressed/overlapping label treatment.
- Hero historical motion rebuilt as a 20-second H.264 loop from the highest-resolution enhanced source frame available in this session.
  - Desktop: 1920×1080, yuv420p, 20s.
  - Mobile: 960×540, yuv420p, 20s.
  - High-resolution 1920×1080 poster retained as fallback.
- Leadership images use the latest user-supplied files in this exact order: Naya, Natasha, Kile.
- All three leadership tiles are normalized to the same 4:5 frame without image stretching.
- The same latest portraits are used for Naya, Natasha, and Kile on the Team/Partners pages.
- Requested Facebook reel is embedded on About and requests autoplay.
- No added visible headline, caption, CTA, or explanatory copy was introduced around the embedded reel.

## Hard-rule text check
- Visible text comparison against the prior approved flat build: 0 differences.
- This refinement changes media, animation behavior, sizing, and layout only; it does not introduce new visible wording.

## Technical checks
- HTML pages: 42
- Browser-layout cases: 168 (42 pages × 320px, 390px, 1366px, 1648px)
- Horizontal overflow failures: 0
- Heading/text-box fit failures: 0
- Mobile-menu failures: 0
- Console/runtime errors in layout audit: 0
- Fatal render failures: 0
- Local references checked: 1,154
- Broken local references: 0
- JavaScript syntax: PASS

## Autoplay note
The site requests autoplay for both the local muted hero MP4 and the Facebook embed. The local hero is under site control. Facebook/browser autoplay policy is controlled by the external provider/browser and cannot be guaranteed by a static GitHub Pages site.
