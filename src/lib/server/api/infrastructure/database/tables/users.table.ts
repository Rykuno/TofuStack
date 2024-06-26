import { relations } from 'drizzle-orm';
import { citext, timestamps } from '../utils';
import { createId } from '@paralleldrive/cuid2';
import { sessionsTable } from './sessions.table';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { emailVerificationsTable } from './email-verifications.table';

export const usersTable = pgTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	avatar: text('avatar'),
	email: citext('email').notNull().unique(),
	verified: boolean('verified').notNull().default(false),
	...timestamps
});

export const usersRelations = relations(usersTable, ({ many, one }) => ({
	sessions: many(sessionsTable),
	emailVerifications: one(emailVerificationsTable, {
		fields: [usersTable.id],
		references: [emailVerificationsTable.userId]
	})
}));
