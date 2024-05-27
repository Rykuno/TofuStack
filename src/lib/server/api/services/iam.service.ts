import { inject, injectable } from 'tsyringe';
import type { RegisterEmailDto } from '../dtos/register-email.dto';
import { UsersRepository } from '../repositories/users.repository';
import { MailerService } from './mailer.service';
import { TokensService } from './tokens.service';
import type { SignInEmailDto } from '../dtos/signin-email.dto';
import { BadRequest } from '../common/errors';
import { LuciaProvider } from '../providers/lucia.provider';
import type { UpdateEmailDto } from '../dtos/update-email.dto';

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
export class IamService {
	constructor(
		@inject(UsersRepository) private usersRepository: UsersRepository,
		@inject(TokensService) private tokensService: TokensService,
		@inject(MailerService) private mailerService: MailerService,
		@inject(LuciaProvider) private lucia: LuciaProvider
	) {}

	async registerEmail(data: RegisterEmailDto) {
		const existingUser = await this.usersRepository.findOneByEmail(data.email);

		if (!existingUser) {
			const newUser = await this.usersRepository.create({ email: data.email, verified: false });
			return this.createValidationReuqest(newUser.id, newUser.email);
		}

		return this.createValidationReuqest(existingUser.id, existingUser.email);
	}

	async signinEmail(data: SignInEmailDto) {
		const user = await this.usersRepository.findOneByEmail(data.email);

		if (!user) {
			throw BadRequest('Bad credentials');
		}

		const isValidToken = await this.tokensService.validateToken(user.id, data.token);

		if (!isValidToken) {
			throw BadRequest('Bad credentials');
		}

		// if this is a new unverified user, send a welcome email and update the user
		if (!user.verified) {
			await this.usersRepository.update(user.id, { verified: true });
			this.mailerService.sendWelcomeEmail({
				to: user.email,
				props: null
			});
		}

		return this.lucia.createSession(user.id, {});
	}

	async verifyEmail(userId: string, token: string) {
		const user = await this.usersRepository.findOneById(userId);

		if (!user) {
			throw BadRequest('User not found');
		}

		const validToken = await this.tokensService.validateToken(user.id, token);

		if (!validToken) {
			throw BadRequest('Invalid token');
		}

		await this.usersRepository.update(user.id, { email: validToken.email });
	}

	async updateEmail(userId: string, data: UpdateEmailDto) {
		return this.createValidationReuqest(userId, data.email);
	}

	async logout(sessionId: string) {
		return this.lucia.invalidateSession(sessionId);
	}

	private async createValidationReuqest(userId: string, email: string) {
		const validationToken = await this.tokensService.create(userId, email);
		this.mailerService.sendEmailVerification({
			to: email,
			props: { token: validationToken.token }
		});
	}
}
