import { inject, injectable } from 'tsyringe';
import { DatabaseProvider } from '../providers';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { tokensTable } from '../infrastructure/database/tables';
import { takeFirstOrThrow } from '../infrastructure/database/utils';
import type { Repository } from '../interfaces/repository.interface';

/* -------------------------------------------------------------------------- */
/*                                 Repository                                 */
/* -------------------------------------------------------------------------- */
/* ---------------------------------- About --------------------------------- */
/*
Repositories are the layer that interacts with the database. They are responsible for retrieving and 
storing data. They should not contain any business logic, only database queries.
*/
/* ---------------------------------- Notes --------------------------------- */
/*
 Repositories should only contain methods for CRUD operations and any other database interactions. 
 Any complex logic should be delegated to a service. If a repository method requires a transaction,
 it should be passed in as an argument or the class should have a method to set the transaction.
 In our case the method 'trxHost' is used to set the transaction context.
*/

export type InsertToken = InferInsertModel<typeof tokensTable>;

@injectable()
export class TokensRepository implements Repository {
	constructor(@inject(DatabaseProvider) private db: DatabaseProvider) {}

	async findOneByToken(token: string) {
		return this.db.query.tokensTable.findFirst({ where: eq(tokensTable.token, token) });
	}

	async delete(id: string) {
		return this.db
			.delete(tokensTable)
			.where(eq(tokensTable.id, id))
			.returning()
			.then(takeFirstOrThrow);
	}

	async create(data: InsertToken) {
		return this.db.insert(tokensTable).values(data).returning().then(takeFirstOrThrow);
	}

	trxHost(trx: DatabaseProvider) {
		return new TokensRepository(trx);
	}
}
