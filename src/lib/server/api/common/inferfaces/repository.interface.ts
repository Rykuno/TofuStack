import type { DatabaseProvider } from "../../providers/database.provider";

export interface Repository {
	trxHost(trx: DatabaseProvider): any;
}
