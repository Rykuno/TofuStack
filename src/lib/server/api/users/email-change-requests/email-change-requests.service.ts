import { inject, injectable } from '@needle-di/core';
import { EmailChangeRequestsRepository } from './email-change-requests.repository';
import { MailerService } from '../../mail/mailer.service';
import { EmailChangeRequestEmail } from '../../mail/templates/email-change-request.template';
import { EmailChangeNoticeEmail } from '../../mail/templates/email-change-notice.template';
import { BadRequest } from '../../common/utils/exceptions';
import { UsersRepository } from '../users.repository';
import { VerificationCodesService } from '../../common/services/verification-codes.service';

@injectable()
export class EmailChangeRequestsService {
  constructor(
    private emailChangeRequetsRepository = inject(EmailChangeRequestsRepository),
    private verificationCodesService = inject(VerificationCodesService),
    private mailerService = inject(MailerService),
    private usersRepository = inject(UsersRepository)
  ) {}

  async requestEmailChange(userId: string, requestedEmail: string) {
    // Delete any existing email change requests for the account
    await this.emailChangeRequetsRepository.delete(userId);

    // Generate a new verification code and hash
    const { verificationCode, hashedVerificationCode } =
      await this.verificationCodesService.generateCodeWithHash();

    // Create a new email change request
    await this.emailChangeRequetsRepository.set({
      userId,
      requestedEmail,
      hashedCode: hashedVerificationCode
    });

    // Get the account
    const user = await this.usersRepository.findOneByIdOrThrow(userId);
    // Notify the account of the email change request
    await this.mailerService.send({
      to: user.email,
      template: new EmailChangeNoticeEmail()
    });

    // Send the verification code to the newly requested email
    await this.mailerService.send({
      to: requestedEmail,
      template: new EmailChangeRequestEmail(verificationCode)
    });
  }

  async verifyEmailChange(userId: string, verificationCode: string) {
    // Get the email change request
    const emailChangeRequest = await this.emailChangeRequetsRepository.get(userId);
    if (!emailChangeRequest) throw BadRequest('Bad Request');

    // Verify the verification code
    const isValid = await this.verificationCodesService.verify({
      verificationCode,
      hashedVerificationCode: emailChangeRequest.hashedCode
    });
    if (!isValid) throw BadRequest('Bad Request');

    // Update the account's email
    await this.usersRepository.update(userId, {
      email: emailChangeRequest.requestedEmail
    });

    // Delete the email change request
    await this.emailChangeRequetsRepository.delete(userId);
  }
}
