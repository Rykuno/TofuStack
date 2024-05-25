import type { DatabaseProvider } from '../providers';

export interface Repository {
	trxHost(trx: DatabaseProvider): any;
}
