import type { Config } from 'drizzle-kit';

export default {
	out: './src/lib/server/api/infrastructure/database/migrations',
	schema: './src/lib/server/api/infrastructure/database/tables/*.table.ts',
	breakpoints: false,
	strict: true,
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.DATABASE_URL!
	},
	migrations: {
		table: 'migrations',
		schema: 'public'
	}
} satisfies Config;
