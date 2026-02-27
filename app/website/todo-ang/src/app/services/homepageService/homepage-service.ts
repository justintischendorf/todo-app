import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoModel } from '../../components/homepage/todo/todo';

@Injectable({
  providedIn: 'root',
})
export class HomepageService {
  todos = signal<TodoModel[]>([]);

  constructor(private http: HttpClient) {}

  refreshTodos() {
    this.http.get<TodoModel[]>('http://localhost:3000/api/todos', {}).subscribe({
      next: (data) => {
        this.todos.set(data || []);
      },
      error: (error) => {
          alert(error.error?.error || error.message);
      },
    });
  }

  addTodo(
    title: string,
    description: string,
    titleInput: HTMLInputElement,
    descriptionInput: HTMLInputElement,
  ) {
    this.http
      .post('http://localhost:3000/api/todos', {
        title: title,
        description: description,
      })
      .subscribe({
        next: () => {
          this.refreshTodos();
          titleInput.value = '';
          descriptionInput.value = '';
        },
        error: (error) => {
          alert(error.error?.error || error.message);
        },
      });
  }

  patchTodo(id: string, title: string, description: string) {
    this.http
      .patch(`http://localhost:3000/api/todos/${id}`, { title, description })
      .subscribe({
        next: () => {
          this.refreshTodos();
        },
        error: (error) => {
          alert(error.error?.error || error.message);
        },
      });
  }

  deleteTodos() {
    this.http.delete('http://localhost:3000/api/todos').subscribe(() => {
      this.refreshTodos();
    });
  }

  deleteTodo(id: string) {
    this.http.delete(`http://localhost:3000/api/todos/${id}`).subscribe(() => {
      this.refreshTodos();
    });
  }
}
