<script>
	import { enhance } from '$app/forms';
</script>

<h3>Register</h3>
<form action="?/register" method="POST" use:enhance>
	<label for="email">Email</label>
	<input name="email" type="email" />
	<button type="submit">Register</button>
</form>

<h3>Verify</h3>
<form action="?/signin" method="POST" use:enhance>
	<label for="email">Email</label>
	<input name="email" type="email" />
	<label for="token">Token</label>
	<input name="token" type="text" />
	<button type="submit">Login</button>
</form>
