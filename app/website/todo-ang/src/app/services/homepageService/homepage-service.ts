import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TodoModel } from '../../components/homepage/todo/todo';
import { LoginService } from '../authService/login/login-service';

@Injectable({
  providedIn: 'root',
})
export class HomepageService {
  todos = signal<TodoModel[]>([]);

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
  ) {}

  refreshTodos() {
    const token = this.loginService.getToken();
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const options = Object.keys(headers).length ? { headers } : {};
    this.http.get<TodoModel[]>('http://localhost:3000/api/todos', options).subscribe({
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
    const token = this.loginService.getToken();
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const options = Object.keys(headers).length ? { headers } : {};
    this.http
      .post(
        'http://localhost:3000/api/todos',
        {
          title: title,
          description: description,
        },
        options,
      )
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
    const token = this.loginService.getToken();
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const options = Object.keys(headers).length ? { headers } : {};
    this.http
      .patch(`http://localhost:3000/api/todos/${id}`, { title, description }, options)
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
    const token = this.loginService.getToken();
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const options = Object.keys(headers).length ? { headers } : {};
    this.http.delete('http://localhost:3000/api/todos', options).subscribe(() => {
      this.refreshTodos();
    });
  }

  deleteTodo(id: string) {
    console.log('check');
    const token = this.loginService.getToken();
    const headers: any = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const options = Object.keys(headers).length ? { headers } : {};
    this.http.delete(`http://localhost:3000/api/todos/${id}`, options).subscribe(() => {
      this.refreshTodos();
    });
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
    window.location.href = '/login';
  }
}
