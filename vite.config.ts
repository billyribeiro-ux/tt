import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath, URL } from 'node:url';

// This Kit version (3.0.0-next) removed svelte.config.js — config is passed inline to
// the sveltekit() plugin, which also owns `svelte-kit sync`, the $lib alias, and type gen.
export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for project code, leave libraries untouched.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
				experimental: { async: true }
			},
			adapter: adapter(),
			/**
			 * VERSION POLLING. Without this, `pollInterval` defaults to 0 and the client
			 * NEVER checks whether a newer build has shipped.
			 *
			 * That is not cosmetic on this site. `app.html` sets
			 * `data-sveltekit-preload-data="hover"`, so navigation between routes is
			 * client-side: an open tab keeps rendering the JS chunks it downloaded on
			 * first visit. A new deployment can be live and correct, and that tab will
			 * still render the previous build's components indefinitely — the server is
			 * never asked for the new HTML. It looks exactly like "nothing changed".
			 *
			 * As of the next.14 upgrade Kit DOES detect new deployments automatically
			 * (tab focus, visibility, data/remote/form responses — added in next.12) and
			 * defaults `pollInterval` to one hour. This 60s override is kept deliberately:
			 * an hour is far too long for a marketing site that is being iterated on, and
			 * the cost is one small request a minute per open tab.
			 * `+layout.svelte` consumes the resulting `updated` signal.
			 */
			version: {
				pollInterval: 60_000
			},
			experimental: {
				remoteFunctions: true,
				forkPreloads: true
			}
		})
	],
	resolve: {
		alias: {
			// Kit 3.0.0-next doesn't register the built-in $lib alias in Vite's SSR module
			// runner, so define it explicitly here — authoritative for both SSR and client.
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url))
		}
	},
	// phosphor-svelte ships ~6,000 icon modules; let Vite serve the few we deep-import
	// as-is instead of pre-bundling/crawling the whole set (which OOMs the dep scanner).
	optimizeDeps: {
		exclude: ['phosphor-svelte']
	},
	server: {
		fs: { strict: false },
		watch: { ignored: ['**/node_modules/**', '**/.svelte-kit/**'] }
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
