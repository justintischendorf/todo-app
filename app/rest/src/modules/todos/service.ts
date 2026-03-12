import { prisma } from "../../../../../packages/database/prisma";
import type { TodoModel } from "./model";

type TodoBody = (typeof TodoModel.PostTodoBody)["static"];
type TodoParams = (typeof TodoModel.TodoParams)["static"];

export function getAllTodos(userId: string) {
  return prisma.todo.findMany({ where: { userId } });
}

export function addTodo(body: TodoBody, userId: string) {
  return prisma.todo.create({ data: { ...body, userId } });
}

export function updateTodoById(body: TodoBody, params: TodoParams, userId: string) {
  return prisma.todo.update({ where: { id: params.id, userId }, data: body });
}

export function deleteAllTodos(userId: string) {
  return prisma.todo.deleteMany({ where: { userId } });
}

export function deleteTodoById(params: TodoParams, userId: string) {
  return prisma.todo.delete({ where: { id: params.id, userId } });
}
