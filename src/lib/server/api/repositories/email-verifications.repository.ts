import { inject, injectable } from "tsyringe";
import { and, eq, gte, type InferInsertModel } from "drizzle-orm";
import { emailVerificationsTable } from "../databases/postgres/tables";
import { takeFirst, takeFirstOrThrow } from "../common/utils/repository";
import { DrizzleService } from "../services/drizzle.service";

type Create = Pick<InferInsertModel<typeof emailVerificationsTable>, 'requestedEmail' | 'hashedToken' | 'userId' | 'expiresAt'>;

@injectable()
export class EmailVerificationsRepository {
  constructor(@inject(DrizzleService) private readonly drizzle: DrizzleService) { }

  // creates a new email verification record or updates an existing one
  async create(data: Create) {
    return this.drizzle.db.insert(emailVerificationsTable).values(data).onConflictDoUpdate({
      target: emailVerificationsTable.userId,
      set: data
    }).returning().then(takeFirstOrThrow)
  }

  // finds a valid record by token and userId
  async findValidRecord(userId: string, db = this.drizzle.db) {
    return db.select().from(emailVerificationsTable).where(
      and(
        eq(emailVerificationsTable.userId, userId),
        gte(emailVerificationsTable.expiresAt, new Date())
      )).then(takeFirst)
  }

  async deleteById(id: string, db = this.drizzle.db) {
    return db.delete(emailVerificationsTable).where(eq(emailVerificationsTable.id, id))
  }


}