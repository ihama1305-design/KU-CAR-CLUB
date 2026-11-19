# Verification — 19 November 2026

The source and generated static website are ready for local review. Nothing was deployed, pushed, or changed in an external account. No WhatsApp group was joined.

## Build and browsers

- `npm run check`: zero errors and zero warnings. One informational type hint concerns awaiting Chrome cleanup in the optional Lighthouse helper.
- `npm run build`: passed; six static pages plus robots and sitemap output.
- `git diff --check`: passed.
- Production preview: **39/39 tests passed** across Chromium, Firefox and WebKit. Coverage includes responsive layouts, direct join URLs, keyboard menu behavior, filters, lightbox navigation and focus restoration, autoplay, explicit pause persistence, offscreen pause/resume, reduced motion, Save-Data, rejected playback, genuinely missing video URLs, slow loading, touch emulation, no-JavaScript content, 200% text sizing and automated WCAG A/AA checks.
- Following the final mobile-menu initialization fix, **9/9 affected responsive/menu/no-JavaScript tests passed again** across all three engines.
- GitHub project subdirectory build at `/KU-CAR-CLUB/`: **13/13 Chromium tests passed**, including media, gallery and QR links.
- Development server: **13/13 Chromium tests passed**. An additional preference-change/simulated-tab-visibility test passed on both dev and production in Chromium.
- An initial sandboxed Firefox startup crash was resolved by running the same installed browser outside the sandbox. WebKit media requests bypassed request interception, so missing-media tests were corrected to use genuinely nonexistent video URLs rather than relying on an intercepted MP4 response.

Tested viewports: 320×568, 375×812, 390×844, 430×932, 568×320, 768×1024, 820×1180, 1024×768, 1152×800, 1366×768, 1440×900 and 1920×1080. No horizontal overflow was detected. About, Events, Gallery, Join and the 404 fallback were also checked at 320px. Touch was emulated; the 200% test increases root text sizing at 640px. This does not constitute physical-device testing or a full native browser zoom audit.

Native `<dialog>` supplies modal focus containment and Escape handling; browser tests confirm close and focus restoration. Gallery links still open actual full JPEG derivatives without JavaScript. Header navigation, QR help and WhatsApp anchors remain usable without JavaScript. Show join QR is a normal link to `/join/`, not a modal, so no separate QR dialog is needed.

## Measured performance

Final local mobile Lighthouse lab run against the production preview, Lighthouse 13.6.0 with its default mobile simulation/throttling and bundled Chromium on Windows:

| Measurement | Result |
| --- | ---: |
| Performance | **92** |
| Accessibility | **100** |
| Best practices | **100** |
| SEO (intentionally non-indexable preview) | 66 |
| First contentful paint | 0.8 s |
| Largest contentful paint | 3.3 s |
| Total blocking time | 60 ms |
| Cumulative layout shift | **0** |
| Speed index | 1.0 s |

The LCP target of 2.5s was **not met** in this throttled lab run. The hero video is the reported LCP element. Do not describe the site as passing all Core Web Vitals: field LCP, INP and CLS require real production traffic; INP was not measured here. Early runs varied, and one exposed a 0.438 layout shift from mobile-menu initialization. That cause was fixed and the final measured CLS is zero.

The browser JavaScript bundle is approximately **2.0 KB gzip**, below the 80 KB budget. A measured Lighthouse network capture before the final font/menu adjustment recorded approximately **502 KB non-video transfer**, below the 700 KB budget. Streaming video accounting is incomplete in that audit; actual video file sizes are reported separately below. Final HTML, font and stylesheet delivery will also depend on production hosting, caching and compression. Local HTML/CSS/JS preview responses were compressed; Lighthouse reports are in the git-ignored `review/` directory.

## Media verification

All 23 input photographs were inspected in a contact sheet. Fourteen selected photographs are published in AVIF, WebP and JPEG derivatives, with source dimensions and alt text. Unselected originals and alternate P23 are not in the public output. The mapping records exact source filenames, dimensions and SHA256 values. Derivatives normalize orientation and remove metadata without upscaling. Visible photographer marks are preserved in the pixels; the gallery/lightbox shows complete photographs rather than permanently cropping them.

Source video: supplied 1280×720 car-meet MP4. Inspected frames at 0, 3, 6, 9 and 12 seconds before retaining seconds **0–10** for the hero. The short pan stays within the same evening meet, with a short fade at the loop boundary. Desktop uses a full-bleed presentation; phones use a landscape 16:9 band and normal-flow copy below.

| File | Actual bytes | Behavior |
| --- | ---: | --- |
| `hero-desktop.mp4` | 2,121,243 | 720p, silent, 10 seconds, H.264/yuv420p, faststart |
| `hero-mobile.mp4` | 906,370 | 480p, silent, 10 seconds, H.264/yuv420p, faststart |
| `hero-poster.jpg` | 46,669 | Early still, preloaded with high priority |
| `club-film.mp4` | 7,686,837 | Full source; attached only after deliberate Play |

Only one hero source is attached. No MP4 is fetched on an initial reduced-motion or simulated Save-Data visit until manual play. Source attachment remains conditional when the browser lacks a connection API. Video rejection/error leaves the poster, copy and CTA usable, with a retry control. Automatic pauses preserve explicit user pause state. The full film pauses the hero first.

Final production screenshots were generated after scrolling through all lazy media. Both desktop and mobile reported **zero broken images**. Actual crops, the mobile film band and the rendered QR card were visually inspected. Screenshots are local review artifacts, not live assets.

## Joining and QR

All primary join actions use the shared constant:

`https://chat.whatsapp.com/JkFbOO5HqYm7sCNGOz8GKF`

The missing master’s embedded SVG was unavailable, so the QR was newly generated with Q error correction and a four-module white quiet zone. `npm run verify:qr` passed **9 independent jsQR decodes**: SVG rasterizations and shipped PNG at 225, 250, 270 and 500px, plus a composed card. Separate captures of the **actual desktop and mobile rendered cards** were also independently decoded to the same exact invitation. This confirms encoding and readability in these conditions, not the current validity of the WhatsApp group invitation.

## Metadata and deployment paths

Default review output has `noindex,nofollow`, `Disallow: /`, no canonical and an empty sitemap. A separate production-mode build with the actual repository's GitHub project path successfully generated:

- canonical: `https://ihama1305-design.github.io/KU-CAR-CLUB/`
- robots sitemap URL: `https://ihama1305-design.github.io/KU-CAR-CLUB/sitemap.xml`
- base-aware sitemap entries, internal navigation, CSS, JavaScript, media and QR downloads.

The default `dist/` remains the root-path preview. `dist-project/` and `dist-production-check/` are ignored review builds. Production activation requires the hosting environment values documented in README; no deployment was requested or performed.

## Missing inputs and remaining limits

- `KU_CAR_CLUB_MASTER_IMPLEMENTATION.md` and its embedded JSON/SVG were not found in the supplied locations. Exact A-ID matching is therefore unverified; provisional P IDs are documented rather than guessed.
- `image(6).png` / A27 and the official KU logo were not supplied. The current header is a clearly documented provisional text wordmark. The requested official logo crop remains pending that input.
- Instagram and the food-site video reference could not be retrieved publicly. No profile details, captions, private data or backend behavior were invented. The provided content brief governed those behaviors. Public Supercar Driver and PistonHeads pages were reviewed as references only; their media and commercial claims are not used.
- Physical iPhone/Android, production hosting speed, real app handoff to WhatsApp, native zoom and actual Save-Data hardware are unverified. Browser emulation and controlled preference simulations are reported separately.
- No confirmed event dates were supplied. Events honestly links visitors to the supplied Instagram destination for updates.
