import { Elysia } from "elysia";
import { todosModule } from "./modules/todos";
import { authModule } from "./modules/auth";

const app = new Elysia({ prefix: "/api" })
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { error: "Validation failed", details: error?.message };
    }
    set.status = 500;
    return { error: "Internal server error", details: error ?? String(error) };
  })
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
    set.status = 204;
  })
  .options("/home", ({ set }) => {
    set.status = 204;
  })
  .use(todosModule)
  .use(authModule)
  .listen(3000);

console.log(`🦊 Elysia läuft auf http://localhost:${app.server?.port}`);
