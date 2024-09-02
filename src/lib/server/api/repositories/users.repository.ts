import { inject, injectable } from 'tsyringe';
import { usersTable } from '../databases/postgres/tables';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { takeFirstOrThrow } from '../common/utils/repository';
import type { Repository } from '../common/inferfaces/repository.interface';
import { DrizzleService } from '../services/drizzle.service';

export type CreateUser = InferInsertModel<typeof usersTable>;
export type UpdateUser = Partial<CreateUser>;

@injectable()
export class UsersRepository {
	constructor(@inject(DrizzleService) private drizzle: DrizzleService) { }

	async findOneById(id: string, db = this.drizzle.db) {
		return db.query.usersTable.findFirst({
			where: eq(usersTable.id, id)
		});
	}

	async findOneByIdOrThrow(id: string, db = this.drizzle.db) {
		const user = await this.findOneById(id, db);
		if (!user) throw Error('User not found');
		return user;
	}

	async findOneByEmail(email: string, db = this.drizzle.db) {
		return db.query.usersTable.findFirst({
			where: eq(usersTable.email, email)
		});
	}

	async create(data: CreateUser, db = this.drizzle.db) {
		return db.insert(usersTable).values(data).returning().then(takeFirstOrThrow);
	}

	async update(id: string, data: UpdateUser, db = this.drizzle.db) {
		return db
			.update(usersTable)
			.set(data)
			.where(eq(usersTable.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}
}
