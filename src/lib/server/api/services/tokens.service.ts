import { inject, injectable } from 'tsyringe';
import { TokensRepository } from '../repositories/tokens.repository';
import dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';
import { DatabaseProvider } from '../providers';

@injectable()
export class TokensService {
	constructor(
		@inject(TokensRepository) private tokensRepository: TokensRepository,
		@inject(DatabaseProvider) private db: DatabaseProvider
	) {}

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

	private generateToken() {
		const tokenAlphabet = '123456789ACDEFGHJKLMNPQRSTUVWXYZ'; // O and I removed for readability
		return customAlphabet(tokenAlphabet, 6)();
	}
}
