import { Elysia } from "elysia";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/wasm-compiler-edge";
import { prisma } from "../../../../../packages/database/prisma";
import { verifyPassword } from "../../../../safety/hashing";
import { createJWT } from "../../../../safety/jwt";
import { UserModel } from "./model";
import { UserService } from "./service";

export const authModule = new Elysia()

  // ------------------------- AUTH ------------------ -------

  .post(
    "/auth/register",
    async ({ set, body }) => {
      try {
        if (!body.username || !body.email || !body.password) {
          set.status = 400;
          return { error: "Username, email, and password are required." };
        }
        await UserService.createUser({ body });
        set.status = 200;
      } catch (e) {
        if (e instanceof PrismaClientInitializationError) {
          set.status = 503;
          return { error: "Unable to establish database connection." };
        }
        if (
          e instanceof PrismaClientUnknownRequestError ||
          e instanceof PrismaClientRustPanicError
        ) {
          set.status = 500;
          return { error: "The server encountered an unexpected exception." };
        }
        if (e instanceof PrismaClientKnownRequestError) {
          set.status = 500;
          return { error: e.code };
        }
        set.status = 500;
        return { error: "The server encountered an unexpected exception." };
      }
    },
    {
      body: UserModel.PostUserBody,
    },
  )

  .post(
    "/auth/login",
    async ({ set, body }) => {
      try {
        if (!body.username || !body.email || !body.password) {
          set.status = 400;
          return { error: "Username, email, and password are required." };
        }
        const user = await prisma.user.findUnique({
          where: {
            email: body.email,
          },
        });
        if (!user) {
          set.status = 401;
          return { error: "Nutzer ist nicht vorhanden." };
        }
        const isPasswordValid = await verifyPassword(
          user.password,
          body.password,
        );
        if (isPasswordValid) {
          const token = await createJWT(user.id);
          set.status = 200;
          return { token: token, userId: user.id };
        } else {
          set.status = 401;
          return { error: "Passwort oder Nutzername ist falsch." };
        }
      } catch (e) {
        if (e instanceof PrismaClientInitializationError) {
          set.status = 503;
          return { error: "Unable to establish database connection." };
        }
        if (
          e instanceof PrismaClientUnknownRequestError ||
          e instanceof PrismaClientRustPanicError
        ) {
          set.status = 500;
          return { error: "The server encountered an unexpected exception." };
        }
        if (e instanceof PrismaClientKnownRequestError) {
          set.status = 500;
          return { error: e.code };
        }
        set.status = 500;
        return { error: "The server encountered an unexpected exception." };
      }
    },
    {
      body: UserModel.PostUserBody,
    },
  );
