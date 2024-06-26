<script lang="ts">
	import CircleUser from 'lucide-svelte/icons/circle-user';
	import Menu from 'lucide-svelte/icons/menu';
	import Package2 from 'lucide-svelte/icons/package-2';
	import Search from 'lucide-svelte/icons/search';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { cn } from '$lib/utils/ui';
	import HouseIcon from 'lucide-svelte/icons/house';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	let { children, data } = $props();

	const routes = [
		{
			href: '/',
			label: 'Home'
		},
		{
			href: '/docs',
			label: 'Docs'
		}
	];
</script>

<div class="flex min-h-screen w-full flex-col">
	<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<a href="/" class="flex items-center gap-2 text-lg font-semibold md:text-base">
				<HouseIcon class="h-6 w-6" />
				<span class="sr-only">Acme Inc</span>
			</a>
			{#each routes as route}
				<a
					href={route.href}
					class={cn(
						'text-muted-foreground transition-colors hover:text-foreground',
						$page.url.pathname === route.href &&
							'text-foreground transition-colors hover:text-foreground'
					)}
				>
					{route.label}
				</a>
			{/each}
		</nav>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button variant="outline" size="icon" class="shrink-0 md:hidden" builders={[builder]}>
					<Menu class="h-5 w-5" />
					<span class="sr-only">Toggle navigation menu</span>
				</Button>
			</Sheet.Trigger>
			<Sheet.Content side="left">
				<nav class="grid gap-6 text-lg font-medium">
					<a href="##" class="flex items-center gap-2 text-lg font-semibold">
						<Package2 class="h-6 w-6" />
						<span class="sr-only">Acme Inc</span>
					</a>
					{#each routes as route}
						<a
							href={route.href}
							class={cn(
								'text-muted-foreground hover:text-foreground',
								$page.url.pathname.startsWith(route.href) && 'hover:text-foreground'
							)}
						>
							{route.label}
						</a>
					{/each}
				</nav>
			</Sheet.Content>
		</Sheet.Root>
		<div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<form class="ml-auto flex-1 sm:flex-initial">
				<div class="relative">
					<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						type="search"
						placeholder="Search products..."
						class="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
					/>
				</div>
			</form>
			{#if data.authedUser}
				{@render userDropdown()}
			{:else}
				<Button href="/register">Login</Button>
			{/if}
		</div>
	</header>
	<main
		class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10"
	>
		{@render children()}
	</main>
</div>

{#snippet userDropdown()}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button builders={[builder]} variant="secondary" size="icon" class="rounded-full">
				<CircleUser class="h-5 w-5" />
				<span class="sr-only">Toggle user menu</span>
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content align="end">
			<DropdownMenu.Item href="/settings">Settings</DropdownMenu.Item>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<form action="/?/logout" method="POST" use:enhance class="w-full">
					<button class="w-full cursor-default text-start" type="submit">Logout</button>
				</form></DropdownMenu.Item
			>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
