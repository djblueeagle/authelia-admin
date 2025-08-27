<script lang="ts">
	import type { PageData } from './$types';
	
	export let data: PageData;
	
	function formatDate(dateString: string | undefined): string {
		if (!dateString) return 'N/A';
		try {
			// Handle ISO 8601 format: 2025-08-27T09:05:22.403314637+00:00
			const date = new Date(dateString);
			if (isNaN(date.getTime())) {
				return 'Invalid date';
			}
			// Format as YYYY-MM-DD HH:mm:ss in 24h format
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');
			const hours = String(date.getHours()).padStart(2, '0');
			const minutes = String(date.getMinutes()).padStart(2, '0');
			const seconds = String(date.getSeconds()).padStart(2, '0');
			
			return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
		} catch {
			return dateString;
		}
	}
	
	
	function extractUsername(dn: string): string {
		// Extract UID from DN string like "uid=admin,ou=people,dc=localhost,dc=test"
		const match = dn.match(/uid=([^,]+)/i);
		return match ? match[1] : dn;
	}
</script>

<div class="space-y-6">
	{#if data.error}
		<div class="bg-red-50 border border-red-200 rounded-lg p-4">
			<p class="text-red-800 font-semibold">Error</p>
			<p class="text-red-600">{data.error}</p>
		</div>
	{/if}
	
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow">
		<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
			<h2 class="text-xl font-bold text-gray-900 dark:text-white">
				LDAP Groups
			</h2>
			<p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
				{#if data.ldapServer}
					Server: {data.ldapServer}
				{:else}
					Groups from LDAP directory
				{/if}
			</p>
		</div>
		
		<div class="p-6">
			{#if data.groups && data.groups.length > 0}
				<!-- Table -->
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead class="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Group Name
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Description
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Members
								</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
									Creation Date
								</th>
							</tr>
						</thead>
						<tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{#each data.groups as group}
								<tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
									<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
										{group.cn}
									</td>
									<td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
										{group.description || '-'}
									</td>
									<td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
										{#if group.member && group.member.length > 0}
											<div class="space-y-1">
												<div class="font-medium">{group.member.length} member{group.member.length !== 1 ? 's' : ''}</div>
												<details class="cursor-pointer">
													<summary class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
														Show members
													</summary>
													<div class="mt-2 flex flex-wrap gap-1">
														{#each group.member as member}
															<span class="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded">
																{extractUsername(member)}
															</span>
														{/each}
													</div>
												</details>
											</div>
										{:else}
											<span class="text-gray-500">No members</span>
										{/if}
									</td>
									<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
										{formatDate(group.createTimestamp)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				
				<div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
					Total groups: {data.groups.length}
				</div>
			{:else if !data.error}
				<div class="text-center py-8 text-gray-500 dark:text-gray-400">
					No groups found in LDAP directory.
				</div>
			{/if}
		</div>
	</div>
</div>