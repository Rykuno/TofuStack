import { inject, injectable } from 'tsyringe';
import { TokensRepository } from '../repositories/tokens.repository';
import dayjs from 'dayjs';
import { DatabaseProvider } from '../providers';
import { generateRandomString, alphabet } from "oslo/crypto";

/* -------------------------------------------------------------------------- */
/*                                   Service                                  */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* ---------------------------------- About --------------------------------- */
/*
Services are responsible for handling business logic and data manipulation. 
They genreally call on repositories or other services to complete a use-case.
*/
/* ---------------------------------- Notes --------------------------------- */
/*
Services should be kept as clean and simple as possible. 

Create private functions to handle complex logic and keep the public methods as 
simple as possible. This makes the service easier to read, test and understand.
*/
/* -------------------------------------------------------------------------- */

@injectable()
export class TokensService {
	constructor(
		@inject(TokensRepository) private tokensRepository: TokensRepository,
		@inject(DatabaseProvider) private db: DatabaseProvider
	) { }

	async create(userId: string, email: string) {
		return this.tokensRepository.create({
			userId,
			email,
			token: this.generateToken(),
			expiresAt: dayjs().add(15, 'minutes').toDate()
		});
	}

	async validateToken(userId: string, token: string) {
		const foundToken = await this.db.transaction(async (trx) => {
			const foundToken = await this.tokensRepository.trxHost(trx).findOneByToken(token);
			foundToken && (await this.tokensRepository.trxHost(trx).delete(foundToken.id));
			return foundToken;
		});

		if (!foundToken) {
			return false;
		}

		if (foundToken.userId !== userId) {
			return false;
		}

		if (foundToken.expiresAt < new Date()) {
			return false;
		}

		return foundToken;
	}

	generateToken() {
		const alphabet = '23456789ACDEFGHJKLMNPQRSTUVWXYZ'; // alphabet with removed look-alike characters (0, 1, O, I)
		return generateRandomString(6, alphabet);
	}
}
