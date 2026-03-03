import { Elysia } from "elysia";
import { TodoService, UserService } from "./service";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/wasm-compiler-edge";
import { TodoModel, UserModel } from "./model";

const app = new Elysia({ prefix: "/api" })
  .onRequest(({ set }) => {
    set.headers["Access-Control-Allow-Origin"] = "*";
    set.headers["Access-Control-Allow-Methods"] =
      "GET,POST,PATCH,DELETE,OPTIONS";
    set.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";
  })
  .options("/todos", ({ set }) => {
    set.status = 204;
  })
  .options("/todos/:id", ({ set }) => {
    set.status = 204;
  })

  // ------------------------- TODOS ------------------ -------

  .get("/todos", async ({ set }) => {
    try {
      const todo = await TodoService.getAllTodos();
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

  .post(
    "/todos",
    async ({ set, body }) => {
      try {
        if (!body.title || !body.description) {
          set.status = 400;
          return { error: "Title and description are required." };
        }
        await TodoService.addTodo({ body });
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
      body: TodoModel.PostTodoBody,
    },
  )

  .patch(
    "/todos/:id",
    async ({ set, body, params }) => {
      try {
        if (!body.title || !body.description) {
          set.status = 400;
          return { error: "Title and description are required." };
        }
        await TodoService.updateTodoById({ body, params });
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
      body: TodoModel.PatchTodoBody,
      params: TodoModel.PatchTodoParams,
    },
  )

  .delete("/todos", async ({ set }) => {
    try {
      await TodoService.deleteAllTodos();
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
    "/todos/:id",
    async ({ set, params }) => {
      try {
        await TodoService.deleteTodoById({ params });
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

  // ------------------------- AUTH ------------------ -------

  .post(
    "/auth/register",
    async ({ set, body }) => {
      try {
        if (!body.username || !body.email || !body.password) {
          set.status = 400;
          return { error: "Username, email, and password are required." };
        }
        await UserService.createUser({ body });
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
      body: UserModel.PostUserBody,
    },
  )
  .listen(3000);

console.log(`🦊 Elysia läuft auf http://localhost:${app.server?.port}`);
