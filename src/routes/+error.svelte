<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

{#if $page.status === 403}
	<main class="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-8">
		<div class="container mx-auto max-w-md text-center">
			<h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">403</h1>
			<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Access Forbidden</h2>
			<p class="text-gray-600 dark:text-gray-400 mb-8">
				You don't have permission to access this resource. Please ensure you are logged in with an authorized account.
			</p>
			<a 
				href="https://auth.localhost.test" 
				class="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
			>
				Go to Login
			</a>
		</div>
	</main>
{:else if $page.status === 404}
	<main class="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-8">
		<div class="container mx-auto max-w-md text-center">
			<h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
			<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
			<p class="text-gray-600 dark:text-gray-400 mb-8">
				The page you're looking for doesn't exist.
			</p>
			<a 
				href="{base}/" 
				class="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
			>
				Go Home
			</a>
		</div>
	</main>
{:else}
	<main class="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-8">
		<div class="container mx-auto max-w-md text-center">
			<h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">{$page.status}</h1>
			<h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Error</h2>
			<p class="text-gray-600 dark:text-gray-400">
				{$page.error?.message || 'An unexpected error occurred'}
			</p>
		</div>
	</main>
{/if}