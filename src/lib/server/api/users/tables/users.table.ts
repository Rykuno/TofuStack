import { pgTable, text } from 'drizzle-orm/pg-core';
import { getTableColumns, type InferSelectModel, relations } from 'drizzle-orm';
import { citext, id, timestamps } from '../../common/utils/drizzle';
import { generateId } from '../../common/utils/crypto';

/* -------------------------------------------------------------------------- */
/*                                    Table                                   */
/* -------------------------------------------------------------------------- */
export const usersTable = pgTable('users', {
	id: id()
		.primaryKey()
		.$defaultFn(() => generateId()),
	email: citext().unique().notNull(),
	avatar: text(),
	...timestamps
});

/* -------------------------------------------------------------------------- */
/*                                  Relations                                 */
/* -------------------------------------------------------------------------- */
export const usersRelations = relations(usersTable, () => ({}));

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export type User = InferSelectModel<typeof usersTable>;
export type UserWithRelations = User & {};

const userColumns = getTableColumns(usersTable);

export const publicUserColumns = {
	id: userColumns.id,
	email: userColumns.email,
	avatar: userColumns.avatar,
	...timestamps
};
