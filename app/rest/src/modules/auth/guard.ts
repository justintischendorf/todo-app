import Elysia from "elysia";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

const validateToken = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;
  try {
    const token = authHeader.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };
    return payload?.sub || null;
  } catch {
    return null;
  }
};

export const authGuard = new Elysia({ name: 'authGuard' })
  .onBeforeHandle(({ headers, set }) => {
    const auth = headers["authorization"];
    const userId = validateToken(auth);
    if (!userId) {
      set.status = 401;
      return { error: 'Unauthorized', message: 'Authentication required' };
    }
  })
  .resolve(({ headers }) => {
    const auth = headers["authorization"];
    const userId = validateToken(auth)!;
    return { userId };
  })
  .as('scoped');
