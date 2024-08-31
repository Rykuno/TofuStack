import { scrypt } from "node:crypto";
import { decodeHex, encodeHex } from "oslo/encoding";
import { constantTimeEqual } from "oslo/crypto";
import { injectable } from "tsyringe";

@injectable()
export class HashingService {
  N;
  r;
  p;
  dkLen;

  constructor() {
    this.N = 16384;
    this.r = 16;
    this.p = 1;
    this.dkLen = 64;
  }
  async hash(password: string) {
    const salt = encodeHex(crypto.getRandomValues(new Uint8Array(16)));
    const key = await this.generateKey(password, salt);
    return `${salt}:${encodeHex(key)}`;
  }

  async verify(hash: string, password: string) {
    const [salt, key] = hash.split(":");
    const targetKey = await this.generateKey(password, salt);
    return constantTimeEqual(targetKey, decodeHex(key));
  }

  async generateKey(password: string, salt: string): Promise<Buffer> {
    return await new Promise((resolve, reject) => {
      scrypt(password.normalize("NFKC"), salt, this.dkLen, {
        N: this.N,
        p: this.p,
        r: this.r,
        maxmem: 128 * this.N * this.r * 2
      }, (err, buff) => {
        if (err)
          return reject(err);
        return resolve(buff);
      });
    });
  }
}
