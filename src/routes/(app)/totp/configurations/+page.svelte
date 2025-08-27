<script lang="ts">
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { base } from '$app/paths';
	
	export let data: PageData;
	
	let deletingId: number | null = null;
	
	function formatDate(dateString: string | null): string {
		if (!dateString) return 'Never';
		const date = new Date(dateString);
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	}
	
	function getStatus(lastUsedAt: string | null): { text: string; class: string } {
		if (!lastUsedAt) {
			return { text: 'Unused', class: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
		}
		const lastUsed = new Date(lastUsedAt);
		const now = new Date();
		const daysSinceUse = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
		
		if (daysSinceUse < 7) {
			return { text: 'Active', class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
		} else if (daysSinceUse < 30) {
			return { text: 'Recent', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
		} else {
			return { text: 'Inactive', class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' };
		}
	}
	
	function confirmDelete(id: number, username: string) {
		if (confirm(`Are you sure you want to delete TOTP configuration for user "${username}"?`)) {
			deletingId = id;
			return true;
		}
		return false;
	}
</script>

<div class="space-y-6">
	{#if data.error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4">
			<p class="text-red-800 font-semibold">Error</p>
			<p class="text-red-600">{data.error}</p>
		</div>
	{/if}
	
	{#if data.storageType && data.storageType !== 'sqlite'}
		<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
			<p class="text-yellow-800 font-semibold">Storage Type Not Supported</p>
			<p class="text-yellow-600">Current storage type: {data.storageType}. Only SQLite is currently supported.</p>
		</div>
	{/if}
	
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow">
		<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white">
				TOTP Configurations
			</h2>
			<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
				{#if data.dbPath}
					Database: {data.dbPath}
				{:else}
					Manage two-factor authentication configurations for users
				{/if}
			</p>
		</div>
		
		<div class="p-6">
			{#if data.configurations && data.configurations.length > 0}
				<!-- Table -->
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Username
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Issuer
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Algorithm
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Digits / Period
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Created
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Last Used
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Status
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{#each data.configurations as config}
								{@const status = getStatus(config.last_used_at)}
								<tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
										{config.username}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
										{config.issuer || 'Authelia'}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
										{config.algorithm}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
										{config.digits} digits / {config.period}s
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
										{formatDate(config.created_at)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
										{formatDate(config.last_used_at)}
									</td>
									<td class="px-6 py-4 whitespace-nowrap">
										<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {status.class}">
											{status.text}
										</span>
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-right">
										<form
											method="POST"
											action="{base}/totp/configurations?/delete"
											on:submit|preventDefault={(e) => {
												if (confirmDelete(config.id, config.username)) {
													e.currentTarget.submit();
												}
											}}
											use:enhance={() => {
												deletingId = config.id;
												return async ({ update }) => {
													deletingId = null;
													await update();
												};
											}}
											class="inline"
										>
											<input type="hidden" name="id" value={config.id} />
											<input type="hidden" name="username" value={config.username} />
											<button
												type="submit"
												disabled={deletingId === config.id}
												class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
											>
												{deletingId === config.id ? 'Deleting...' : 'Delete'}
											</button>
										</form>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else if !data.error}
				<div class="text-center py-8 text-gray-500 dark:text-gray-400">
					No TOTP configurations found in the database.
				</div>
			{/if}
		</div>
	</div>
</div>