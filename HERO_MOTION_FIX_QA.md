# STOPAZ Hero Motion Deployment Fix QA — 2026-09-08

- Root cause found: a late CSS rule in the prior package set `.hero-stalin-image { animation:none!important; }`, overriding the intended camera movement.
- Source supplied as `stalin-preview(1).gif` is actually a single-frame PNG, so it contains no native footage to play.
- New hero uses two layers:
  1. local 20-second H.264 MP4 loop (desktop 1920×1080; mobile 960×540), muted/autoplay/playsinline;
  2. deterministic CSS pan/zoom fallback on the 1920×1080 poster image.
- Video remains transparent until JavaScript confirms its playhead is actually advancing. If playback stalls/errors, the video hides and the moving fallback remains visible.
- 900ms watchdog detects stalled playback and restores fallback automatically.
- CSS and JS URLs are cache-busted (`v=20260908d`) across every page so GitHub Pages/Edge do not reuse the previous broken rules.
- Both MP4s: H.264 High profile, yuv420p, limited range, `faststart`, ~20 seconds.
- Extracted frames at 0.3s, 5s, 10s, 15s and 19.5s verify substantial image-position/scale change during the loop.
- Visible text differences versus the immediately prior approved build: 0.
