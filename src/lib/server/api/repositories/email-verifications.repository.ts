import { inject, injectable } from "tsyringe";
import { and, eq, gte, lte, type InferInsertModel } from "drizzle-orm";
import { emailVerificationsTable } from "../databases/tables";
import type { Repository } from "../common/inferfaces/repository.interface";
import { DatabaseProvider } from "../providers/database.provider";
import { takeFirst, takeFirstOrThrow } from "../common/utils/repository.utils";


export type CreateEmailVerification = Pick<InferInsertModel<typeof emailVerificationsTable>, 'requestedEmail' | 'hashedToken' | 'userId' | 'expiresAt'>;

@injectable()
export class EmailVerificationsRepository implements Repository {
  constructor(@inject(DatabaseProvider) private readonly db: DatabaseProvider) { }

  // creates a new email verification record or updates an existing one
  async create(data: CreateEmailVerification) {
    return this.db.insert(emailVerificationsTable).values(data).onConflictDoUpdate({
      target: emailVerificationsTable.userId,
      set: data
    }).returning().then(takeFirstOrThrow)
  }

  // finds a valid record by token and userId
  async findValidRecord(userId: string) {
    return this.db.select().from(emailVerificationsTable).where(
      and(
        eq(emailVerificationsTable.userId, userId),
        gte(emailVerificationsTable.expiresAt, new Date())
      )).then(takeFirst)
  }

  async deleteById(id: string) {
    return this.db.delete(emailVerificationsTable).where(eq(emailVerificationsTable.id, id))
  }

  trxHost(trx: DatabaseProvider) {
    return new EmailVerificationsRepository(trx)
  }
}