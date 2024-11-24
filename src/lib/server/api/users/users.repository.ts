import { injectable } from '@needle-di/core';
import { takeFirst, takeFirstOrThrow } from '../common/utils/drizzle';
import { usersTable } from './tables/users.table';
import { eq, type InferSelectModel } from 'drizzle-orm';
import { NotFound } from '../common/utils/exceptions';
import { DrizzleRepository } from '../common/factories/drizzle-repository.factory';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
type Create = Pick<InferSelectModel<typeof usersTable>, 'avatar' | 'email'>;
type Update = Partial<Create>;

/* -------------------------------------------------------------------------- */
/*                                 Repository                                 */
/* -------------------------------------------------------------------------- */
@injectable()
export class UsersRepository extends DrizzleRepository {
	async findOneById(id: string, db = this.drizzle.db) {
		return db.select().from(usersTable).where(eq(usersTable.id, id)).then(takeFirst);
	}

	async findOneByEmail(email: string, db = this.drizzle.db) {
		return db.select().from(usersTable).where(eq(usersTable.email, email)).then(takeFirst);
	}

	async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
		const user = await this.findOneById(id, db);
		if (!user) throw NotFound('User not found');
		return user;
	}

	async update(id: string, data: Update, db = this.drizzle.db) {
		return db.update(usersTable).set(data).where(eq(usersTable.id, id)).returning();
	}

	async create(data: Create, db = this.drizzle.db) {
		return db.insert(usersTable).values(data).returning().then(takeFirstOrThrow);
	}
}
