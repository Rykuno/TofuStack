import { inject, injectable } from 'tsyringe';
import { MailerService } from './mailer.service';
import { TokensService } from './tokens.service';
import { UsersRepository } from '../repositories/users.repository';
import { EmailVerificationsRepository } from '../repositories/email-verifications.repository';
import { DatabaseProvider } from '../providers/database.provider';
import { EmailChangeNoticeEmail } from '../emails/email-change-notice.email';
import { LoginVerificationEmail } from '../emails/login-verification.email';
import { BadRequest } from '../common/exceptions';

@injectable()
export class EmailVerificationsService {
  constructor(
    @inject(DatabaseProvider) private readonly db: DatabaseProvider,
    @inject(TokensService) private readonly tokensService: TokensService,
    @inject(MailerService) private readonly mailerService: MailerService,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @inject(EmailVerificationsRepository) private readonly emailVerificationsRepository: EmailVerificationsRepository,
  ) { }

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
