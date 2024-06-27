import { Scrypt } from "oslo/password";


export async function hash(value: string) {
  const scrypt = new Scrypt()
  return scrypt.hash(value);
}

export function verify(hashedValue: string, value: string) {
  return new Scrypt().verify(hashedValue, value);
}
