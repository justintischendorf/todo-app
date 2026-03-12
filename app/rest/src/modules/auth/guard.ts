import Elysia from "elysia";
import { verifyAccessToken } from "../../lib/jwt";

export const authGuard = new Elysia({ name: "authGuard" })
  .derive(({ headers, set }) => {
    const auth = headers["authorization"];
    if (!auth) {
      set.status = 401;
      throw new Error("Unauthorized");
    }
    try {
      const token = auth.replace("Bearer ", "");
      const { sub } = verifyAccessToken(token);
      return { userId: sub };
    } catch {
      set.status = 401;
      throw new Error("Unauthorized");
    }
  })
  .as("scoped");
