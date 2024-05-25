import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import ViteRestart from 'vite-plugin-restart';

export default defineConfig({
	plugins: [
		sveltekit(),
		ViteRestart({
			restart: ['./src/lib/server/api/**']
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
