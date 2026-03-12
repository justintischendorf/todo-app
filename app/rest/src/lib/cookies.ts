import { REFRESH_COOKIE_OPTIONS } from "./jwt";

type SetHeaders = { headers: Record<string, string | string[] | number | undefined> };

export function setRefreshCookie(set: SetHeaders, token: string) {
  const { secure, sameSite, path, maxAge } = REFRESH_COOKIE_OPTIONS;
  const parts = [
    `refresh_token=${token}`,
    "HttpOnly",
    `Path=${path}`,
    `Max-Age=${maxAge}`,
    `SameSite=${sameSite}`,
  ];
  if (secure) parts.push("Secure");
  set.headers["Set-Cookie"] = parts.join("; ");
}

export function clearRefreshCookie(set: SetHeaders) {
  const { path } = REFRESH_COOKIE_OPTIONS;
  set.headers["Set-Cookie"] =
    `refresh_token=; HttpOnly; Path=${path}; Max-Age=0; SameSite=Strict`;
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...rest] = c.trim().split("=");
      return [key, rest.join("=")];
    }),
  );
}
