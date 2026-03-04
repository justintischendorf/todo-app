import { Component, Input, Output, EventEmitter, input, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/authService/login/login-service';

export interface TodoModel {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './todo.html',
  styleUrls: ['./todo.css'],
})
export class Todo {
  @Input({ required: true }) todo!: TodoModel;
  @Output() todoDeleted = new EventEmitter<void>();
  @Output() todoChanged = new EventEmitter<void>();

  private loginService = inject(LoginService);

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: { Authorization: string } } | {} {
    const token = this.loginService.getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  }

  deleteTodo(id: string) {
    this.http.delete(`http://localhost:3000/api/todos/${id}`, this.getAuthHeaders()).subscribe(() => {
      this.todoDeleted.emit();
    });
  }

  changeTodo(id: string, title: string, description: string) {
    this.http
      .patch(`http://localhost:3000/api/todos/${id}`, {
        title: title,
        description: description,
      }, this.getAuthHeaders())
      .subscribe({
        next: () => {
          this.todo.title = title;
          this.todo.description = description;
          this.todoChanged.emit();
        },
        error: (error) => {
          alert(error.error?.error || error.message);
        },
      });
  }

  showInputField() {
    const inputTitle = document.querySelector('.title-input') as HTMLInputElement;
    const inputDescription = document.querySelector('.description-input') as HTMLInputElement;
    if (inputTitle.style.display === 'block' && inputDescription.style.display === 'block') {
      inputTitle.style.display = 'none';
      inputDescription.style.display = 'none';
    } else {
      inputTitle.style.display = 'block';
      inputDescription.style.display = 'block';
      if (inputTitle) {
        inputTitle.focus();
        inputTitle.select();
      }
    }
  }

  saveNewTodo(newTitle: string, newDescription: string) {
    const inputTitle = document.querySelector('.title-input') as HTMLInputElement;
    const inputDescription = document.querySelector('.description-input') as HTMLInputElement;
    this.changeTodo(this.todo.id, newTitle, newDescription);
    inputTitle.style.display = 'none';
    inputDescription.style.display = 'none';
  }
}
