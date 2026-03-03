import { Elysia } from "elysia";
import { TodoService, UserService } from "./service";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/wasm-compiler-edge";
import { TodoModel, UserModel } from "./model";
import { verifyPassword } from "../../auth/hashing";
import { prisma } from "../../../packages/database/prisma";
import { createJWT } from "../../auth/jwt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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
  .options("/auth/register", ({ set }) => {
    set.status = 204;
  })
  .options("/auth/login", ({ set }) => {
    set.status = 204
  })
  .options("/home", ({ set }) => {
    set.status = 204;
  })

  // ------------------------- TODOS ------------------ -------

  .get("/todos", async ({ set, headers }) => {
    const auth = headers['authorization'];
    if (!auth) {
      set.status = 401;
      return { error: "Authorization header missing" };
    }
    const token = auth.replace('Bearer ', '');
    let userId;
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      userId = payload?.userId || payload?.sub || payload?.id;
    } catch (e) {
      set.status = 401;
      return { error: "Invalid token: " + (e as any).message };
    }
    if (!userId) {
      set.status = 401;
      return { error: "UserId missing in token" };
    }
    try {
      const todos = await TodoService.getAllTodos(userId);
      set.status = 200;
      return todos;
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
    async ({ set, body, headers }) => {
      const auth = headers['authorization'];
      if (!auth) {
        set.status = 401;
        return { error: "Authorization header missing" };
      }
      const token = auth.replace('Bearer ', '');
      let userId;
      try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        userId = payload?.userId || payload?.sub || payload?.id;
      } catch (e) {
        set.status = 401;
        return { error: "Invalid token: " + (e as any).message };
      }
      if (!userId) {
        set.status = 401;
        return { error: "UserId missing in token" };
      }
      try {
        if (!body.title || !body.description) {
          set.status = 400;
          return { error: "Title and description are required." };
        }
        console.log('POST /todos - userId:', userId, 'body:', body);
        await TodoService.addTodo({ body, userId });
        console.log('TODO added successfully');
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
          return { error: e.code + ": " + (e as any).meta?.cause };
        }
        set.status = 500;
        return { error: (e as any).message || "The server encountered an unexpected exception." };
      }
    },
    {
      body: TodoModel.PostTodoBody,
    },
  )

  .patch(
    "/todos/:id",
    async ({ set, body, params, headers }) => {
      const auth = headers['authorization'];
      if (!auth) {
        set.status = 401;
        return { error: "Authorization header missing" };
      }
      const token = auth.replace('Bearer ', '');
      let userId;
      try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        userId = payload?.userId || payload?.sub || payload?.id;
      } catch (e) {
        set.status = 401;
        return { error: "Invalid token: " + (e as any).message };
      }
      if (!userId) {
        set.status = 401;
        return { error: "UserId missing in token" };
      }
      try {
        if (!body.title || !body.description) {
          set.status = 400;
          return { error: "Title and description are required." };
        }
        await TodoService.updateTodoById({ body, params, userId });
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

  .delete("/todos", async ({ set, headers }) => {
    const auth = headers['authorization'];
    if (!auth) {
      set.status = 401;
      return { error: "Authorization header missing" };
    }
    const token = auth.replace('Bearer ', '');
    let userId;
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      userId = payload?.userId || payload?.sub || payload?.id;
    } catch (e) {
      set.status = 401;
      return { error: "Invalid token: " + (e as any).message };
    }
    if (!userId) {
      set.status = 401;
      return { error: "UserId missing in token" };
    }
    try {
      await TodoService.deleteAllTodos(userId);
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
    async ({ set, params, headers }) => {
      const auth = headers['authorization'];
      if (!auth) {
        set.status = 401;
        return { error: "Authorization header missing" };
      }
      const token = auth.replace('Bearer ', '');
      let userId;
      try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        userId = payload?.userId || payload?.sub || payload?.id;
      } catch (e) {
        set.status = 401;
        return { error: "Invalid token: " + (e as any).message };
      }
      if (!userId) {
        set.status = 401;
        return { error: "UserId missing in token" };
      }
      try {
        await TodoService.deleteTodoById({ params, userId });
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

  .post(
    "/auth/login",
    async ({ set, body }) => {
      try {
        if (!body.username || !body.email || !body.password) {
          set.status = 400;
          return { error: "Username, email, and password are required." };
        }
        const user = await prisma.user.findUnique({
          where: {
            email: body.email,
          },
        });

        if (!user) {
          set.status = 401;
          return { error: "Nutzer ist nicht vorhanden." };
        }

        const isPasswordValid = await verifyPassword(
          user.password,
          body.password,
        );
        if (isPasswordValid) {
          const token = await createJWT(user.id);
          set.status = 200;
          return { token: token, userId: user.id };
        } else {
          set.status = 401;
          return { error: "Passwort oder Nutzername ist falsch." };
        }
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
