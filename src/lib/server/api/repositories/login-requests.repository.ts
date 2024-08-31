import { inject, injectable } from "tsyringe";
import { and, eq, gte, type InferInsertModel } from "drizzle-orm";
import { loginRequestsTable } from "../databases/tables";
import type { Repository } from "../common/inferfaces/repository.interface";
import { DatabaseProvider } from "../providers/database.provider";
import { takeFirst, takeFirstOrThrow } from "../common/utils/repository.utils";


export type CreateLoginRequest = Pick<InferInsertModel<typeof loginRequestsTable>, 'email' | 'expiresAt' | 'hashedToken'>;

@injectable()
export class LoginRequestsRepository implements Repository {
  constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider) { }

  async create(data: CreateLoginRequest) {
    return this.db.insert(loginRequestsTable).values(data).onConflictDoUpdate({
      target: loginRequestsTable.email,
      set: data
    }).returning().then(takeFirstOrThrow)
  }

  async findOneByEmail(email: string) {
    return this.db.select().from(loginRequestsTable).where(
      and(
        eq(loginRequestsTable.email, email),
        gte(loginRequestsTable.expiresAt, new Date())
      )
    ).then(takeFirst)
  }

  async deleteById(id: string) {
    return this.db.delete(loginRequestsTable).where(eq(loginRequestsTable.id, id));
  }

  trxHost(trx: DatabaseProvider) {
    return new LoginRequestsRepository(trx);
  }
}