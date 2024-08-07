import { container } from 'tsyringe';
import { lucia } from '../packages/lucia';

export const LuciaProvider = Symbol('LUCIA_PROVIDER');
export type LuciaProvider = typeof lucia;
container.register<LuciaProvider>(LuciaProvider, { useValue: lucia });
