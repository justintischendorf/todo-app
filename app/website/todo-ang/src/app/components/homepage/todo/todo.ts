import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TodoModel } from '../../../models/todo.model';

@Component({
  selector: 'app-todo',
  imports: [DatePipe],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {
  @Input({ required: true }) todo!: TodoModel;
  @Output() deleted = new EventEmitter<string>();
  @Output() updated = new EventEmitter<{ id: string; title: string; description: string }>();

  isEditing = false;

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onDelete(): void {
    this.deleted.emit(this.todo.id);
  }

  onSave(title: string, description: string): void {
    this.updated.emit({ id: this.todo.id, title, description });
    this.isEditing = false;
  }
}
