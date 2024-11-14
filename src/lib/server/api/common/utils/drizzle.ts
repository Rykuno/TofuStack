import { customType, timestamp } from 'drizzle-orm/pg-core';
import { NotFound } from './exceptions';

/* -------------------------------------------------------------------------- */
/*                                 Repository                                 */
/* -------------------------------------------------------------------------- */

// get the first element of an array or return null
export const takeFirst = <T>(values: T[]): T | null => {
  return values.shift() || null;
};

// get the first element of an array or throw a 404 error
export const takeFirstOrThrow = <T>(values: T[]): T => {
  const value = values.shift();
  if (!value) throw NotFound('The requested resource was not found.');
  return value;
};

/* -------------------------------------------------------------------------- */
/*                                   Tables                                   */
/* -------------------------------------------------------------------------- */

// custom type for citext
export const citext = customType<{ data: string }>({
  dataType() {
    return 'citext';
  }
});

// custom type for generating an id
export const id = customType<{ data: string }>({
  dataType() {
    return 'text';
  }
});

// timestamps for created_at and updated_at
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
    .$onUpdateFn(() => new Date())
};
