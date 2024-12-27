import { startServer } from '$lib/server/api';

export const init = async () => {
	await startServer();
};
