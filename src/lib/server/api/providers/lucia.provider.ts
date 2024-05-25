import { container } from 'tsyringe';
import { lucia } from '../common/lucia';

// Symbol
export const LuciaProvider = Symbol('LUCIA_PROVIDER');

// Type
export type LuciaProvider = typeof lucia;

// Register
container.register<LuciaProvider>(LuciaProvider, { useValue: lucia });
