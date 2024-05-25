import { inject, injectable } from 'tsyringe';
import type { Repository } from '../interfaces/repository.interface';
import { DatabaseProvider, type DatabaseProvider } from '../providers';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { usersTable } from '../infrastructure/database/tables/users.table';
import { takeFirstOrThrow } from '../infrastructure/database/utils';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export type CreateUser = Pick<InferInsertModel<typeof usersTable>, 'avatar' | 'email' | 'verified'>;
export type UpdateUser = Partial<CreateUser>;

/* -------------------------------------------------------------------------- */
/*                                 Repository                                 */
/* -------------------------------------------------------------------------- */
@injectable()
export class UsersRepository implements Repository {
	constructor(@inject(DatabaseProvider) private db: DatabaseProvider) {}

	async findOneById(id: string) {
		return this.db.query.usersTable.findFirst({
			where: eq(usersTable.id, id)
		});
	}

	async findOneByEmail(email: string) {
		return this.db.query.usersTable.findFirst({
			where: eq(usersTable.email, email)
		});
	}

	async create(data: CreateUser) {
		return this.db.insert(usersTable).values(data).returning().then(takeFirstOrThrow);
	}

	async update(id: string, data: UpdateUser) {
		return this.db
			.update(usersTable)
			.set(data)
			.where(eq(usersTable.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}

	trxHost(trx: DatabaseProvider) {
		return new UsersRepository(trx);
	}
}
