import Pool from 'pg-pool';
import * as drizzleSchema from './drizzle-schema';
import { inject, injectable } from '@needle-di/core';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { ConfigService } from '../../common/configs/config.service';

@injectable()
export class DrizzleService {
	public db: NodePgDatabase<typeof drizzleSchema>;
	constructor(private configService = inject(ConfigService)) {
		this.db = drizzle(
			new Pool({
				connectionString: this.configService.envs.DATABASE_URL
			})
		);
	}
}
