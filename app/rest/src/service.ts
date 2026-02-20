import { prisma } from "../../../packages/database/prisma";
import { CLOUD_EVENT_SOURCE, CLOUD_EVENT_TYPES } from "../../../packages/utils";
import {
  deleteAllTodosFromCache,
  deleteTodoByIdFromCache,
  getMessageByIdFromCache,
  updateTodoByIdInCache,
} from "../../services/redis/cache";
import { enqueueMessage } from "../../services/redis/queue";
import type { TodoModel } from "./model";

export abstract class TodoService {
  static async getAllTodos() {
    return await prisma.todo.findMany();
  }

  static async getTodoById({
    params,
  }: {
    params: (typeof TodoModel.GetTodoParams)["static"];
  }) {
    const cached = await getMessageByIdFromCache(params.id);
    if (cached) {
      return JSON.parse(cached);
    }
    
    const todo = await prisma.todo.findUnique({
      where: {
        id: params.id,
      },
    });
    if (todo) {
      await updateTodoByIdInCache(todo, params.id);
    }
    return todo;
  }

  static async addTodo({
    body,
  }: {
    body: (typeof TodoModel.PostTodoBody)["static"];
  }) {
    await enqueueMessage({
      type: CLOUD_EVENT_TYPES.TODO_SENT,
      source: CLOUD_EVENT_SOURCE.TODO_SENT,
      data: body,
    });
  }

  static async updateTodoById({
    body,
    params,
  }: {
    body: (typeof TodoModel.PatchTodoBody)["static"];
    params: (typeof TodoModel.PatchTodoParams)["static"];
  }) {
    await updateTodoByIdInCache(body, params.id);
    await prisma.todo.update({
      where: {
        id: params.id,
      },
      data: body,
    });
  }

  static async deleteAllTodos() {
    await deleteAllTodosFromCache();
    await prisma.todo.deleteMany();
  }

  static async deleteTodoById({
    params,
  }: {
    params: (typeof TodoModel.DeleteTodoParams)["static"];
  }) {
    await deleteTodoByIdFromCache(params.id);
    await prisma.todo.delete({
      where: {
        id: params.id,
      },
    });
  }
}
