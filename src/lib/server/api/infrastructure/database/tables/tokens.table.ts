import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { timestamps } from '../utils';
import { relations } from 'drizzle-orm';
import { usersTable } from './users.table';

export const tokensTable = pgTable('tokens', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	token: text('token').notNull().unique(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	email: text('email').notNull(),
	expiresAt: timestamp('expires_at', {
		mode: 'date',
		withTimezone: true
	}).notNull(),
	...timestamps
});

export const tokensRealations = relations(tokensTable, ({ one }) => ({
	user: one(usersTable)
}));
