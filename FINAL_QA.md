# STOPAZ — Professional Forward-Facing QA

Final interaction build, 2026-09-08. This package supersedes earlier STOPAZSITE ZIPs in this thread.

## Hard rule — visible wording
- 42 HTML pages compared against the prior approved hard-rule build.
- Visible-text differences: **0**.
- No new editorial copy, headlines, captions, descriptions, slogans, or explanatory text were introduced.
- Runtime navigation/search uses only existing STOPAZ labels/page names; icon controls add no visible wording.

## Static integrity
- HTML pages: **42**
- Flat GitHub-browser-upload package: all files remain at repository root.
- Local references checked: **1,180**
- Broken local references: **0**
- Duplicate IDs: **0**
- Pages without exactly one H1: **0**
- JavaScript syntax: **PASS**
- CSS brace structure: **PASS**

## Responsive browser render QA
Exact HTML/CSS/JS bytes were rendered in Chromium at:
- 320×740
- 390×844
- 1366×768
- 1600×900

Total route/viewport cases: **168**
- Fatal render failures: **0**
- Console/runtime error cases: **0**
- Page-level horizontal overflow: **0**
- Mobile-menu failures: **0**
- Motion initialization failures: **0**
- H1 failures: **0**

The homepage announcement contains intentional transformed/rotated artwork inside an overflow-clipped section; this increases the link element's internal scrollWidth in desktop measurement but does **not** create viewport/page overflow or visible clipping.

## Giving Kitchen-style interaction layer
Verified in Chromium:
- Desktop hover/focus mega-menu opens beneath the header and fills the remaining viewport area.
- Hover transfer from top navigation into the mega-menu keeps the panel open.
- Escape closes the mega-menu.
- Full-screen search opens and returns existing STOPAZ page names.
- Persistent existing **Get Involved** action is present.
- Back-to-top control appears after scrolling and returns the page to the top.
- Homepage carousel controls are present; arrow advance changes scroll position.
- Desktop pointer drag is enabled on carousel rails.
- Mobile uses the existing tap-based full-screen menu; desktop mega-menu is suppressed on mobile.
- Reduced-motion mode displays final impact values without kinetic counting.

## Impact replay
Verified sequence:
1. Section enters view → **2,500+** settles.
2. Section leaves view → counter resets to **0**.
3. Section re-enters → counter runs again and settles at **2,500+**.

Secondary values remain **50+** and **1,000+**.

## Historical hero motion
Desktop file:
- H.264
- 1920×1080
- yuv420p
- 24 fps
- 20.0 seconds

Mobile file:
- H.264
- 960×540
- yuv420p
- 24 fps
- 20.0 seconds

Actual Chromium decode/playback test:
- readyState: **4**
- paused: **false**
- playhead advanced normally during test

The hero includes autoplay retry logic plus a non-text fallback play control if a browser blocks autoplay.

## Leadership imagery
- Order: **Naya → Natasha → Kile**.
- All three use user-supplied images.
- Equalized 4:5 presentation frames without stretching faces.
- Responsive local WebP variants are included.

## Embedded talk
The existing Facebook reel remains embedded on About without any added visible caption/headline. Autoplay is requested, but Facebook/browser policy can still prevent provider-controlled autoplay. A YouTube embed can replace it later without altering any visible STOPAZ wording if a YouTube URL is supplied.

## Timeline check
The fall certification dates shown in the supplied campaign material are consistent with the user's Drive source: **October 15, October 19, and October 21, 2026**. Existing old-site wording elsewhere was not rewritten because the hard rule requires old-site text to remain verbatim.

## Release status
**Forward-facing interaction and technical QA: PASS.**
