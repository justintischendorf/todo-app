import { prisma } from "../../../../../packages/database/prisma";
import { hashPassword, verifyPassword } from "../../lib/hashing";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../lib/jwt";
import type { UserModel } from "./model";

type AuthBody = (typeof UserModel.PostUserBody)["static"];

export async function createUser(body: AuthBody) {
  await prisma.user.create({
    data: {
      password: await hashPassword(body.password),
      username: body.username,
      email: body.email,
    },
  });
}

export async function login(body: AuthBody) {
  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });
  if (!user) return null;

  const isValid = await verifyPassword(user.password, body.password);
  if (!isValid) return null;

  return {
    accessToken: createAccessToken(user.id),
    refreshToken: createRefreshToken(user.id),
    userId: user.id,
  };
}

export function refreshToken(token: string) {
  const { sub } = verifyRefreshToken(token);
  return {
    accessToken: createAccessToken(sub),
    refreshToken: createRefreshToken(sub),
  };
}
