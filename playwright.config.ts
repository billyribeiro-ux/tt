import { defineConfig } from '@playwright/test';

export default defineConfig({
	testMatch: '**/*.e2e.{ts,js}',
	webServer: {
		command: 'pnpm run build && pnpm run preview',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure'
	},
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? 'github' : 'list'
});
