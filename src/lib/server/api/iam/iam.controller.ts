import { inject, injectable } from '@needle-di/core';
import { zValidator } from '@hono/zod-validator';
import { createLoginRequestDto } from '../iam/login-requests/dtos/create-login-request.dto';
import { LoginRequestsService } from '../iam/login-requests/login-requests.service';
import { verifyLoginRequestDto } from '../iam/login-requests/dtos/verify-login-request.dto';
import { SessionsService } from '../iam/sessions/sessions.service';
import { authState } from '../common/middleware/auth.middleware';
import { Controller } from '../common/interfaces/controllers.interface';

@injectable()
export class IamController extends Controller {
  constructor(
    private loginRequestsService = inject(LoginRequestsService),
    private sessionsService = inject(SessionsService)
  ) {
    super();
  }

  routes() {
    return this.controller
      .post(
        '/login/request',
        authState('none'),
        zValidator('json', createLoginRequestDto),
        async (c) => {
          await this.loginRequestsService.sendVerificationCode(c.req.valid('json'));
          return c.json({ message: 'welcome' });
        }
      )
      .post(
        '/login/verify',
        authState('none'),
        zValidator('json', verifyLoginRequestDto),
        async (c) => {
          const session = await this.loginRequestsService.verify(c.req.valid('json'));
          await this.sessionsService.setSessionCookie(session);
          return c.json({ message: 'welcome' });
        }
      )
      .post('/logout', async (c) => {
        await this.sessionsService.invalidateSession('');
        this.sessionsService.deleteSessionCookie();
        return c.json({ message: 'logout' });
      });
  }
}
