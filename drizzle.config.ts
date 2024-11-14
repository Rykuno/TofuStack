import { defineConfig } from 'drizzle-kit';

/* ------------------------------- !IMPORTANT ------------------------------- */
/* ---------------- Before running migrations or generations ---------------- */
/* ------------------ make sure to build the project first ------------------ */
/* -------------------------------------------------------------------------- */

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/server/api/databases/postgres/drizzle-schema.ts',
  breakpoints: false,
  strict: true,
  verbose: true,
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
  migrations: {
    table: 'migrations',
    schema: 'public'
  }
});
