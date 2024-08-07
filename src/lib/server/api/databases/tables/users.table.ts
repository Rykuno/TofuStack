import { relations } from 'drizzle-orm';;
import { createId } from '@paralleldrive/cuid2';
import { sessionsTable } from './sessions.table';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { emailVerificationsTable } from './email-verifications.table';
import { citext, cuid2, timestamps } from '../../common/utils/table.utils';
import { filesTable } from './files.table';


export const usersTable = pgTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => createId()),
	avatarId: cuid2('avatar').references(() => filesTable.id),
	email: citext('email').notNull().unique(),
	verified: boolean('verified').notNull().default(false),
	...timestamps
});

export const usersRelations = relations(usersTable, ({ many, one }) => ({
	sessions: many(sessionsTable),
	avatar: one(filesTable, {
		fields: [usersTable.avatarId],
		references: [filesTable.id]
	}),
	emailVerifications: one(emailVerificationsTable, {
		fields: [usersTable.id],
		references: [emailVerificationsTable.userId]
	})
}));
