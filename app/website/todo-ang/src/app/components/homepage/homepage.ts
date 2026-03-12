import { Component, inject, OnInit } from '@angular/core';
import { Todo } from './todo/todo';
import { TodoService } from '../../services/todo.service';
import { AuthService } from '../../services/auth.service';
import { Stars } from '../shared/stars/stars';

@Component({
  selector: 'app-homepage',
  imports: [Todo, Stars],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage implements OnInit {
  todoService = inject(TodoService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.todoService.refreshTodos();
  }

  onAddTodo(titleInput: HTMLInputElement, descriptionInput: HTMLInputElement): void {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!title || !description) return;
    this.todoService.addTodo(title, description);
    titleInput.value = '';
    descriptionInput.value = '';
  }

  onDeleteTodo(id: string): void {
    this.todoService.deleteTodo(id);
  }

  onUpdateTodo(event: { id: string; title: string; description: string }): void {
    this.todoService.patchTodo(event.id, event.title, event.description);
  }

  onLogout(): void {
    this.authService.logout();
  }
}
