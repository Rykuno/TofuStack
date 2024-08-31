import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../databases/tables';
import { env } from '../configs/envs.config';

const client = postgres(env.DATABASE_URL!, { max: 1 });
export const db = drizzle(client, { schema });