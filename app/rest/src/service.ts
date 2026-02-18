import type { TodoModel } from "./model";

export abstract class TodoService {
  static async getAllTodos() {
    console.log("Hallo");
  }

  static async getTodoById({
    params,
  }: {
    params: (typeof TodoModel.GetTodoParams)["static"];
  }) {
    console.log("Hallo");
  }

  static async addTodo({
    body,
  }: {
    body: (typeof TodoModel.PostTodoBody)["static"];
  }) {
    console.log("Hallo");
  }

  static async updateTodoById({
    body,
    params,
  }: {
    body: (typeof TodoModel.PatchTodoBody)["static"];
    params: (typeof TodoModel.PatchTodoParams)["static"];
  }) {
    console.log("Hallo");
  }

  static async deleteAllTodos() {
    console.log("Hallo");
  }

  static async deleteTodoById({
    params,
  }: {
    params: (typeof TodoModel.DeleteTodoParams)["static"];
  }) {
    console.log("Hallo");
  }
}
