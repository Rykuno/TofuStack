import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	esbuild: {
		target: 'es2022'
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
