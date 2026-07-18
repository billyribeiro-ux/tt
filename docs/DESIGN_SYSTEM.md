# Trick Trades — Build & Design Contract (READ FULLY BEFORE WRITING CODE)

You are building one section of a cinematic marketing homepage rebuild of tricktrades.com in
**Svelte 5 + SvelteKit**. The bar: it must look like a **senior human design studio** made it —
editorial, premium, restrained. If it looks like a generic AI/SaaS template, it has FAILED.

## The look we are going for

Mood board: a Bloomberg terminal at 4am × a premium whisky campaign × a Nike "grit" ad.
Dark, high-stakes, disciplined, masculine, expensive. Confident negative space. Real numbers.

## NON-NEGOTIABLE RULES

1. **Vanilla CSS only.** Scoped `<style>` in each `.svelte` file. NO Tailwind, NO utility
   classes, NO CSS framework, NO inline style spam. Use the design tokens (CSS vars) from `app.css`.
2. **Use the tokens, never hardcode brand values.** Colors/fonts/spacing come from the `--tt-*`
   variables. The ONLY palette: near-black canvas, brand red `--tt-red`/`--tt-red-bright` as the
   single accent (used sparingly), warm off-white text, `--tt-amber`/`--tt-gold` for premium
   highlights. No purple. No teal-on-everything. No rainbow gradients.
3. **Motion** comes from `$lib/motion.ts` attachments (`{@attach reveal()}`, `splitReveal`,
   `parallax`, `counter`, `tilt`, `marquee`). Do not add raw GSAP imports in sections. Every
   animated element must degrade: put `data-anim` (single) or `data-anim-stagger` (its children)
   on elements you attach `reveal` to, and `data-split` on headlines you attach `splitReveal` to,
   so no-JS/reduced-motion keeps content visible.
4. **Svelte 5 runes only** (`$props`, `$state`, `$derived`, `$effect`). Snippets over slots.
5. **Icons:** `phosphor-svelte`, and import the **`*Icon`-suffixed** names
   (e.g. `import { FireIcon, BrainIcon } from 'phosphor-svelte'`) — never bare `Image`/`X`/`List`.
6. **Run the Svelte MCP `svelte-autofixer` on every file until it returns zero issues.** Load it
   first with ToolSearch `select:mcp__svelte__svelte-autofixer`. (If the MCP is truly unavailable,
   write correct runes code and say so.)
7. **Content is real** — import it from `$lib/data/site.ts`. Never invent prices, names, numbers,
   or testimonials. Copy may be lightly tightened for rhythm, but no fabricated facts.
8. **Do NOT touch shared files** (`app.css`, `motion.ts`, `site.ts`, `+page.svelte`, `+layout.*`,
   `Header/Footer/Button/Vsl/Seo`). Only create the files you are assigned. **Do not run
   `pnpm add`/`install`.** Everything you need is installed.
9. Every `<img>`/media has explicit `width`+`height` or `aspect-ratio` (no layout shift).
   Semantic HTML: real `<section>`, `<h2>` per section, `<ul>`/`<dl>` for lists, buttons are `<button>`.

## Anti-"AI-made" checklist (the difference between amateur and studio)

- ❌ Everything centered. ✅ Asymmetric editorial grids; strong left alignment; deliberate offsets.
- ❌ 3 identical rounded cards with a big emoji/icon on top, centered. ✅ Varied composition —
  numbered editorial rows, split layouts, oversized index numerals, overlapping layers, a feature
  that spans wide next to two narrow ones. Icons small and monochrome, not decorative blobs.
- ❌ Uniform pill-gradient buttons everywhere. ✅ Reuse `<Button>` (import from
  `$lib/components/Button.svelte`) for CTAs; most sections need at most one CTA.
- ❌ Generic "gradient text" on every heading. ✅ White headlines; use `.text-gradient` or
  `--tt-red-bright` on at most one accent word per section.
- ❌ Even, timid spacing. ✅ Big type-scale contrast (a tiny mono `.label` kicker над a huge
  `--fs-h2` headline), generous `.tt-section` vertical rhythm, hairline `--tt-line` rules.
- ✅ Editorial devices to reach for: a mono index like `01 / 03`, `.label` kickers, hairline
  dividers, a faint `.grid-bg`, tabular `.num` figures, a thin ticker, corner registration marks,
  oversized quotation marks, a rotated caption, a soft red radial glow bleeding off one edge.
- ✅ Typography: `--tt-font-display` (Allerta Stencil) for short stencil kickers/labels only;
  `--tt-font-body` (Poppins) for headings/body; `--tt-font-script` (Reenie Beanie) for a human
  signature touch; `--tt-font-mono` for labels/numbers/ticker.

## The tokens you have (see `app.css` for all)

- Color: `--tt-black #0a0a0b`, `--tt-ink`, `--tt-ink-2/3`, `--tt-red #b22725`, `--tt-red-bright
#ff3333`, `--tt-amber`, `--tt-gold`, text `--tt-white/--tt-fog/--tt-mute/--tt-mute-2`, borders
  `--tt-line`/`--tt-line-strong`, light surfaces `--tt-paper`/`--tt-paper-ink`.
- Type scale: `--fs-eyebrow --fs-body --fs-lead --fs-h4 --fs-h3 --fs-h2 --fs-h1 --fs-mega` (all fluid).
- Fonts: `--tt-font-body --tt-font-display --tt-font-script --tt-font-mono`.
- Layout: `.tt-container` (+`--wide`), `.tt-section` (vertical rhythm). Helpers: `.label`,
  `.section-head`(`.idx`/`.rule`), `.prose`, `.hairline`, `.num`, `.grid-bg`, `.eyebrow`, `.script`,
  `.text-gradient`, `.text-red`.

## Motion API (from `$lib/motion.ts`)

```svelte
{@attach reveal({ y, x, scale, duration, delay, start, stagger })}   // + data-anim / data-anim-stagger
{@attach splitReveal({ stagger, start })}                             // + data-split, on headline
{@attach parallax(amount)}   {@attach counter(value, fmt)}   {@attach tilt(max)}   {@attach marquee(speed)}
```

Study `src/lib/sections/Hero.svelte` — it is the CANONICAL exemplar for tone, structure, motion
usage, and CSS conventions. Match its quality and vocabulary. Every section starts with
`<section class="tt-section ...">` and a `.tt-container` inside.
