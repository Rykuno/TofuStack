import { Container } from '@needle-di/core';
import { describe, expect, it } from 'vitest';
import { HashingService } from './hashing.service';

describe('Hashing Service', () => {
  const container = new Container();
  const service = container.get(HashingService);

  it('should hash a value', async () => {
    const value = 'password';
    const hashedValue = await service.hash('password');
    expect(hashedValue).not.toEqual(value);
  });

  it('should validate a correctly hashed value', async () => {
    const value = 'password';
    const hashedValue = await service.hash('password');

    const comparitor = await service.compare(value, hashedValue);
    expect(comparitor).toEqual(true);
  });

  it('should invalidate an incorrectly hashed value', async () => {
    const value = 'password';
    const badHash = await service.hash('notPassword');

    const comparitor = await service.compare(value, badHash);
    expect(comparitor).toEqual(false);
  });
});
