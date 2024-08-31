import { timestamp } from 'drizzle-orm/pg-core';
import { customType } from 'drizzle-orm/pg-core';

export const citext = customType<{ data: string }>({
  dataType() {
    return 'citext';
  }
});

export const cuid2 = customType<{ data: string }>({
  dataType() {
    return 'text';
  }
});

export const timestamps = {
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true
  })
    .notNull()
    .defaultNow()
};
