import { container } from 'tsyringe';
import { Hono } from 'hono';
import type { HonoTypes } from '../types';

// Symbol
export const ControllerProvider = Symbol('CONTROLLER_PROVIDER');

// Type
export type ControllerProvider = typeof controller;

// Value
const controller = new Hono<HonoTypes>();

// Register
container.register<ControllerProvider>(ControllerProvider, { useValue: controller });
