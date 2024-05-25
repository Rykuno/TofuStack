<script>
	import { enhance } from '$app/forms';

	let { data } = $props();
</script>

<h3>Change Email</h3>
<h5>Current Email: {data.authedUser.email}</h5>
<form method="POST" action="?/updateEmail" use:enhance>
	<label for="email">Enter new email</label>
	<input name="email" type="email" />
	<button>Send Request</button>
</form>

<form method="POST" action="?/verifyEmail" use:enhance>
	<label for="token">Verify Token</label>
	<input name="token" />
	<button>Verify</button>
</form>
