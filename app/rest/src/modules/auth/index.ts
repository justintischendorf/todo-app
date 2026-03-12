import { Elysia } from "elysia";
import { UserModel } from "./model";
import { createUser, login, refreshToken } from "./service";
import {
  setRefreshCookie,
  clearRefreshCookie,
  parseCookies,
} from "../../lib/cookies";

export const authModule = new Elysia()

  .post(
    "/auth/register",
    async ({ set, body }) => {
      await createUser(body);
      set.status = 201;
    },
    { body: UserModel.PostUserBody },
  )

  .post("/auth/refresh", ({ set, headers }) => {
    const cookies = parseCookies(headers["cookie"]);
    const token = cookies["refresh_token"];
    if (!token) {
      set.status = 401;
      return { error: "No refresh token provided." };
    }
    const result = refreshToken(token);
    setRefreshCookie(set, result.refreshToken);
    return { accessToken: result.accessToken };
  })

  .post("/auth/logout", ({ set }) => {
    clearRefreshCookie(set);
    return { message: "Logged out." };
  })

  .post(
    "/auth/login",
    async ({ set, body }) => {
      const result = await login(body);
      if (!result) {
        set.status = 401;
        return { error: "E-Mail oder Passwort ist falsch." };
      }
      setRefreshCookie(set, result.refreshToken);
      return { accessToken: result.accessToken, userId: result.userId };
    },
    { body: UserModel.PostUserBody },
  );
