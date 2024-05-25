import { HTTPException } from 'hono/http-exception';
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

export const takeFirst = <T>(values: T[]): T | null => {
	if (values.length === 0) return null;
	return values[0]!;
};

export const takeFirstOrThrow = <T>(values: T[]): T => {
	if (values.length === 0)
		throw new HTTPException(404, {
			message: 'Resource not found'
		});
	return values[0]!;
};

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
