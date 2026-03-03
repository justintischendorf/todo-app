import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  registerUser(
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    usernameInput: HTMLInputElement,
    emailInput: HTMLInputElement,
    passwordInput: HTMLInputElement,
    confirmPasswordInput: HTMLInputElement,
  ) {
    if (password !== confirmPassword) {
      alert('Passwörter stimmen nicht überein!');
      return;
    }
    this.http
      .post('http://localhost:3000/api/auth/register', {
        username: username,
        email: email,
        password: password,
      })
      .subscribe({
        next: () => {
          alert('Registrierung erfolgreich! Bitte logge dich ein.');
          usernameInput.value = '';
          emailInput.value = '';
          passwordInput.value = '';
          confirmPasswordInput.value = '';
          window.location.href = '/login';
        },
        error: (error) => {
          alert(error.error?.error || error.message);
        },
      });
  }
}
