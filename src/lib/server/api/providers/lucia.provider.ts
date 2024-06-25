import { container } from 'tsyringe';
import { lucia } from '../infrastructure/auth/lucia';

// Symbol
export const LuciaProvider = Symbol('LUCIA_PROVIDER');

// Type
export type LuciaProvider = typeof lucia;

// Register
container.register<LuciaProvider>(LuciaProvider, { useValue: lucia });
