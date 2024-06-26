import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { timestamps } from '../utils';
import { relations } from 'drizzle-orm';
import { usersTable } from './users.table';

export const emailVerificationsTable = pgTable('email_verifications', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  hashedToken: text('hashed_token').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => usersTable.id).unique(),
  requestedEmail: text('requested_email').notNull(),
  expiresAt: timestamp('expires_at', {
    mode: 'date',
    withTimezone: true
  }).notNull(),
  ...timestamps
});

export const emailVerificationsRelations = relations(emailVerificationsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [emailVerificationsTable.userId],
    references: [usersTable.id]
  })
}));
