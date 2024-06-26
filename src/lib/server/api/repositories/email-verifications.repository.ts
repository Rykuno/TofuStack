import { inject, injectable } from "tsyringe";
import { DatabaseProvider } from "../providers";
import { and, eq, lte, type InferInsertModel } from "drizzle-orm";
import type { Repository } from "../interfaces/repository.interface";
import { takeFirst, takeFirstOrThrow } from "../infrastructure/database/utils";
import { emailVerificationsTable } from "../infrastructure/database/tables/email-verifications.table";

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
        lte(emailVerificationsTable.expiresAt, new Date())
      )).then(takeFirst)
  }

  async deleteById(id: string) {
    return this.db.delete(emailVerificationsTable).where(eq(emailVerificationsTable.id, id))
  }

  trxHost(trx: DatabaseProvider) {
    return new EmailVerificationsRepository(trx)
  }
}