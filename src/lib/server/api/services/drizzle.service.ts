import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { injectable, type Disposable } from "tsyringe";
import { config } from "../common/config";
import * as schema from '../databases/postgres/tables';

@injectable()
export class DrizzleService implements Disposable {
  protected readonly client: postgres.Sql<{}>
  readonly db: PostgresJsDatabase<typeof schema>
  readonly schema: typeof schema = schema;

  constructor() {
    const client = postgres(config.postgres.url, { max: 1 })
    this.client = client;
    this.db = drizzle(client, { schema })
  }

  dispose(): Promise<void> | void {
    this.client.end();
  }
}