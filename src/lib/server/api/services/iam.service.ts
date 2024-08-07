import { inject, injectable } from 'tsyringe';
import { MailerService } from './mailer.service';
import { TokensService } from './tokens.service';
import { LuciaProvider } from '../providers/lucia.provider';
import { UsersRepository } from '../repositories/users.repository';
import type { SignInEmailDto } from '../dtos/signin-email.dto';
import type { RegisterEmailDto } from '../dtos/register-email.dto';
import { LoginRequestsRepository } from '../repositories/login-requests.repository';
import { LoginVerificationEmail } from '../emails/login-verification.email';
import { DatabaseProvider } from '../providers/database.provider';
import { BadRequest } from '../common/exceptions';
import { WelcomeEmail } from '../emails/welcome.email';
import { EmailVerificationsRepository } from '../repositories/email-verifications.repository';
import { EmailChangeNoticeEmail } from '../emails/email-change-notice.email';

@injectable()
export class IamService {
	constructor(
		@inject(LuciaProvider) private readonly lucia: LuciaProvider,
		@inject(DatabaseProvider) private readonly db: DatabaseProvider,
		@inject(TokensService) private readonly tokensService: TokensService,
		@inject(MailerService) private readonly mailerService: MailerService,
		@inject(UsersRepository) private readonly usersRepository: UsersRepository,
		@inject(LoginRequestsRepository) private readonly loginRequestsRepository: LoginRequestsRepository,
		@inject(EmailVerificationsRepository) private readonly emailVerificationsRepository: EmailVerificationsRepository,
	) { }

	async createLoginRequest(data: RegisterEmailDto) {
		// generate a token, expiry date, and hash
		const { token, expiry, hashedToken } = await this.tokensService.generateTokenWithExpiryAndHash(15, 'm');
		// save the login request to the database - ensuring we save the hashedToken
		await this.loginRequestsRepository.create({ email: data.email, hashedToken, expiresAt: expiry });
		// send the login request email
		await this.mailerService.send({ email: new LoginVerificationEmail(token), to: data.email });
	}

	async verifyLoginRequest(data: SignInEmailDto) {
		const validLoginRequest = await this.getValidLoginRequest(data.email, data.token);
		if (!validLoginRequest) throw BadRequest('Invalid token');

		let existingUser = await this.usersRepository.findOneByEmail(data.email);

		if (!existingUser) {
			const newUser = await this.handleNewUserRegistration(data.email);
			return this.lucia.createSession(newUser.id, {});
		}

		return this.lucia.createSession(existingUser.id, {});
	}

	// These steps follow the process outlined in OWASP's "Changing A User's Email Address" guide.
	// https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#changing-a-users-registered-email-address
	async dispatchEmailVerificationRequest(userId: string, requestedEmail: string) {
		// generate a token and expiry
		const { token, expiry, hashedToken } = await this.tokensService.generateTokenWithExpiryAndHash(15, 'm')
		const user = await this.usersRepository.findOneByIdOrThrow(userId)

		// create a new email verification record
		await this.emailVerificationsRepository.create({ requestedEmail, userId, hashedToken, expiresAt: expiry })

		// A confirmation-required email message to the proposed new address, instructing the user to 
		// confirm the change and providing a link for unexpected situations
		this.mailerService.send({
			to: requestedEmail,
			email: new LoginVerificationEmail(token)
		})

		// A notification-only email message to the current address, alerting the user to the impending change and 
		// providing a link for an unexpected situation.
		this.mailerService.send({
			to: user.email,
			email: new EmailChangeNoticeEmail()
		})
	}

	async processEmailVerificationRequest(userId: string, token: string) {
		const validRecord = await this.findAndBurnEmailVerificationToken(userId, token)
		if (!validRecord) throw BadRequest('Invalid token');
		await this.usersRepository.update(userId, { email: validRecord.requestedEmail, verified: true });
	}

	async logout(sessionId: string) {
		return this.lucia.invalidateSession(sessionId);
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
		return await this.db.transaction(async (trx) => {
			// fetch the login request
			const loginRequest = await this.loginRequestsRepository.trxHost(trx).findOneByEmail(email)
			if (!loginRequest) return null;

			// check if the token is valid
			const isValidRequest = await this.tokensService.verifyHashedToken(loginRequest.hashedToken, token);
			if (!isValidRequest) return null

			// if the token is valid, burn the request
			await this.loginRequestsRepository.trxHost(trx).deleteById(loginRequest.id);
			return loginRequest
		})
	}

	private async findAndBurnEmailVerificationToken(userId: string, token: string) {
		return this.db.transaction(async (trx) => {
			// find a valid record
			const emailVerificationRecord = await this.emailVerificationsRepository.trxHost(trx).findValidRecord(userId);
			if (!emailVerificationRecord) return null;

			// check if the token is valid
			const isValidRecord = await this.tokensService.verifyHashedToken(emailVerificationRecord.hashedToken, token);
			if (!isValidRecord) return null

			// burn the token if it is valid
			await this.emailVerificationsRepository.trxHost(trx).deleteById(emailVerificationRecord.id)
			return emailVerificationRecord
		})
	}


}
