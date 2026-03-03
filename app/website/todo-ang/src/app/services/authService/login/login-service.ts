import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(username: string, email: string, password: string) {
    this.http
      .post('http://localhost:3000/api/auth/login', {
        username: username,
        email: email,
        password: password,
      })
      .subscribe({
        next: () => {
          window.location.href = '/home';
        },
        error: (error) => {
          alert(error.error?.error || error.message);
        },
      });
  }
}
