<script lang="ts">
	import Menu from 'lucide-svelte/icons/menu';
	import Package2 from 'lucide-svelte/icons/package-2';
	import Search from 'lucide-svelte/icons/search';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { createMutation } from '@tanstack/svelte-query';
	import { authContext } from '$lib/hooks/session.svelte.js';
	import { queryHandler } from '$lib/tanstack-query/index.js';
	import { goto, invalidateAll } from '$app/navigation';
	import UserAvatar from '$lib/components/user-avatar.svelte';
	import ThemeDropdown from '$lib/components/theme-dropdown.svelte';

	const { children, data } = $props();

	$effect.pre(() => {
		authContext.setAuthedUser(data.authedUser);
	});

	const logoutMutation = createMutation({
		...queryHandler().iam.logout(),
		onSuccess: async () => {
			await data.queryClient.invalidateQueries();
			invalidateAll();
			goto('/login');
		}
	});
	queryHandler;
</script>

<div class="flex min-h-screen w-full flex-col">
	<header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
		<nav
			class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
		>
			<a href="##" class="flex items-center gap-2 text-lg font-semibold md:text-base">
				<Package2 class="h-6 w-6" />
				<span class="sr-only">Acme Inc</span>
			</a>
			<a href="##" class="text-foreground transition-colors hover:text-foreground"> Dashboard </a>
			<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
				Orders
			</a>
			<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
				Products
			</a>
			<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
				Customers
			</a>
			<a href="##" class="text-muted-foreground transition-colors hover:text-foreground">
				Analytics
			</a>
		</nav>
		<Sheet.Root>
			<Sheet.Trigger>
				<Button variant="outline" size="icon" class="shrink-0 md:hidden">
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
					<a href="##" class="hover:text-foreground"> Dashboard </a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Orders </a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Products </a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Customers </a>
					<a href="##" class="text-muted-foreground hover:text-foreground"> Analytics </a>
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
			<ThemeDropdown />
			{#if !!data.authedUser}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Button variant="secondary" size="icon" class="rounded-lg">
							<UserAvatar class="h-8 w-8 rounded-lg" user={data.authedUser} />
							<span class="sr-only">Toggle user menu</span>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<a class="w-full" href="/settings">Settings</a>
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item onclick={$logoutMutation.mutate}>Logout</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
		</div>
	</header>
	<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
		{@render children()}
	</main>
</div>
