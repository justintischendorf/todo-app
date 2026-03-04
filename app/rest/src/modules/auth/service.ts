import { prisma } from "../../../../../packages/database/prisma";
import { hashPassword } from "../../../../safety/hashing";
import type { UserModel } from "./model";

export abstract class UserService {
  static async createUser({
    body,
  }: {
    body: (typeof UserModel.PostUserBody)["static"];
  }) {
    await prisma.user.create({
      data: {
        password: await hashPassword(body.password),
        username: body.username,
        email: body.email,
      },
    });
  }
}
