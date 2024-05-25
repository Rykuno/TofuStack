import { Lucia } from 'lucia';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Discord } from 'arctic';
import { config } from './config';
import { sessionsTable } from '../infrastructure/database/tables/sessions.table';
import { db } from '../infrastructure/database';
import { usersTable } from '../infrastructure/database/tables/users.table';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionsTable, usersTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: process.env.NODE_ENV === 'production'
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			id: attributes.id,
			avatar: attributes.avatar,
			email: attributes.email,
			verified: attributes.verified
		};
	}
});

export const discord = new Discord(
	config.DISCORD_CLIENT_ID!,
	config.DISCORD_CLIENT_SECRET!,
	'http://localhost:5173/api/iam/discord/callback'
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
