import { prisma } from "../../../packages/database/prisma";
import type { TodoModel, UserModel } from "./model";

export abstract class TodoService {
  static async getAllTodos() {
    return await prisma.todo.findMany();
  }

  static async addTodo({
    body,
  }: {
    body: (typeof TodoModel.PostTodoBody)["static"];
  }) {
    await prisma.todo.create({
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
    await prisma.todo.update({
      where: {
        id: params.id,
      },
      data: body,
    });
  }

  static async deleteAllTodos() {
    await prisma.todo.deleteMany();
  }

  static async deleteTodoById({
    params,
  }: {
    params: (typeof TodoModel.DeleteTodoParams)["static"];
  }) {
    await prisma.todo.delete({
      where: {
        id: params.id,
      },
    });
  }
}

export abstract class UserService {
  static async createUser({
    body,
  }: {
    body: (typeof UserModel.PostUserBody)["static"];
  }) {
    await prisma.user.create({
      data: body,
    });
  }
}
