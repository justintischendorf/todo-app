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
}
