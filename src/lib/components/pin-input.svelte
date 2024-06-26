<script lang="ts">
	import { cn } from '$lib/utils/ui';
	import { PinInput, type PinInputProps } from 'bits-ui';

	interface Props extends Omit<PinInputProps, 'value'> {
		value: string;
		inputCount?: number;
	}

	let { value = $bindable(), inputCount = 6, ...rest }: Props = $props();
	let pin = $state<string[] | undefined>(value?.split('') ?? []);
	let inputs = $derived(Array(inputCount).fill(null));

	$effect(() => {
		value = pin?.join('') ?? '';
	});
</script>

<PinInput.Root
	{...rest}
	bind:value={pin}
	class={cn('flex items-center gap-2', rest.class)}
	type="text"
	placeholder=""
>
	{#each inputs as _}
		<PinInput.Input
			class="flex h-14 w-10 rounded-md border border-input bg-background px-3 py-2 text-center text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
		/>
	{/each}
	<PinInput.HiddenInput />
</PinInput.Root>
