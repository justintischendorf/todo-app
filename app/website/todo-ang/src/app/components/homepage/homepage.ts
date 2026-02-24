import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo, TodoModel } from './todo/todo';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [Todo],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css'],
})
export class Homepage implements OnInit {
  todos = signal<TodoModel[]>([]);
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.refreshTodos();
  }

  private showAlert(message: string) {
    if (isPlatformBrowser(this.platformId)) {
      alert(message);
    } else {
      console.warn(message);
    }
  }

  refreshTodos() {
    this.http
      .get<TodoModel[]>('http://localhost:3000/api/todos', {
      })
      .pipe(
        delay(10000)
      )
      .subscribe({
        next: (data) => {
          console.log('Todos erfolgreich geladen:', data);
          this.todos.set(data || []);
        },
        error: (error) => {
          console.error('Fehler beim Laden der Todos:', error);
          this.showAlert('Fehler beim Laden der Todos. Ist der Server gestartet?');
        },
      });
  }

  addTodo(
    title: string,
    description: string,
    titleInput: HTMLInputElement,
    descriptionInput: HTMLInputElement,
  ) {
    console.log('Adding todo with title:', title, 'and description:', description);
    if (title.trim() === '') {
      this.showAlert('Der Titel darf nicht leer sein!');
      return;
    }
    console.log('Title is valid');
    if (description.trim() === '') {
      this.showAlert('Die Beschreibung darf nicht leer sein!');
      return;
    }
    console.log('Description is valid');
    for (const todo of this.todos()) {
      if (todo.title === title) {
        this.showAlert('Ein Todo mit diesem Titel existiert bereits!');
        return;
      }
    }
    console.log('Title is unique');
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
      this.showAlert('Es gibt keine Todos zum Löschen!');
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
