import { bigint, pgTable, text } from "drizzle-orm/pg-core";
import { cuid2, timestamps } from "../../common/utils/table.utils";
import { createId } from "@paralleldrive/cuid2";

export const filesTable = pgTable('files', {
  id: cuid2('id').primaryKey().$defaultFn(() => createId()),
  key: text('key').notNull(),
  size: bigint('size', { mode: 'bigint' }).notNull(),
  contentType: text('content_type').notNull(),
  ...timestamps
});

