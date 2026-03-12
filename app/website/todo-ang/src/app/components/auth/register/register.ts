import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Stars } from '../../shared/stars/stars';

@Component({
  selector: 'app-register',
  imports: [Stars, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  onRegister(
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
    usernameInput: HTMLInputElement,
    emailInput: HTMLInputElement,
    passwordInput: HTMLInputElement,
    confirmPasswordInput: HTMLInputElement,
  ): void {
    if (password !== confirmPassword) {
      alert('Passwörter stimmen nicht überein!');
      return;
    }
    this.authService.register(username, email, password).subscribe({
      next: () => {
        alert('Registrierung erfolgreich! Bitte logge dich ein.');
        usernameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        confirmPasswordInput.value = '';
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert(error.error?.error || error.message);
      },
    });
  }
}
