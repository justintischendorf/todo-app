import { Component, Input } from '@angular/core';

export interface TodoModel {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

@Component({
  selector: 'app-todo',
  standalone: true,
  templateUrl: './todo.html',
  styleUrls: ['./todo.css']
})
export class Todo {
  @Input({ required: true }) todo!: TodoModel;
}
