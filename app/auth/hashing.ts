import * as argon2 from "@node-rs/argon2";
import { randomBytes } from "crypto";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16); // 16 bytes = 128 bits
  const hash = await argon2.hash(password, {
    salt,
    memoryCost: 65536, // 64 MiB
    timeCost: 2,
    parallelism: 1,
  });
  return salt.toString("base64") + ":" + hash;
}

export async function verifyPassword(
  storedHash: string,
  password: string,
): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 2) {
    return false;
  }

  const saltBase64 = parts[0] as string;
  const hash = parts[1] as string;
  const salt = Buffer.from(saltBase64, "base64");

  const computedHash = await argon2.hash(password, {
    salt,
    memoryCost: 65536,
    timeCost: 2,
    parallelism: 1,
  });

  return hash === computedHash;
}
