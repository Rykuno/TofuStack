import { Container } from '@needle-di/core';
import { DrizzleService } from '../../databases/postgres/drizzle.service';

export abstract class DrizzleRepository {
	protected readonly drizzle: DrizzleService;
	constructor() {
		this.drizzle = new Container().get(DrizzleService);
	}
}
