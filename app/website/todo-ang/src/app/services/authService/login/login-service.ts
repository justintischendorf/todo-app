import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient, private router: Router) {}

  login(
    username: string,
    email: string,
    password: string,
    usernameInput: HTMLInputElement,
    emailInput: HTMLInputElement,
    passwordInput: HTMLInputElement,
  ) {
    this.http
      .post('http://localhost:3000/api/auth/login', {
        username: username,
        email: email,
        password: password,
      })
      .subscribe({
        next: (res: any) => {
          const token = res?.token;
          const userId = res?.userId;
          if (token) {
            localStorage.setItem('authToken', token);
          }
          if (userId) {
            localStorage.setItem('userId', String(userId));
          }
          this.router.navigate(['/home']);
        },
        error: (error) => {
          usernameInput.value = '';
          emailInput.value = '';
          passwordInput.value = '';
          alert(error.error?.error || error.message);
        },
      });
  }

  getToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem('authToken');
  }
}
