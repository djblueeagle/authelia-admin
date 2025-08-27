import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const TRUSTED_ORIGINS = process.env.TRUSTED_ORIGINS?.split(',') || ['https://auth.localhost.test'];
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-node options
		adapter: adapter({
			// default options
			out: 'build',
			precompress: false,
			envPrefix: '',
		}),
		alias: {
			'$lib': './src/lib',
			'$lib/*': './src/lib/*'
		},
		// Set base path for the application
		paths: {
			base: '/auth-admin',
			relative: false
		},
		// CSRF configuration for reverse proxy
		csrf: {
			trustedOrigins: TRUSTED_ORIGINS
		}
	}
};

export default config;