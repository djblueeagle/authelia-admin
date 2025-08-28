<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import type { LayoutData } from './$types';
	
	export let data: LayoutData;
	
	// Track which menu is open
	let openMenu: string | null = null;
	
	// Toggle submenu
	function toggleMenu(menu: string) {
		openMenu = openMenu === menu ? null : menu;
	}
	
	// Close menu when clicking outside
	function closeMenus() {
		openMenu = null;
	}
	
	// Menu items with sub-items
	const menuItems = [
		{
			name: 'Users',
			href: `${base}/users`,
			children: []
		},
		{
			name: 'Groups',
			href: `${base}/groups`,
			children: []
		},
		{
			name: 'TOTP',
			href: `${base}/totp`,
			children: [
				{ name: 'Configurations', href: `${base}/totp/configurations` },
				{ name: 'History', href: `${base}/totp/history` }
			]
		},
		{
			name: 'Banned',
			href: `${base}/banned`,
			children: [
				{ name: 'IP', href: `${base}/banned/ip` },
				{ name: 'Users', href: `${base}/banned/users` }
			]
		},
		{
			name: 'Notifications',
			href: `${base}/notifications`,
			children: [
				{ name: 'File', href: `${base}/notifications/file` }
			]
		}
	];
</script>

<svelte:window on:click={closeMenus} />

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Header -->
	<header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
		<div class="container mx-auto px-4">
			<div class="flex items-center justify-between h-16">
				<!-- Logo/Title -->
				<div class="flex items-center">
					<h1 class="text-xl font-bold text-gray-900 dark:text-white">
						Authelia Admin Panel
					</h1>
				</div>
				
				<!-- User info -->
				{#if data?.user}
					<div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
						<span class="mr-4">
							User: <span class="font-semibold">{data.user.username}</span>
						</span>
						<a 
							href="/logout"
							class="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
						>
							Logout
						</a>
					</div>
				{/if}
			</div>
		</div>
	</header>
	
	<!-- Navigation -->
	<nav class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
		<div class="container mx-auto px-4">
			<ul class="flex space-x-1">
				{#each menuItems as item}
					<li class="relative">
						{#if item.children.length > 0}
							<!-- Parent menu button with dropdown -->
							<button
								on:click|stopPropagation={() => toggleMenu(item.name)}
								class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors {$page.url.pathname.startsWith(item.href) ? 'bg-gray-100 dark:bg-gray-700 border-b-2 border-blue-600' : ''}"
							>
								<span>{item.name}</span>
								<svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							
							<!-- Submenu -->
							{#if openMenu === item.name}
								<div class="absolute left-0 top-full z-50 bg-white dark:bg-gray-800 shadow-lg rounded-b border border-gray-200 dark:border-gray-700 min-w-[200px]">
									<ul>
										{#each item.children as child}
											<li>
												<a
													href={child.href}
													class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors {$page.url.pathname === child.href ? 'bg-gray-100 dark:bg-gray-700' : ''}"
													on:click={() => openMenu = null}
												>
													{child.name}
												</a>
											</li>
										{/each}
									</ul>
								</div>
							{/if}
						{:else}
							<!-- Simple link without dropdown -->
							<a
								href={item.href}
								class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors {$page.url.pathname === item.href ? 'bg-gray-100 dark:bg-gray-700 border-b-2 border-blue-600' : ''}"
							>
								{item.name}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</nav>
	
	<!-- Main content -->
	<main class="container mx-auto px-4 py-8">
		<slot />
	</main>
</div>