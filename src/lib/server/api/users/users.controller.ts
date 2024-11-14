import { inject, injectable } from '@needle-di/core';
import { UsersService } from './users.service';
import { Controller } from '../common/interfaces/controllers.interface';
import { authState } from '../common/middleware/auth.middleware';
import { zValidator } from '@hono/zod-validator';
import { updateUserDto } from './dtos/update-user.dto';
import { EmailChangeRequestsService } from './email-change-requests/email-change-requests.service';
import { updateEmailDto } from './dtos/update-email.dto';
import { UsersRepository } from './users.repository';
import { verifyEmailDto } from './dtos/verify-email.dto';
import { rateLimit } from '../common/middleware/rate-limit.middleware';

@injectable()
export class UsersController extends Controller {
  constructor(
    private usersService = inject(UsersService),
    private emailChangeRequestsService = inject(EmailChangeRequestsService),
    private usersRepository = inject(UsersRepository)
  ) {
    super();
  }

  routes() {
    return this.controller
      .get('/me', async (c) => {
        const session = c.var.session;
        const user = session ? await this.usersRepository.findOneByIdOrThrow(session.userId) : null;
        return c.json(user);
      })
      .patch('/me', authState('session'), zValidator('form', updateUserDto), async (c) => {
        await this.usersService.update(c.var.session.userId, c.req.valid('form'));
        const user = await this.usersRepository.findOneByIdOrThrow(c.var.session.id);
        return c.json(user);
      })
      .post(
        '/me/email/request',
        authState('session'),
        zValidator('json', updateEmailDto),
        rateLimit({ limit: 5, minutes: 15 }),
        async (c) => {
          await this.emailChangeRequestsService.requestEmailChange(
            c.var.session.userId,
            c.req.valid('json').email
          );
          return c.json({ message: 'Email change request sent' });
        }
      )
      .post(
        '/me/email/verify',
        authState('session'),
        zValidator('json', verifyEmailDto),
        rateLimit({ limit: 5, minutes: 15 }),
        async (c) => {
          await this.emailChangeRequestsService.verifyEmailChange(
            c.var.session.userId,
            c.req.valid('json').code
          );
          return c.json({ message: 'Email change request sent' });
        }
      );
  }
}
