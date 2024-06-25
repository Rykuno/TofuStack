import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Discord } from 'arctic';
import { sessionsTable, usersTable } from '../database/tables';
import { db } from '../database';
import { config } from '../../common/config';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: config.isProduction
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			...attributes
		};
	}
});

export const discord = new Discord(
	config.DISCORD_CLIENT_ID!,
	config.DISCORD_CLIENT_SECRET!,
	`${config.ORIGIN}/api/iam/discord/callback`
);

interface DatabaseUserAttributes {
	id: string;
	email: string;
	avatar: string | null;
	verified: boolean;
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}
