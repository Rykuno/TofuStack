import 'reflect-metadata';
import { LoginRequestsService } from '../services/login-requests.service';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { TokensService } from '../services/tokens.service';
import { MailerService } from '../services/mailer.service';
import { UsersRepository } from '../repositories/users.repository';
import { DatabaseProvider, LuciaProvider } from '../providers';
import { LoginRequestsRepository } from '../repositories/login-requests.repository';
import { PgDatabase } from 'drizzle-orm/pg-core';
import { container } from 'tsyringe';

describe('LoginRequestService', () => {
  let service: LoginRequestsService;
  let tokensService = vi.mocked(TokensService.prototype)
  let mailerService = vi.mocked(MailerService.prototype);
  let usersRepository = vi.mocked(UsersRepository.prototype);
  let loginRequestsRepository = vi.mocked(LoginRequestsRepository.prototype);
  let luciaProvider = vi.mocked(LuciaProvider);
  let databaseProvider = vi.mocked(PgDatabase);

  beforeAll(() => {
    service = container
      .register<TokensService>(TokensService, { useValue: tokensService })
      .register<MailerService>(MailerService, { useValue: mailerService })
      .register<UsersRepository>(UsersRepository, { useValue: usersRepository })
      .register(LoginRequestsRepository, { useValue: loginRequestsRepository })
      .register(LuciaProvider, { useValue: luciaProvider })
      .register(DatabaseProvider, { useValue: databaseProvider })
      .resolve(LoginRequestsService);
  });


  afterAll(() => {
    vi.resetAllMocks()
  })

  describe('Create', () => {
    tokensService.generateTokenWithExpiryAndHash = vi.fn().mockResolvedValue({
      token: "1",
      expiry: new Date(),
      hashedToken: "xyz"
    } satisfies Awaited<ReturnType<typeof tokensService.generateTokenWithExpiryAndHash>>)

    loginRequestsRepository.create = vi.fn().mockResolvedValue({
      createdAt: new Date(),
      email: 'me@test.com',
      expiresAt: new Date(),
      hashedToken: '111',
      id: '1',
      updatedAt: new Date()
    } satisfies Awaited<ReturnType<typeof loginRequestsRepository.create>>)

    mailerService.sendLoginRequest = vi.fn().mockResolvedValue(null)

    const spy_mailerService_sendLoginRequest = vi.spyOn(mailerService, 'sendLoginRequest')
    const spy_tokensService_generateTokenWithExpiryAndHash = vi.spyOn(tokensService, 'generateTokenWithExpiryAndHash')
    const spy_loginRequestsRepository_create = vi.spyOn(loginRequestsRepository, 'create')

    it('should resolve', async () => {
      await expect(service.create({ email: "test" })).resolves.toBeUndefined()
    })
    it('should generate a token with expiry and hash', async () => {
      expect(spy_tokensService_generateTokenWithExpiryAndHash).toBeCalledTimes(1)
    })
    it('should send an email with token', async () => {
      expect(spy_mailerService_sendLoginRequest).toHaveBeenCalledTimes(1)
    })
    it('should create a new login request record', async () => {
      expect(spy_loginRequestsRepository_create).toBeCalledTimes(1)
    })
  })
});
