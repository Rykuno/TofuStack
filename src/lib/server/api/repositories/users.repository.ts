import { inject, injectable } from 'tsyringe';
import { usersTable } from '../databases/tables';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { DatabaseProvider } from '../providers/database.provider';
import { takeFirstOrThrow } from '../common/utils/repository.utils';
import type { Repository } from '../common/inferfaces/repository.interface';

export type CreateUser = InferInsertModel<typeof usersTable>;
export type UpdateUser = Partial<CreateUser>;

@injectable()
export class UsersRepository implements Repository {
	constructor(@inject(DatabaseProvider) private db: DatabaseProvider) { }

	async findOneById(id: string) {
		return this.db.query.usersTable.findFirst({
			where: eq(usersTable.id, id)
		});
	}

	async findOneByIdOrThrow(id: string) {
		const user = await this.findOneById(id);
		if (!user) throw Error('User not found');
		return user;
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
