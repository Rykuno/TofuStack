import { inject, injectable } from "tsyringe";
import { and, eq, gte, type InferInsertModel } from "drizzle-orm";
import { loginRequestsTable } from "../databases/postgres/tables";
import { takeFirst, takeFirstOrThrow } from "../common/utils/repository";
import { DrizzleService } from "../services/drizzle.service";

type Create = Pick<InferInsertModel<typeof loginRequestsTable>, 'email' | 'expiresAt' | 'hashedToken'>;

@injectable()
export class LoginRequestsRepository {
  constructor(
    @inject(DrizzleService) private readonly drizzle: DrizzleService,
  ) { }

  async create(data: Create, db = this.drizzle.db) {
    return db.insert(loginRequestsTable).values(data).onConflictDoUpdate({
      target: loginRequestsTable.email,
      set: data
    }).returning().then(takeFirstOrThrow)
  }

  async findOneByEmail(email: string, db = this.drizzle.db) {
    return db.select().from(loginRequestsTable).where(
      and(
        eq(loginRequestsTable.email, email),
        gte(loginRequestsTable.expiresAt, new Date())
      )
    ).then(takeFirst)
  }

  async deleteById(id: string, db = this.drizzle.db) {
    return db.delete(loginRequestsTable).where(eq(loginRequestsTable.id, id));
  }
}