import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo, TodoModel } from './todo/todo';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [Todo],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css'],
})
export class Homepage implements OnInit {
  todos = signal<TodoModel[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.refreshTodos();
  }

  refreshTodos() {
    this.http.get<TodoModel[]>('http://localhost:3000/api/todos').subscribe({
      next: (data) => {
        this.todos.set(data || []);
      },
      error: (error) => {
        console.error('Fehler beim Laden der Todos:', error);
        alert('Fehler beim Laden der Todos. Ist der Server gestartet?');
      }
    });
  }

  addTodo(
    title: string,
    description: string,
    titleInput: HTMLInputElement,
    descriptionInput: HTMLInputElement,
  ) {
    if (title.trim() === '') {
      alert('Der Titel darf nicht leer sein!');
      return;
    }
    if (description.trim() === '') {
      alert('Die Beschreibung darf nicht leer sein!');
      return;
    }
    for (const todo of this.todos()) {
      if (todo.title === title) {
        alert('Ein Todo mit diesem Titel existiert bereits!');
        return;
      }
    }
    this.http
      .post('http://localhost:3000/api/todos', {
        title: title,
        description: description,
      })
      .subscribe(() => {
        this.refreshTodos();
        titleInput.value = '';
        descriptionInput.value = '';
      });
  }

  patchTodo(id: string, title: string, description: string) {
    this.http
      .patch(`http://localhost:3000/api/todos/${id}`, { title, description })
      .subscribe(() => {
        this.refreshTodos();
      });
  }

  deleteTodos() {
    if (this.todos().length === 0) {
      alert('Es gibt keine Todos zum Löschen!');
      return;
    }
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
