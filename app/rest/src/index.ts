import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
} from "@prisma/client/runtime/wasm-compiler-edge";
import { todosModule } from "./modules/todos";
import { authModule } from "./modules/auth";

const app = new Elysia({ prefix: "/api" })
  .use(
    cors({
      origin: "http://localhost:4200",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    }),
  )
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { error: "Validation failed", details: error?.message };
    }
    if (error instanceof PrismaClientInitializationError) {
      set.status = 503;
      return { error: "Unable to establish database connection." };
    }
    if (
      error instanceof PrismaClientUnknownRequestError ||
      error instanceof PrismaClientRustPanicError
    ) {
      set.status = 500;
      return { error: "The server encountered an unexpected exception." };
    }
    if (error instanceof PrismaClientKnownRequestError) {
      set.status = 500;
      return { error: error.code };
    }
    set.status = 500;
    return { error: "Internal server error" };
  })
  .use(todosModule)
  .use(authModule)
  .listen(3000);

console.log(`🦊 Elysia läuft auf http://localhost:${app.server?.port}`);
