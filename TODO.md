# TODO

## Evidence gaps — /momentum

_Recorded 2026-08-12 by the visual-verification pass. Every entry states what is missing, every
file already read looking for it, and what it blocks. Where a value was measured rather than read,
the measurement is given so nobody has to take it on trust._

---

## RESOLVED 2026-08-12 — closed with hard evidence, later the same day

The entries below were open questions when first written. Each was closed by fetching the evidence
rather than by deciding. `curl` gets a 403 from tricktrades.com (bot challenge); a real Chromium via
Playwright gets 200, which is how the live pages were captured.

| Was open                                                                                                              | Closed by                                                                                                             | Verdict                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`bg4.jpg` identity unverified** — the hero art was matched by filename and timestamp, never by bytes                | Fetched the googleapis URL named at `post-73938.pretty.css:9` and diffed                                              | **Byte-identical.** `shasum -a 256` = `96a26146…2bb7` for both the live `bg4.jpg` and `static/momentum-hero-bg-1920.jpg`. It _is_ the reference's hero background.                                                                                                                                                                                                                     |
| **`129` vs `15/115/14/$597` conflict** — thought to be two irreconcilable claims, the latter unsourced and banned     | Captured the live `/momentum-course` (200, 684,678 bytes) → `docs/momentum-reference/live-momentum-course.{html,txt}` | **No conflict ever existed.** That page states the breakdown verbatim under "WHAT'S INSIDE THE COURSE:" (`:49-65`), corroborated by its own module list `MODULE 1`–`13`, `Module 14: Bonus Lessons`, `Module15: Q & A` (`:117-399`) = 15 modules. 115 + 14 = 129. The figures are **certified** and now render in the Ledger. The shipped `/momentum-course` page was right all along. |
| **`/product/momentum-live-round-18` assumed going stale**                                                             | Captured the live product page (200) → `docs/momentum-reference/live-product-round-18.txt`                            | **Currently valid.** Title "Momentum Live Trading: Round 18", `Sale! $1,997.00 → $1,497.00`, `Add to cart` (`:94-100`). The rollover risk remains real but is not a present defect.                                                                                                                                                                                                    |
| **Should `/momentum` be added to the nav?**                                                                           | Read the live site's own nav, captured on two separate pages                                                          | **No.** The live nav lists only "Momentum Course" → `/momentum-course` under Academy. Adding `/momentum` would diverge from the live site. Sitemap entry stays; nav is deliberately unchanged.                                                                                                                                                                                         |
| **Should a price appear on `/momentum`?**                                                                             | Same product-page capture                                                                                             | **No.** The reference `/momentum` shows no price, and mirroring a promotional price into a static page creates a claim that goes stale silently. The product page owns pricing. Recorded in `content.ts`.                                                                                                                                                                              |
| **Firefox never run** — the `@supports` scroll-driven-animation fallback was unproven on the one engine that needs it | Ran the page in real Firefox 153.0 via Playwright                                                                     | **Fallback holds.** `CSS.supports('animation-timeline','view()')` is `false` in Firefox 153, and the page still renders correctly — white band `rgb(255,255,255)`, black band `rgb(0,0,0)`, all CTAs `rgb(178,39,37)`, plate loads `momentum-welcome-1605.avif` — with **zero console errors**.                                                                                        |
| **`momentum-page` untracked, gitignore?**                                                                             | Checked repo convention: `git ls-files page-source.txt`                                                               | **Commit it.** The repo already tracks its raw captures. No `.gitignore` change.                                                                                                                                                                                                                                                                                                       |

Gap 11 (the gsap iCloud eviction) is also closed — see its own entry below.

### Second evidence pass — the last three gaps, closed

All remaining evidence has now been **read end to end**, not searched: `wp-custom` (248 lines),
`astra-inline.pretty.css` (2,315), `astra-addon-inline.pretty.css` (2,652), all three Elementor
sheets, the capture body and head, plus live `getComputedStyle` measurements from three pages.

| Was open                                          | Closed by                                                       | Verdict                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`elementor-size-xl` button metrics uncaptured** | Reading all 50 `<link>` tags, then measuring the live page      | Elementor **never enqueues a `widget-button` stylesheet** here (widget-image and widget-image-box are loaded; the button widget is not), so the metrics exist only at runtime. Measured live: `background rgb(178,39,37)`, `color #fff`, `font-size 20px`, `weight 400`, `padding 25px 50px`, `radius 6px`, rendered **221×70**. Recorded in `momentum.css`. We match the **fill** exactly and keep the repo's pill shape — a 6px rectangle would be the site's only non-pill button. |
| **"Kit specifies Roboto, page renders Poppins"**  | Reading `astra-inline.pretty.css:117-137` + live computed style | **Not a real conflict.** Astra sets a _system stack_ (`-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, …`) for `body/button/input`; "Roboto" is only a fallback _name_ inside it. The live page computes to **`system-ui`** — no Roboto webfont governs body text anywhere. Poppins is a deliberate upgrade over an unstyled system default.                                                                                                                                     |
| **`astra-addon-inline.pretty.css` unread**        | Read in full, 2,652 lines                                       | Entirely header/menu/blog/archive/author/woocommerce/megamenu chrome. **Nothing in it governs `/momentum`'s sections** — none of those elements exist on this page. Its only bearing: `.main-header-bar { background-color: #000000 }` (`:701`).                                                                                                                                                                                                                                      |

**Two errors in our own comments were found and corrected this pass:**

1. `--mo-desc` claimed `.entry-content p { #e3e3e3 }` governs the offer descriptions and out-ranks
   the kit grey. It does not — `.elementor-widget-image-box .elementor-image-box-description` is more
   specific and wins. Measured live, both descriptions render `rgb(112,112,112)` on `#000000` =
   **3.09:1, below WCAG AA**. We keep `#e3e3e3` (16.36:1) as an explicit accessibility fix, now
   labelled as a divergence rather than a reproduction.
2. The container note claimed the captured 1140px "wins on this page". That rule is scoped to
   `.elementor-section-boxed`, and all three top-level sections are `full_width stretched` — only the
   inner quote section is boxed. The card section runs four `col-25` columns edge to edge with two
   empty, so its content is the middle ~50% of the viewport (**340px per description at 1440px**,
   measured). We keep 1140px as a deliberate legibility gain, now correctly justified.

**Nothing evidential remains open.** What remains is design judgement, recorded above: pill vs
rectangle CTAs, Poppins vs system stack, and a wider card container than the reference's 340px.

---

### 1. THE "NO ELEMENTOR STYLESHEET" GAP IS CLOSED — and the page knowingly diverges from it

**Status: NOT a gap any more. The bytes exist and I have read them.** The direction brief lists as a
"CONFIRMED EVIDENCE GAP" that no Elementor stylesheet is anywhere in the capture, and therefore that
the reference's section backgrounds, button colours/metrics, image-box typography and column gaps are
unknown. That is now false. The sheets were fetched at some point and are sitting in the slices
directory.

**Files read in full, line by line, for this entry**

- `/tmp/momentum-slices/post-73938.pretty.css` — 284 lines, the page's own Elementor sheet
- `/tmp/momentum-slices/post-47277.css` — the Elementor kit (global colours + typography)
- `/tmp/momentum-slices/post-20496.css` — the footer template sheet
- `/tmp/momentum-slices/pretty.html` head-tag extraction, and the served page's own head
  (`curl http://localhost:5199/momentum` → `/tmp/mo-ssr.html`)

**What the reference actually specifies, versus what this page renders** (page-side values are
computed styles measured in Chromium at 1440x900 and 900x900, not read off the CSS):

| Thing                                        | Reference (post-73938 / post-47277)                                                                                                                                                                                                                                                          | This page (measured)                                                                                                |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Section 1 ground (`7ee4d55`, the wordmark)   | `background-image: url(.../2022/04/06134849/bg4.jpg)` — a dark **navy market chart** field (cyan price line, volume bars, blue grid, ghosted hex characters) — `center center`, plus a `.elementor-background-overlay` of `#0a0a0a` at `opacity: .5`; `padding: 30px 0`; `margin-top: -61px` | `--tt-black` `rgb(10,10,11)` + a procedural WebGL **carbon dot** field (ChromeStage) — a different image, see gap 2 |
| Section 2 ground (`c778b3c`, the pull quote) | **`background-color: #ffffff`**; `padding: 40px 0 25px`                                                                                                                                                                                                                                      | transparent over `--tt-black` `rgb(10,10,11)`                                                                       |
| Section 3 ground (`7cd54f6`, the two cards)  | `background-color: #000000`; `padding: 0 0 20px`                                                                                                                                                                                                                                             | transparent over `--tt-black` `rgb(10,10,11)`                                                                       |
| Section 4 ground (`916db3b`, empty)          | `background-color: #ffffff`; `padding: 30px 0 0`                                                                                                                                                                                                                                             | not rendered (deliberate — see gap 5)                                                                               |
| Both LEARN MORE buttons                      | `background-color: var(--e-global-color-accent)` = **`#B22725`** for BOTH                                                                                                                                                                                                                    | course door `#05dafa` (cyan); live door a gradient centred on `rgb(178,39,37)` = `#b22725`                          |
| Image-box description size                   | `23px` desktop, `18px` at `max-width: 1024px`                                                                                                                                                                                                                                                | `17.92px` desktop, `17.61px` at 900px                                                                               |
| Pull-quote size / alignment                  | `29px` desktop, `19px` at `≤1024px`, `text-align: center` at `≤767px`                                                                                                                                                                                                                        | `36px` desktop, `31.8px` at 900px, `text-align: left`                                                               |
| Container max-width                          | `1140px` (`.elementor-section-boxed > .elementor-container`)                                                                                                                                                                                                                                 | `1200px` (`--tt-container`)                                                                                         |
| Column split, section 2                      | `20% / 59.333% / 20%` at `≥768px`                                                                                                                                                                                                                                                            | avatar `220px` + quote, `gap: clamp(1.5rem,4vw,3rem)`                                                               |
| Column split, the two cards                  | `48% / 48%` with `2%` spacers, `768–1024px`                                                                                                                                                                                                                                                  | `1fr 1fr`, `gap: clamp(1.5rem,4vw,3rem)`                                                                            |
| Heading family / weight                      | `"Allerta Stencil"`, `--e-global-typography-primary-font-weight: 600`                                                                                                                                                                                                                        | `"Allerta Stencil"`, weight `400`                                                                                   |
| Elementor global text colour                 | `--e-global-color-text: #707070`                                                                                                                                                                                                                                                             | card descriptions `--mo-desc #e3e3e3` (from wp-custom-css `.entry-content p`)                                       |
| Elementor global primary                     | `--e-global-color-primary: #191A19`                                                                                                                                                                                                                                                          | not used                                                                                                            |

**What this blocks.** Nothing is broken — but the direction brief's central colour argument
("the two card images have ALREADY made the assignment: cyan marks the course door, red marks the
live door") was written believing the reference's own button colours were unknowable. They are
knowable and they are **both `#B22725`**. The cyan course button is therefore a deliberate art
direction decision, not a reading of the evidence, and it should be labelled that way rather than as
captured. Likewise the white grounds on sections 2 and 4: this page renders a wholly dark page where
the reference alternates dark → white → black → white.

**I did not act on any of this.** Re-skinning the page is an art-direction reversal and squarely an
owner decision; the brief made its dark-page choice deliberately and documented it. This entry exists
so the choice is made with the evidence in view instead of in its absence.

### 2. The hero background photograph IS downloaded — and is completely unused

`post-73938.pretty.css:9` gives the exact URL:
`https://trick-trades-media-storage.storage.googleapis.com/wp-content/uploads/2022/04/06134849/bg4.jpg`

`static/momentum-hero-bg-1920.jpg` exists — 1920x1080 JPEG, downloaded 2026-08-12 11:59, the same
minute the Elementor sheets were fetched into `/tmp/momentum-slices/`. I opened it: a dark navy
market field — a cyan price line with a second faded line behind it, translucent volume bars, a
blue grid, and rows of ghosted hex/alphanumeric characters. Combined with the captured
`background-overlay` of `#0a0a0a` at 50%, that is the reference's real Overture ground.
Derivatives exist too: `momentum-hero-bg-1920.{webp,avif}`, `momentum-hero-bg-1280.{webp,avif}`.

**Honest limit on this claim:** I did not fetch `bg4.jpg` to compare bytes, so "this file is bg4.jpg"
is a strong inference from filename, dimensions and download timestamp, not a verified identity.

**Not referenced anywhere.** `grep -rn "momentum-hero-bg" src/` returns nothing. The Overture answers
that slot with ChromeStage instead — a procedural carbon field built from the motif measured in
`momentum-course-1920.png`, i.e. an inference from sibling artwork, and a different image entirely
from the reference's blue chart field.

**Blocks:** an evidence-faithful Overture ground. The asset is sitting in `static/` ready; using it is
an art-direction decision (it would put a blue chart behind a page whose whole argument is
chrome-on-black), not a missing-evidence problem.

### 2b. ~2.6 MB of PNG ships on this page while visually-lossless AVIF/WebP derivatives sit unused

The page serves the original PNGs directly. Measured file sizes in `static/`:

| Served now                   | Bytes     | AVIF derivative                                | Bytes         |
| ---------------------------- | --------- | ---------------------------------------------- | ------------- |
| `momentum-course-1920.png`   | 1,142,940 | `momentum-course-1920.avif` (1920x1080)        | 69,984-class* |
| `momentum-live-1280.png`     | 831,816   | `momentum-live-1280.avif` (1280x720)           | —             |
| `momentum-welcome-1605.png`  | 521,110   | none                                           | —             |
| `momentum-wordmark-1454.png` | 138,384   | `momentum-wordmark-1454.avif` (1454x397, RGBA) | —             |
| `pat-avatar-220.png`         | 45,573    | `pat-avatar-220.avif` (220x220, RGBA)          | 5,361         |

\*sizes vary per file; the four small derivatives at 960/728/640/220 total ~48 KB.
Total PNG shipped ≈ **2.68 MB**, for a page whose largest displayed image box is 536x302 CSS px at
1440 wide. `grep -rn "avif\|webp\|<picture\|srcset" src/lib/pages/momentum/ src/routes/momentum/`
returns only two prose comments — no `<picture>`, no `<source>`, no `srcset`.

Quality is not the obstacle. Comparing `momentum-course-1920.avif` against its PNG with PIL over all
1920x1080x3 samples: **RMS difference 1.33/255**, max single-channel difference 64 (isolated, at the
lens-flare specular edge). The alpha-bearing assets (wordmark, avatar) are RGBA in AVIF, so the
transparent seam at rows 211–223 and the avatar's alpha-0 corners survive.

**I did not make this change.** It is a four-component edit (Overture, both Paths cards, Voice) that
needs per-breakpoint `sizes` values and re-verification at every width, the derivatives were staged by
another pass whose intent I could not see, and it is outside the visual-defect remit this pass was
given. Flagged as the highest-value remaining item: it is the page's LCP path.

### 3. The site header / nav markup is genuinely absent from the capture

`<header id="masthead">` is an empty element in `/tmp/momentum-slices/pretty.html`.

Read looking for it: `pretty.html` body range, `head-tags.txt`.

**Blocks:** nothing for this build — the repo's own `Header.svelte` is rendered by the layout and
looks correct in every screenshot — but there is no reference for how /momentum's nav looked.

### 4. The briefed Ledger PIN is not implemented, and cannot be added as briefed at measured sizes

The brief specifies Beat 3 as this page's one pinned beat:
`{ trigger: '#ledger', start: 'top top', end: '+=120%', pin: true, scrub: 0.8, anticipatePin: 1 }`,
desktop only.

Read looking for it: `src/lib/pages/momentum/motion/Director.svelte` (full, 419 lines — it owns the
rail, the aura, the velocity skew and Beat 4, and creates no pin) and
`src/lib/pages/momentum/sections/Ledger.svelte` (full — it owns the tape scrub only). Before this
pass, `Ledger.svelte`'s header comment asserted that "the direction brief assigns the pinned
ScrollTrigger on #ledger to Director.svelte"; Director does not create one, so the two files pointed
at each other. **That false cross-reference is fixed in this pass**; the pin itself is not.

Browser evidence: `document.querySelectorAll('.pin-spacer').length === 0` at 1440x900.

Why it is not safe to just add: a pin anchored at `top top` holds the section against the top of the
viewport, so anything taller than the viewport is unreachable for the whole pinned range. Measured
`#ledger` heights: **940px at 1440x900** (40px past the fold) and **940px at 1440x700** (240px past
the fold). The provenance line — and at 700px tall, part of the tape itself — would be off-screen and
un-scrollable for the entire pin.

**Blocks:** the brief's intended dwell on the empty Lane-B tick region, which is the page's argument.
Needs an owner decision on the section's height budget first (e.g. a shorter tape and lane heads at
`≥1024px`), then the pin.

### 5. Section 4 of the reference (`916db3b`) is an empty container

`pretty.html` shows one `col-100` column with an empty `elementor-widget-wrap`. `post-73938.pretty.css:186-203`
gives it a white ground and `30px` top padding but no content rules. Whatever it held was never captured.

Read looking for it: `pretty.html` body range 7280–7660, `post-73938.pretty.css` (full).

**Blocks:** nothing. The page deliberately renders no content for that slot rather than padding it.

### 6. No price, no cohort/enrolment date, no countdown, no seat count, no module or lesson titles

None exists anywhere in the evidence for Momentum.

Read looking for them: `pretty.html` (body range), `/tmp/momentum-slices/bodyText.txt`,
`meta.txt`, `post-73938.pretty.css`, `post-47277.css`.

**Blocks:** any urgency or commerce framing on this page. None is written, and none may be.

### 7. `15 modules / 115 video lessons / 14 bonus lessons / "B.O.S.S. Carbon a $597 value"` are UNSOURCED

Every occurrence in this repo traces to `src/lib/pages/day-trading-academy/data.ts` (:38, :41), whose
"transcribed from tricktrades.com" header has no backing capture — the repo holds no capture of
`/momentum-course`, `/day-trading-academy` or `/digital-store`. `115 + 14 = 129` is arithmetic
consistency, not a source.

**Blocks:** these figures are forbidden on /momentum and are absent from it. **Open tension:** the
already-shipped `/momentum-course` page states them. Resolving that is out of scope for /momentum but
someone must own it.

### 8. The live CTA points at a round-specific URL that will go stale

`https://tricktrades.com/product/momentum-live-round-18` — reproduced exactly as captured
(`pretty.html:7610`). Whether round 18 is still current cannot be determined from the capture
(`og:updated_time` is 2026-08-11T10:24:33-04:00).

**Blocks:** nothing today. Will 404 for visitors once the round rolls over.

### 9. The reference asks for Allerta Stencil weight 600; only weight 400 is installed

`post-47277.css`: `--e-global-typography-primary-font-weight: 600`.
`@fontsource/allerta-stencil` ships latin-400 only. The page therefore renders headings at
weight 400 (measured: `font-weight: 400`, `font-family: "Allerta Stencil", Poppins, sans-serif`), and
must keep doing so — requesting 600 would make the browser synthesise a fake bold.

**Blocks:** exact weight match with the reference. Would need a real 600 face.

### 10. The astra-addon inline block was never read in full

`/tmp/momentum-slices/astra-addon-inline.pretty.css` is 2,652 pretty-printed lines and remains unread,
as do the WooCommerce inline blocks.

**Blocks:** nothing observed. If sticky-header or mobile-breakpoint specifics from the reference ever
matter, that is where they are.

### 11. ~~BUILD BLOCKER~~ RESOLVED 2026-08-12: `gsap/dist/SplitText.js` was an iCloud-evicted placeholder

> **Status: FIXED.** The evicted file was unlinked (to avoid writing through pnpm's hardlink into the
> store) and replaced from `/tmp/gsap-repair/package/dist/SplitText.js`. The tarball was proved to
> match this exact install by comparing a sibling: `shasum -a 256` of `ScrollTrigger.js` is
> `98e0ab6d…548b` in both the tarball and `node_modules`. After the repair the file reads OK
> (`blocks=40`, `dataless` flag cleared) and **all 76 gsap `dist` files now read successfully**.
>
> `pnpm run build` is green end to end — client, server and the Vercel adapter. The real
> `pnpm run dev` serves `/momentum` with HTTP 200 and 93,653 bytes of SSR HTML, zero errors in the
> log. The throwaway `/tmp/mo-verify/` Vite config is no longer needed.
>
> **Root cause worth knowing:** this project lives under `~/Desktop`, which macOS syncs to iCloud
> Drive and evicts. **10,076 files under `node_modules` are still `dataless` placeholders.** They
> rehydrate transparently on read, so this is usually invisible — `SplitText.js` was one whose
> placeholder had gone bad and could not be rehydrated (`brctl download` exited 0 but changed
> nothing). Expect this to recur. If a build ever dies with `Operation timed out (os error 60)` on a
> `node_modules` path, this is why. Moving the repo out of `~/Desktop`, or excluding it from iCloud,
> removes the whole class of failure. `src/` and `static/` are clean — no source file is affected.

<details><summary>Original report (kept for the diagnostic detail)</summary>

`node_modules/.pnpm/gsap@3.15.0/node_modules/gsap/dist/SplitText.js` carries the macOS `dataless`
flag with `blocks=0`; every read returns `ETIMEDOUT`. `brctl status` hangs, so the sync daemon cannot
rehydrate it. Four other files in the same directory are in the same state:
`ScrollSmoother.js`, `Physics2DPlugin.min.js`, `CSSRulePlugin.min.js.map`, `DrawSVGPlugin.min.js.map`.

Reached via `src/lib/motion.ts:9`, which is on `main` and imported by `+layout.svelte` — nothing to do
with /momentum. It kills `pnpm run dev` and the client half of `pnpm run build` at the dep-optimizer
stage.

`pnpm install --force` reports "Already up to date" and does not relink. **The pnpm store is healthy**:
a walk of `/Users/billyribeiro/Library/pnpm/store/v11/files` read 94,269 files with 0 failures and
found an intact copy of SplitText at
`.../files/8f/9dfb227c9cd1988ed79b6d73d62af87115c3edcdf00b819729512611cc34b50059120a3c6ce32071d7ca107a0fec6835045ba1d49bbb3cb6b4323f475f15f3`.

**Fix (needs a human, or a permission grant):** `rm -rf node_modules && pnpm install`, or copy
`/tmp/gsap-repair/package/dist/SplitText.js` over the evicted path. Writing into `node_modules` was
denied by the permission system twice in this session and was not worked around.

**Blocks:** the real `pnpm run dev` and `pnpm run build`. This pass drove the page from a throwaway
Vite config in `/tmp/mo-verify/` that aliases only that one specifier at the intact ESM build; no repo
file and no `node_modules` file was modified to achieve it.

</details>

### 12. Knowing deviations, recorded so no reviewer "corrects" them back

- **DOM order.** The reference orders the pull-quote section before the two-card section. This page
  places Paths before Voice, so both LEARN MORE links are reachable early on a phone. Measured at
  390x844: course CTA at **1.22 viewports**, live CTA at **1.75 viewports**. Leaving the quote between
  the title card and the doors would push the first CTA past roughly 1.9 viewports.
- **`©2121926 Alberta ltd`** (`pretty.html:7717`, lowercase "ltd") is captured but deliberately NOT
  rendered in Disclosure — the global Footer already stamps
  `© {year} 2121926 Alberta Ltd. All rights reserved.` a few elements below.
- **Body background.** The reference's captured body background is `#191a19`; this page uses
  `--tt-black` `#0a0a0b`. Corroborating detail found this pass: the reference's own hero overlay is
  `#0a0a0a` at 50% (`post-73938.pretty.css:15`), which is within one channel step of `--tt-black`.
- **Section index denominator.** Changed this pass from `01 / 04` + `02 / 04` to `01 / 02` + `02 / 02`.
  The page renders exactly two indexed section heads; a "/ 04" promised four indexed beats and
  delivered two. Every other page in the repo uses a complete run
  (`testimonials` 01/02+02/02, `trick-trades-core` 01/02+02/02, `day-trading-bootcamp` 01/03+02/03+03/03).

### 13. Closed since the brief was written — do not re-report these

- `/momentum` **is** in `src/routes/sitemap.xml/+server.ts:16`.
- `Seo.svelte` now takes `imageWidth` / `imageHeight` props (`:15-16`, `:29-30`, `:83-84`). The served
  page emits `og:image:width 1605` / `og:image:height 398`, matching the real asset. The hardcoded
  1200x800 defect described in the brief no longer applies to this route.

---

## Evidence gaps and open items — /momentum (final gate, 2026-08-12)

_Appended by the final correctness + visual gate. Everything below was verified this pass by running
the command or by reading the file/screenshot named. Nothing here is inferred from a previous
agent's report. Numbers that were measured say so and give the measurement._

### A. The recovered stylesheets live only in /tmp and WILL be lost

`post-73938.css` (the page's own rules), `post-47277.css` (the site kit / global palette) and
`post-20496.css` (the footer template) were **not** missing from the capture, as the original build
brief claimed. The capture's own `<link>` tags name them, so all three were recoverable by URL. They
now sit at:

- `/tmp/momentum-slices/post-73938.pretty.css` — 284 lines, the source of every captured value on
  this page (section backgrounds, the `#B22725` button rule, the 29px/19px quote step, the 23px/18px
  description step, the S1 background-image and its `#0a0a0a` @ 50% overlay).
- `/tmp/momentum-slices/post-47277.css` — the kit palette (`--e-global-color-accent: #B22725`,
  `--e-global-color-text: #707070`, `--e-global-color-primary: #191A19`, the 1140px container).
- `/tmp/momentum-slices/post-20496.css` — 685 bytes, the reference's footer typography.

**`/tmp` does not survive a reboot.** If this page is ever revisited these three files must be
committed somewhere durable (suggest `docs/momentum-reference/`) or the next agent will be told the
same false "there is no Elementor CSS in the capture" story that produced the all-black first build.

**Still unread by anyone in this chain:** `post-20496.css`. Disclosure's `0.875rem/1.75` type is
therefore a stated page-scope legibility decision for a 1,748-character block, not a captured value.

### B. The /momentum-course figures are unsourced and are NOT repeated on /momentum

Per decision D2 these must not appear on `/momentum`, and re-verified this pass: they do not. They
DO appear on the already-shipped `/momentum-course` page, which was deliberately not edited:

- `src/routes/momentum-course/+page.svelte:14` and `:26` — "15 modules and 115 video lessons, plus
  14 bonus lessons and B.O.S.S. Carbon (a $597 value)", in the meta description and the SEO block.
- `src/lib/pages/momentum-course/MomentumHero.svelte:10` (`{ value: 115, label: 'Video lessons' }`)
  and `:39` ("Fifteen modules and 115 video lessons").
- `src/lib/pages/momentum-course/MomentumScope.svelte:7` and `:10`.
- `src/lib/pages/momentum-course/MomentumEnroll.svelte:30`.
- `src/lib/pages/momentum-course/MomentumBoss.svelte:29`, `:32`, `:45` (the `$597` figure).

`/momentum` states only "Over 129 Video Lessons" — which is what the capture says
(`data/content.ts:195`, verbatim from the captured description) — plus the captured live-round facts.
**129 and 115 cannot both be right.** These need checking against real course data before either page
is trusted; whichever is stale should be corrected at the source, not reconciled by guesswork.

### C. `/product/momentum-live-round-18` is a round-specific URL that will go stale

`data/content.ts` (the `links.live` entry) carries
`https://tricktrades.com/product/momentum-live-round-18`, captured verbatim from `pretty.html:7610`.
The round number is hardcoded **in the URL**. When round 18 closes, both live-round CTAs on
`/momentum` — the Paths card and the Close door — point at a dead or wrong product page. The capture
cannot tell us whether 18 is even current now (its `og:updated_time` is 2026-08-11T10:24:33-04:00).
Needs an owner decision: a stable `/product/momentum-live` style alias, or a documented release step
that bumps this constant.

### D. Registration: sitemap YES, nav NO

- **Sitemap — registered.** `src/routes/sitemap.xml/+server.ts:16`:
  `{ path: '/momentum', priority: '0.7', changefreq: 'monthly' }` (read this pass).
- **Nav — NOT registered.** `src/lib/data/site.ts:55` lists only
  `{ label: 'Momentum Course', href: '/momentum-course' }`. There is no `/momentum` entry anywhere in
  `site.ts`. So the page is discoverable by search engines but unreachable from the site's own header.
  **This is an open owner decision, not a defect:** `/momentum` and `/momentum-course` are two pages
  about the same product, and adding both to the Academy menu invites exactly the 129-vs-115
  confusion in item B. Decide which one the nav should point at.

### E. Baseline features marked AVOID that were therefore not used

From the 12 Aug 2026 platform-baseline verification (raw MDN BCD + `api.webstatus.dev`, not Baseline
badges). Recorded so nobody "modernises" these in later:

- **`@scope`** — AVOIDED. An unsupported at-rule is dropped _with everything inside it_, so styles
  vanish rather than degrade, and Firefox only shipped it in 146 (absent from ESR 140). Svelte already
  scopes component styles; the page keeps its manual `.mo-scope` prefix instead.
- **Cross-document view transitions (`@view-transition`)** — AVOIDED, `firefox: false` in BCD. Not
  needed anyway: after hydration SvelteKit navigations are same-document.
- **`container-type: scroll-state`** — AVOIDED as load-bearing; Chromium-only (chrome 133, firefox and
  safari absent). Nothing functional on this page depends on it.
- **Variadic `color-mix()`** (more than two colours) — AVOIDED; not implemented in Chrome at all.
- **`popover=hint`** — AVOIDED; `safari: false`.
- **`interpolate-size` / `calc-size()`** — not used; Chromium-exclusive, and no layout here depends on
  animating to a keyword size.
- **WebGPU** — not used, per decision D3.
- **Scroll-driven animations** — USED, but every rule is inside `@supports (animation-timeline: view())`
  with `animation-timeline` declared _after_ the `animation` shorthand. This is not optional: Firefox
  drops the timeline and keeps the shorthand, so an unguarded rule plays once on load and parks the
  element at its end state. Firefox itself was never run this pass (see G).

### F. Fixed at this gate

- **V4 residue (the last open item from the review).** `motion/Director.svelte` rendered a two-digit
  chapter index `01`..`06`, one per section, revealed on the active stop, while the section heads count
  the page's two titled beats as `01 / 02` and `02 / 02`. Both were on screen at once at >=1280px:
  `/tmp/mo-final/desktop-1440-scroll-45.png` shows the rail reading **04** beside a head reading
  **02 / 02**. The rail's numeral was the counter that contradicted the content, so it was removed
  along with its now-dead `chapters` constant and its two orphaned CSS rules. Six dots remain as a
  pure position readout. Verified: `.mo-rail__idx` count 0, `.mo-rail__dot` count 6, rail `textContent`
  empty (`/tmp/mo-final/verify.json`).
- **Two identical unlabelled CTAs in Close.** The Close section has no counterpart in the capture and
  rendered the two "LEARN MORE" buttons with no description between them — stacked full-width on a
  phone, they were indistinguishable to a sighted reader (`/tmp/mo-final/m2-phone-y2700.png`). Their
  `aria-label`s already differed, so this was never an AT problem, only an on-screen one. Each door now
  carries `offer.shortLabel` above its button: the opening sentence of that offer's own captured
  description, verbatim, minus the full stop. **No new copy was written.**
- **Three stale comments** in `Director.svelte` that described motion which no longer exists (Close's
  deleted `parallax(-40)`, Disclosure's deleted `reveal()`, Voice's deleted avatar parallax).

### G. Honest gaps still open after this gate

1. **Firefox was never run.** The `@supports` fallback is proven only by the reduced-motion path,
   which takes the identical base rules — a real Firefox render has still not happened by anyone.
2. **`static/momentum-hero-bg-1920.jpg` is still not byte-verified as the reference's `bg4.jpg`.** The
   identification rests on filename, 1920x1080 dimensions and download timestamp. Nobody has diffed it
   against the googleapis URL at `post-73938.pretty.css:9`.
3. **`pretty.html` has still not been read by any agent in this chain.** Every `pretty.html:NNNN`
   citation in the momentum source is inherited from `data/content.ts`'s transcription. The
   `post-73938.pretty.css` / `post-47277.css` citations ARE first-hand.
4. **LCP/CLS were measured against the dev server on localhost**, so the LCP figures (44-56ms) are not
   a field-realistic number — they prove the LCP _element_ is the hero plate and that nothing blocks
   it, nothing more. CLS is the meaningful figure here: 0.0004 desktop / 0.0002 phone / 0.0131 tablet.
5. **`content-visibility: auto` on `#disclosure` makes full-page screenshots lie.** Chromium's
   capture-beyond-viewport does not render the skipped subtree, so `#disclosure` photographs as an
   empty band in every `fullPage: true` screenshot while being perfectly visible in the browser
   (proved this pass by element screenshot + computed styles: opacity 1, 1748 chars, 14px
   `rgb(128,130,142)` on `rgb(10,10,11)` = 5.50:1). **This is a screenshot artifact, not a defect —
   do not "fix" it.** The same artifact makes scroll-driven-animation elements photograph at their 0%
   state; judge this page from scrolled viewport frames, never from a full-page capture.
6. **The `elementor-size-xl` button metrics are still uncaptured.** The CTA's padding, radius and
   font-size remain inherited from `Button.svelte`'s `--lg` variant.
7. **Body face is still a known mismatch.** `post-47277.css` specifies "Roboto" for text and
   "Roboto Slab" for secondary; the page renders Poppins. No Roboto face is installed in the repo.
8. **`momentum-welcome-1605.png` has no AVIF/WebP derivative**, so the Close plate still ships as a
   521 KB PNG. The derivatives need encoding before any `<picture>` can reference them; no agent
   invented paths to files that do not exist.
9. **Untracked artefact:** `momentum-page` (340 KB raw HTML capture) still sits in the repo root and is
   not in `.gitignore`. It shows as `?? momentum-page` in `git status`. Decide: commit it as evidence
   under `docs/`, or ignore it.
