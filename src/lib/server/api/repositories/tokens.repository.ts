import { inject, injectable } from 'tsyringe';
import { DatabaseProvider } from '../providers';
import { eq, type InferInsertModel } from 'drizzle-orm';
import { tokensTable } from '../infrastructure/database/tables';
import { takeFirstOrThrow } from '../infrastructure/database/utils';
import type { Repository } from '../interfaces/repository.interface';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export type InsertToken = InferInsertModel<typeof tokensTable>;

/* -------------------------------------------------------------------------- */
/*                                 Repository                                 */
/* -------------------------------------------------------------------------- */
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
