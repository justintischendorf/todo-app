import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Todo, TodoModel } from './todo/todo';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, Todo],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css'],
})
export class Homepage implements OnInit {

  // ✅ EIN State, EIN Signal
  todos = signal<TodoModel[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<TodoModel[]>('http://localhost:3000/api/todos')
      .subscribe(data => {
        this.todos.set(data); // ✅ korrekt
      });
  }
}