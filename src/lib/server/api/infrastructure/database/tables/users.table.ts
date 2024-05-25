import cuid2, { createId } from '@paralleldrive/cuid2';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { citext, timestamps } from '../utils';
import { relations } from 'drizzle-orm';
import { sessionsTable } from './sessions.table';
import { tokensTable } from './tokens.table';

export const usersTable = pgTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	avatar: text('avatar'),
	email: citext('email').notNull().unique(),
	verified: boolean('verified').notNull().default(false),
	...timestamps
});

export const usersRelations = relations(usersTable, ({ many }) => ({
	sessions: many(sessionsTable),
	tokens: many(tokensTable)
}));
