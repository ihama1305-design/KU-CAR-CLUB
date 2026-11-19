# KU Car Club

Responsive, statically generated Astro + TypeScript website. No account, database or API key is needed. Joining uses the canonical WhatsApp invitation directly.

## Run locally

Use Node 24.18+ and npm. Generated media is included, so you do not need the original media folder to run the website.

```powershell
npm ci
npm run dev
```

Open the address printed by Astro (normally http://127.0.0.1:4321).

```powershell
npm run check
npm run build
npm run preview
```

`dist/` is the complete static site. Nothing has been deployed or pushed.

## Brand and content inputs

The implementation follows `KU_CAR_CLUB_CODEX_SCRIPT.md` and the original 23 photographs and MP4 in the supplied Desktop folder. The referenced master specification, embedded asset map, verified QR SVG and `image(6).png` logo poster were absent. The header is a provisional **text wordmark**, not a recreation of the official logo. Replace it with the actual approved crop when supplied. No competitor imagery, stock imagery, guessed events or club statistics are used.

`src/data/asset-map.json` records actual filenames, original dimensions, SHA256 hashes and provisional P IDs. These do not assert equivalence with the missing master’s A IDs. All photos were visually reviewed in a local contact sheet. P17 is the initial blue Mustang variant; P23 remains an unselected alternate. Public media includes only selected photo derivatives, the full film, hero derivatives and the newly generated QR. Originals and review screenshots are outside the public directory.

## Update content

- `src/data/club.ts`: name, tagline, Instagram and the single WhatsApp invitation. Every primary join component reads this value.
- `src/data/media.ts`: approved gallery entries, accurate alt text, dimensions and filters. Add metadata and select an ID in the preparation script before generating new media.
- `src/pages/events.astro`: currently an honest Instagram update state. Add only approved dates, venue details and URLs; no unverified event data is present.
- `src/components/JoinBlock.astro`: QR help card, download and real tappable invitation.
- `src/styles/global.css`: shared responsive styles, focus treatments and reduced-motion rules.

For a future CMS, replace these typed data modules with validated build-time content. Keep publication approval and media rights in that publishing workflow. On-site membership, payments and RSVPs are outside this release; no dormant backend or personal-data storage is included.

## Regenerate media

Keep original files in a separate private folder. Preserve their exact filenames to keep P IDs stable:

```powershell
npm run prepare:media -- 'C:\Users\hp\Desktop\KU CAR CLUB'
npm run verify:qr
```

This single Sharp/FFmpeg pipeline normalizes orientation, strips metadata, preserves visible photographer marks, emits non-upscaled AVIF/WebP/JPEG widths, creates an early video poster, and retains the full original film for deliberate playback. Hero loops use seconds 0–10, no audio, H.264/yuv420p, faststart and a short fade at the seam. Initial 0/3/6/9/12-second frames were visually inspected. Preparation requires the FFmpeg binary from `ffmpeg-static`; if npm blocks its install script, explicitly approve that package with your npm version's supported approval command, then install again. Never approve unrelated install scripts blindly.

QR SVG and PNG are generated from the shared configuration, Q correction and a four-module white margin. Always regenerate and independently verify after changing the invitation. The verification checks the exact payload at 225, 250, 270 and 500px and inside a card. It does not establish that an invitation is still active and never joins the group.

## Browser verification

```powershell
npx playwright install chromium firefox webkit
# Keep the dev server running in another terminal:
npm test
# Or verify the production preview:
$env:TEST_URL='http://127.0.0.1:4322'
npm test -- --workers=2
```

Run `npm run preview -- --port 4322` for that example. Tests intercept or inspect external links; they do not join WhatsApp. `scripts/capture.mjs` creates review screenshots; `scripts/audit.mjs` runs a mobile Lighthouse lab audit against port 4322. Review files are git-ignored. See `VERIFICATION.md` for measured results and limits.

## Root domain or GitHub project path

Default builds use `/` and remain `noindex,nofollow` with a disallowing robots file and an empty sitemap. This is intentional for review.

For a GitHub project build, the repository remote is `ihama1305-design/KU-CAR-CLUB`. When a production deployment is authorized:

```powershell
$env:SITE_URL='https://ihama1305-design.github.io'
$env:BASE_PATH='/KU-CAR-CLUB/'
npm run build
```

For a root domain use the real origin for `SITE_URL` and `/` for `BASE_PATH`. Set environment variables in the hosting build system, not just an Astro client `.env` file: `astro.config.mjs` reads `process.env`. All internal links, downloads and dynamic media use the shared base-aware URL helper. Production settings enable canonical URLs, sitemap entries and indexing. Upload only `dist/` to a static host when ready; configure its 404 handling to use `404.html`.

To reproduce the isolated subdirectory review without changing the root output:

```powershell
$env:BASE_PATH='/KU-CAR-CLUB/'
$env:BUILD_DIR='./dist-project'
npm run build
node scripts/serve-static.mjs dist-project /KU-CAR-CLUB/ 4323
# In another terminal:
$env:TEST_URL='http://127.0.0.1:4323'
$env:TEST_PATH='/KU-CAR-CLUB/'
npm test -- --project=chromium --workers=1
```

Clear `BASE_PATH`, `BUILD_DIR`, `SITE_URL`, `TEST_URL` and `TEST_PATH` to return to defaults. This project does not modify the separate food website.

## Single-page landing site (2026 redesign)

Run `npm run dev -- --port 4322`, then open http://127.0.0.1:4322/.

- All event, gallery branch/media, contributor, and location records: `src/data/landing.ts`.
- Event `date`: use an ISO timestamp with UAE offset, e.g. `YYYY-MM-DDTHH:mm:ss+04:00`. Keep `null` until confirmed. Venue also stays `null` until confirmed. Display timezone is `Asia/Dubai`.
- Local countdown preview: http://127.0.0.1:4322/?preview=countdown . This is explicitly marked as a preview and disabled on production hostnames.
- Images and film: `public/media/`. Existing P IDs are documented in `src/data/asset-map.json`. Keep matching 480/800 WebP variants when replacing images. Videos load only when the modal opens.
- Locations are exploration ideas, not confirmed event venues. The current location images are clearly labeled club mood references; replace them with destination photography when supplied.
- Layout, styles, and interactions: `src/pages/index.astro`, `src/styles/landing.css`, `src/scripts/landing.ts`.
- Map coastline and globe: Natural Earth public-domain geographic data, distributed by https://github.com/datasets/geo-countries . Simplified locally for small SVG output. Pins use WGS84 coordinates from the editable dataset.
- Landing acceptance checks: `npm test -- tests/landing.spec.ts --project=chromium`. Prior multipage tests describe the previous design and are retained for those pages.

Hero artwork is AI-generated editorial imagery, not documentation of a club event. The generated source was resized into `landing-hero-{600,1000,1600}.webp`. All other photographs and the club film reuse the supplied repository assets. Contributor labels are text because verified partner logo files were not supplied. A dedicated campus photograph can replace the first collage image when available.
