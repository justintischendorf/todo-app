import { Elysia } from "elysia";
import { getAllTodos, addTodo, updateTodoById, deleteAllTodos, deleteTodoById } from "./service";
import { TodoModel } from "./model";
import { authGuard } from "../auth/guard";

export const todosModule = new Elysia()
  .use(authGuard)

  .get("/todos", ({ userId }) => getAllTodos(userId))

  .post(
    "/todos",
    async ({ set, body, userId }) => {
      await addTodo(body, userId);
      set.status = 201;
    },
    { body: TodoModel.PostTodoBody },
  )

  .patch(
    "/todos/:id",
    ({ body, params, userId }) => updateTodoById(body, params, userId),
    { body: TodoModel.PatchTodoBody, params: TodoModel.TodoParams },
  )

  .delete("/todos", ({ userId }) => deleteAllTodos(userId))

  .delete(
    "/todos/:id",
    ({ params, userId }) => deleteTodoById(params, userId),
    { params: TodoModel.TodoParams },
  );
