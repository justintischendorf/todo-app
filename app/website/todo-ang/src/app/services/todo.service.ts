import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoModel } from '../models/todo.model';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todos = signal<TodoModel[]>([]);

  constructor(private http: HttpClient) {}

  refreshTodos(): void {
    this.http.get<TodoModel[]>(`${environment.apiUrl}/todos`).subscribe({
      next: (data) => this.todos.set(data || []),
      error: (error) => alert(error.error?.error || error.message),
    });
  }

  addTodo(title: string, description: string): void {
    this.http.post(`${environment.apiUrl}/todos`, { title, description }).subscribe({
      next: () => this.refreshTodos(),
      error: (error) => alert(error.error?.error || error.message),
    });
  }

  patchTodo(id: string, title: string, description: string): void {
    this.http.patch(`${environment.apiUrl}/todos/${id}`, { title, description }).subscribe({
      next: () => this.refreshTodos(),
      error: (error) => alert(error.error?.error || error.message),
    });
  }

  deleteTodo(id: string): void {
    this.http.delete(`${environment.apiUrl}/todos/${id}`).subscribe({
      next: () => this.refreshTodos(),
      error: (error) => alert(error.error?.error || error.message),
    });
  }

  deleteAllTodos(): void {
    this.http.delete(`${environment.apiUrl}/todos`).subscribe({
      next: () => this.refreshTodos(),
      error: (error) => alert(error.error?.error || error.message),
    });
  }
}
