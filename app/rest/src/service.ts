import { prisma } from "../../../packages/database/prisma";
import { hashPassword } from "../../auth/hashing.ts";
import type { TodoModel, UserModel } from "./model";

export abstract class TodoService {
  static async getAllTodos(userId: string) {
    return await prisma.todo.findMany({
      where: { userId },
    });
  }

  static async addTodo({
    body,
    userId,
  }: {
    body: (typeof TodoModel.PostTodoBody)["static"];
    userId: string;
  }) {
    await prisma.todo.create({
      data: {
        ...body,
        userId: userId,
      },
    });
  }

  static async updateTodoById({
    body,
    params,
    userId,
  }: {
    body: (typeof TodoModel.PatchTodoBody)["static"];
    params: (typeof TodoModel.PatchTodoParams)["static"];
    userId: string;
  }) {
    await prisma.todo.update({
      where: {
        id: params.id,
        userId: userId,
      },
      data: body,
    });
  }

  static async deleteAllTodos(userId: string) {
    await prisma.todo.deleteMany({
      where: { userId },
    });
  }

  static async deleteTodoById({
    params,
    userId,
  }: {
    params: (typeof TodoModel.DeleteTodoParams)["static"];
    userId: string;
  }) {
    await prisma.todo.delete({
      where: {
        id: params.id,
        userId: userId,
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
      data: {
        password: await hashPassword(body.password),
        username: body.username,
        email: body.email,
      },
    });
  }
}
