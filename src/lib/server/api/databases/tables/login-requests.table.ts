import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { timestamps } from '../../common/utils/table.utils';

export const loginRequestsTable = pgTable('login_requests', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  hashedToken: text('hashed_token').notNull(),
  email: text('email').notNull().unique(),
  expiresAt: timestamp('expires_at', {
    mode: 'date',
    withTimezone: true
  }).notNull(),
  ...timestamps
});

export const loginRequestsRelations = relations(loginRequestsTable, () => ({}));
