import { t } from "elysia";

export namespace TodoModel {
  export const GetTodoParams = t.Object({
    id: t.String(),
  });
}
