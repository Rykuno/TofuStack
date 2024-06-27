import { inject, injectable } from 'tsyringe';
import { BadRequest } from '../common/errors';
import { DatabaseProvider } from '../providers';
import { MailerService } from './mailer.service';
import { TokensService } from './tokens.service';
import { LuciaProvider } from '../providers/lucia.provider';
import { UsersRepository } from '../repositories/users.repository';
import type { SignInEmailDto } from '../../../dtos/signin-email.dto';
import type { RegisterEmailDto } from '../../../dtos/register-email.dto';
import { LoginRequestsRepository } from '../repositories/login-requests.repository';

@injectable()
export class LoginRequestsService {
  constructor(
    @inject(LuciaProvider) private readonly lucia: LuciaProvider,
    @inject(DatabaseProvider) private readonly db: DatabaseProvider,
    @inject(TokensService) private readonly tokensService: TokensService,
    @inject(MailerService) private readonly mailerService: MailerService,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @inject(LoginRequestsRepository) private readonly loginRequestsRepository: LoginRequestsRepository,
  ) { }

  async create(data: RegisterEmailDto) {
    // generate a token, expiry date, and hash
    const { token, expiry, hashedToken } = await this.tokensService.generateTokenWithExpiryAndHash(15, 'm');
    // save the login request to the database - ensuring we save the hashedToken
    await this.loginRequestsRepository.create({ email: data.email, hashedToken, expiresAt: expiry });
    // send the login request email
    await this.mailerService.sendLoginRequest({
      to: data.email,
      props: { token: token }
    });
  }

  async verify(data: SignInEmailDto) {
    const validLoginRequest = await this.fetchValidRequest(data.email, data.token);
    if (!validLoginRequest) throw BadRequest('Invalid token');

    let existingUser = await this.usersRepository.findOneByEmail(data.email);

    if (!existingUser) {
      const newUser = await this.handleNewUserRegistration(data.email);
      return this.lucia.createSession(newUser.id, {});
    }

    return this.lucia.createSession(existingUser.id, {});
  }

  // Create a new user and send a welcome email - or other onboarding process
  private async handleNewUserRegistration(email: string) {
    const newUser = await this.usersRepository.create({ email, verified: true, avatar: null })
    this.mailerService.sendWelcome({ to: email, props: null });
    return newUser
  }

  // Fetch a valid request from the database, verify the token and burn the request if it is valid
  private async fetchValidRequest(email: string, token: string) {
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
}