import { inject, injectable } from 'tsyringe';
import { MailerService } from './mailer.service';
import { TokensService } from './tokens.service';
import { UsersRepository } from '../repositories/users.repository';
import type { VerifyLoginDto } from '../dtos/verify-login.dto';
import type { LoginDto } from '../dtos/login.dto';
import { LoginRequestsRepository } from '../repositories/login-requests.repository';
import { LoginVerificationEmail } from '../emails/login-verification.email';
import { BadRequest } from '../common/exceptions';
import { WelcomeEmail } from '../emails/welcome.email';
import { DrizzleService } from './drizzle.service';
import { LuciaService } from './lucia.service';

@injectable()
export class AuthenticationService {
	constructor(
		@inject(LuciaService) private readonly luciaService: LuciaService,
		@inject(DrizzleService) private readonly drizzleService: DrizzleService,
		@inject(TokensService) private readonly tokensService: TokensService,
		@inject(MailerService) private readonly mailerService: MailerService,
		@inject(UsersRepository) private readonly usersRepository: UsersRepository,
		@inject(LoginRequestsRepository) private readonly loginRequestsRepository: LoginRequestsRepository,
	) { }

	async createLoginRequest(data: LoginDto) {
		// generate a token, expiry date, and hash
		const { token, expiry, hashedToken } = await this.tokensService.generateTokenWithExpiryAndHash(15, 'm');
		// save the login request to the database - ensuring we save the hashedToken
		await this.loginRequestsRepository.create({ email: data.email, hashedToken, expiresAt: expiry });
		// send the login request email
		await this.mailerService.send({ email: new LoginVerificationEmail(token), to: data.email });
	}

	async verifyLoginRequest(data: VerifyLoginDto) {
		const validLoginRequest = await this.getValidLoginRequest(data.email, data.token);
		if (!validLoginRequest) throw BadRequest('Invalid token');

		let existingUser = await this.usersRepository.findOneByEmail(data.email);

		if (!existingUser) {
			const newUser = await this.handleNewUserRegistration(data.email);
			return this.luciaService.lucia.createSession(newUser.id, {});
		}

		return this.luciaService.lucia.createSession(existingUser.id, {});
	}

	async logout(sessionId: string) {
		return this.luciaService.lucia.invalidateSession(sessionId);
	}

	// Create a new user and send a welcome email - or other onboarding process
	private async handleNewUserRegistration(email: string) {
		const newUser = await this.usersRepository.create({ email, verified: true })
		await this.mailerService.send({ email: new WelcomeEmail(), to: newUser.email });
		// TODO: add whatever onboarding process or extra data you need here
		return newUser
	}

	// Fetch a valid request from the database, verify the token and burn the request if it is valid
	private async getValidLoginRequest(email: string, token: string) {
		return await this.drizzleService.db.transaction(async (trx) => {
			// fetch the login request
			const loginRequest = await this.loginRequestsRepository.findOneByEmail(email, trx)
			if (!loginRequest) return null;

			// check if the token is valid
			const isValidRequest = await this.tokensService.verifyHashedToken(loginRequest.hashedToken, token);
			if (!isValidRequest) return null

			// if the token is valid, burn the request
			await this.loginRequestsRepository.deleteById(loginRequest.id, trx);
			return loginRequest
		})
	}




}
