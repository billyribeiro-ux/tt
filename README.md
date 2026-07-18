# Trick Trades — marketing site

Cinematic marketing site for [tricktrades.com](https://tricktrades.com), rebuilt with
**SvelteKit (3.0.0-next) + Svelte 5 runes**, fully prerendered and deployed on Vercel.

- **Design system:** vanilla scoped CSS on `--tt-*` tokens — see [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
- **Motion:** GSAP ScrollTrigger/SplitText wrapped as Svelte attachments in `src/lib/motion.ts`
- **Content:** all real copy/prices/testimonials live in `src/lib/data/site.ts` — never hardcode facts in components
- **Structure:** homepage sections in `src/lib/sections/`, per-route sections in `src/lib/pages/<route>/`

## Commands

```sh
pnpm dev          # dev server
pnpm build        # prerender all routes (this IS the deploy artifact)
pnpm preview      # serve the built site
pnpm check        # svelte-check (type + a11y)
pnpm lint         # prettier + eslint
pnpm test:unit    # vitest
pnpm test:e2e     # playwright (run test:e2e:install once first)
```

Note: SvelteKit config lives inline in `vite.config.ts` (this Kit prerelease removed
`svelte.config.js`). The `$lib` tsconfig paths are load-bearing — the generated tsconfig
does not emit them in 3.0.0-next.

<details>
<summary>Recreate the original scaffold</summary>

```sh
pnpm dlx sv@0.16.3 create --template minimal --types ts --add prettier eslint vitest="usages:unit,component" playwright sveltekit-adapter="adapter:vercel" mcp="ide:claude-code,vscode+setup:remote" experimental="versions:kit+features:async,remoteFunctions,explicitEnvironmentVariables,handleRenderingErrors,forkPreloads" --install pnpm trick-trades
```

</details>
