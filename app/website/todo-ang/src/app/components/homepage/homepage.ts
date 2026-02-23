import { Component } from '@angular/core';
import { Todo, TodoModel } from './todo/todo';

@Component({
  selector: 'app-homepage',
  imports: [Todo],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
}
