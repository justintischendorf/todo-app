import jwt from "jsonwebtoken";

export const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "access-secret-change-in-production";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-secret-change-in-production";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export function createAccessToken(userId: string): string {
  return jwt.sign({ sub: userId, type: "access" }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

export function createRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, type: "refresh" }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export function verifyRefreshToken(token: string): { sub: string } {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as { sub: string };
}

export function verifyAccessToken(token: string): { sub: string } {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as { sub: string };
}

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};