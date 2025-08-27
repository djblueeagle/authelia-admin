import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Check if user is authenticated
	if (!locals.user) {
		// User is not authenticated, throw 403 error
		throw error(403, {
			message: 'Authentication required'
		});
	}

	// User is authenticated, return user data
	return {
		user: locals.user
	};
};