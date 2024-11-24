<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	interface Props extends HTMLAttributes<HTMLImageElement> {
		user: {
			id: string;
			avatar: string | null;
		};
	}
</script>

<script lang="ts">
	import { createAvatar } from '@dicebear/core';
	import { funEmoji } from '@dicebear/collection';

	const { user, ...props }: Props = $props();
	const avatar =
		user.avatar ||
		createAvatar(funEmoji, {
			seed: user.id
		}).toDataUri();
</script>

<img {...props} src={avatar} />
