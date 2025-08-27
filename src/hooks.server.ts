import type { Handle } from '@sveltejs/kit';

const AUTHELIA_DOMAIN = process.env.AUTHELIA_DOMAIN || 'auth.localhost.test';
const ALLOWED_USERS = process.env.ALLOWED_USERS ? process.env.ALLOWED_USERS.split(',') : ['admin'];

export const handle: Handle = async ({ event, resolve }) => {
	// Get the authelia_session cookie from the request
	const authSessionCookie = event.cookies.get('authelia_session');
	
	// Initialize user as undefined
	event.locals.user = undefined;
	
	if (!authSessionCookie) {
		console.log('No authelia_session cookie found');
		// No cookie, user remains undefined
		return resolve(event);
	}

	try {
		// Get all cookies from the request to forward them
		const cookieHeader = event.request.headers.get('cookie') || '';
		
		// Check authentication status with Authelia
		const authResponse = await fetch(`https://${AUTHELIA_DOMAIN}/api/state`, {
			headers: {
				'Cookie': cookieHeader,
				'Accept': 'application/json'
			}
		});

		if (authResponse.status !== 200) {
			// Not authenticated
			event.locals.user = undefined;
			return resolve(event);
		}

		const authData = await authResponse.json();
		
		// Check if response has expected structure
		if (authData.status !== 'OK' || !authData.data || !authData.data.username) {
			event.locals.user = undefined;
			console.error('Invalid auth data structure:', authData);
			return resolve(event);
		}

		// Check if user is in allowed list
		const username = authData.data.username;
		if (!ALLOWED_USERS.includes(username)) {
			console.warn(`User ${username} not in allowed list`);
			event.locals.user = undefined;
			return resolve(event);
		}

		const authLevel = authData.data.authentication_level;
		if (typeof authLevel !== 'number' || authLevel < 1) {
			console.warn(`User ${username} has insufficient authentication level: ${authLevel}`);
			event.locals.user = undefined;
			return resolve(event);
		}

		// User is authenticated and authorized
		event.locals.user = {
			username,
			authenticationLevel: authData.data.authentication_level
		};

	} catch (err) {
		console.error('Authentication check failed:', err);
		event.locals.user = undefined;
	}

	// Continue with the request
	return resolve(event);
};