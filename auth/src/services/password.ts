import { hash, compare } from "bcrypt";

const SALT_ROUNDS = 15;

export class Password {
  static async toHash(password: string) {
    const hashedPassword = await hash(password, SALT_ROUNDS);

    return hashedPassword;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const result = await compare(suppliedPassword, storedPassword);

    return result;
  }
}
