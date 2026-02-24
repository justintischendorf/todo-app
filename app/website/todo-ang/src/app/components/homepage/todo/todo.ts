import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

export interface TodoModel {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './todo.html',
  styleUrls: ['./todo.css'],
})
export class Todo {
  @Input({ required: true }) todo!: TodoModel;
  @Output() todoDeleted = new EventEmitter<void>();
  @Output() todoChanged = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  deleteTodo(id: string) {
    this.http.delete(`http://localhost:3000/api/todos/${id}`).subscribe(() => {
      this.todoDeleted.emit();
    });
  }

  changeTodo(id: string, title: string, description: string) {
    this.http
      .patch(`http://localhost:3000/api/todos/${id}`, {
        title: title,
        description: description,
      })
      .subscribe(() => {
        this.todoChanged.emit();
      });
  }
}
