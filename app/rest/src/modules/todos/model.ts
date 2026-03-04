import { t } from "elysia";

export namespace TodoModel {
  export const GetTodoParams = t.Object({
    id: t.String(),
  });

  export const PostTodoBody = t.Object({
    title: t.String(),
    description: t.String(),
  });

  export const PatchTodoBody = t.Object({
    title: t.String(),
    description: t.String(),
  });

  export const PatchTodoParams = t.Object({
    id: t.String(),
  });

  export const DeleteTodoParams = t.Object({
    id: t.String(),
  });
}
