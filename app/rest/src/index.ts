import { Elysia } from "elysia";
import { TodoService } from "./service";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/wasm-compiler-edge";
import { TodoModel } from "./model";

const api = new Elysia({ prefix: "/api" })
  .get("/todos", async ({ set }) => {
    try {
      const todo = TodoService.getAllTodos();
      set.status = 200;
      return todo;
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
  })

  .get(
    "/todos:id",
    async ({ set, params }) => {
      try {
        const todo = TodoService.getTodoById({ params });
        set.status = 200;
        return todo;
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
      params: TodoModel.GetTodoParams,
    },
  )

  .post(
    "/todos",
    async ({ set, body }) => {
      try {
        TodoService.addTodo({ body });
        set.status = 202;
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
      body: TodoModel.PostTodoBody,
    },
  )

  .patch(
    "/todos:id",
    async ({ set, body, params }) => {
      try {
        TodoService.updateTodoById({ body, params });
        set.status = 202;
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
      body: TodoModel.PatchTodoBody,
      params: TodoModel.PatchTodoParams,
    },
  )

  .delete("/todos", async ({ set }) => {
    try {
      TodoService.deleteAllTodos();
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
  })

  .delete(
    "/todos:id",
    async ({ set, params }) => {
      try {
        TodoService.deleteTodoById({ params });
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
      params: TodoModel.DeleteTodoParams,
    },
  )
  .listen(3000);