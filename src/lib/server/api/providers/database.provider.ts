import { container } from 'tsyringe';
import { db } from '../packages/drizzle';

export const DatabaseProvider = Symbol('DATABASE_TOKEN');
export type DatabaseProvider = typeof db;
container.register<DatabaseProvider>(DatabaseProvider, { useValue: db });
