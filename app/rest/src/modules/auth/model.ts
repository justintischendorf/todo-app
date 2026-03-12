import { t } from "elysia";

export namespace UserModel {
  export const PostUserBody = t.Object({
    username: t.String(),
    email: t.String(),
    password: t.String(),
  });
}
