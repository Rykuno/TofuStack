import { injectable } from "tsyringe";
import { Scrypt } from "oslo/password";

/* ---------------------------------- Note ---------------------------------- */
/*
Reference: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id

I use Scrpt as the hashing algorithm due to its higher compatability 
with vite's build system and it uses less memory than Argon2id. 

You can use Argon2id or any other hashing algorithm you prefer.
*/
/* -------------------------------------------------------------------------- */
/*
With Argon2id, you get the following error at times when vite optimizes its dependencies at times,

Error: Build failed with 2 errors:
node_modules/.pnpm/@node-rs+argon2@1.7.0/node_modules/@node-rs/argon2/index.js:159:36: ERROR: No loader is configured for ".node" files: node_module
*/
/* -------------------------------------------------------------------------- */
// If you don't use a hasher from oslo, which are preconfigured with recommended parameters from OWASP,
// ensure that you configure them properly.

@injectable()
export class HashingService {
  private readonly hasher = new Scrypt();
  // private readonly hasher = new Argon2id(); // argon2id hasher

  async hash(data: string) {
    return this.hasher.hash(data);
  }

  async verify(hash: string, data: string) {
    return this.hasher.verify(hash, data)
  }
}