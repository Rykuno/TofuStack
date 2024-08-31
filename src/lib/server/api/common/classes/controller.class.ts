import { Hono } from "hono";
import type { HonoTypes } from "../types/hono.type";
import type { BlankSchema, Env, Schema } from "hono/types";

export abstract class Controler {
  protected readonly controller: Hono<HonoTypes, BlankSchema, '/'>;
  constructor() {
    this.controller = new Hono();
  }
  abstract routes(): Hono<HonoTypes, BlankSchema, '/'>;
}