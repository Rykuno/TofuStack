import { cuid2 } from '../../../common/utils/table';
import { usersTable } from './users.table';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const sessionsTable = pgTable('sessions', {
	id: cuid2('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => usersTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});
