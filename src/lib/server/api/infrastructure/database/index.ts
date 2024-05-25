import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../../common/config';
import * as schema from './tables';

export const client = postgres(config.DATABASE_URL!, { max: 1 });
export const db = drizzle(client, { schema });
