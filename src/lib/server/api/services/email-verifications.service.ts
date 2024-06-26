import { inject, injectable } from 'tsyringe';
import { BadRequest } from '../common/errors';
import { DatabaseProvider } from '../providers';
import { MailerService } from './mailer.service';
import { TokensService } from './tokens.service';
import { UsersRepository } from '../repositories/users.repository';
import { EmailVerificationsRepository } from '../repositories/email-verifications.repository';

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
export class EmailVerificationsService {
  constructor(
    @inject(DatabaseProvider) private readonly db: DatabaseProvider,
    @inject(TokensService) private readonly tokensService: TokensService,
    @inject(MailerService) private readonly mailerService: MailerService,
    @inject(UsersRepository) private readonly usersRepository: UsersRepository,
    @inject(EmailVerificationsRepository) private readonly emailVerificationsRepository: EmailVerificationsRepository,
  ) { }


  async dispatchEmailVerificationToken(userId: string, requestedEmail: string) {
    // generate a token and expiry
    const { token, expiry, hashedToken } = await this.tokensService.generateTokenWithExpiryAndHash(15, 'm')

    // create a new email verification record
    await this.emailVerificationsRepository.create({ requestedEmail, userId, hashedToken, expiresAt: expiry })

    // send the verification email - we don't need to await success and will opt for good-faith since we 
    // will offer a way to resend the email if it fails
    this.mailerService.sendEmailVerification({
      to: requestedEmail,
      props: {
        token
      }
    })
  }

  async processEmailVerificationToken(userId: string, token: string) {
    const validRecord = await this.findAndBurnEmailVerificationToken(userId, token)
    if (!validRecord) throw BadRequest('Invalid token');

    // burn the token and update the user
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
