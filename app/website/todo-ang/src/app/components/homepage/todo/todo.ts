import { Component, OnInit, signal } from '@angular/core';

export interface TodoModel {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

async function getData() {
  const url = 'http://localhost:3000/api/todos';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

@Component({
  selector: 'app-todo',
  imports: [],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo implements OnInit {
  protected readonly title = signal('todo-ang');

  protected todos: TodoModel[] = [];

  async ngOnInit() {
    this.todos = await getData();
    console.log(this.todos);
  }
}
