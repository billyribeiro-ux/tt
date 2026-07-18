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
