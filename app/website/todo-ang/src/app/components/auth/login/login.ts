import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Stars } from '../../shared/stars/stars';

@Component({
  selector: 'app-login',
  imports: [Stars, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin(
    username: string,
    email: string,
    password: string,
    usernameInput: HTMLInputElement,
    emailInput: HTMLInputElement,
    passwordInput: HTMLInputElement,
  ): void {
    this.authService.login(username, email, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (error) => {
        usernameInput.value = '';
        emailInput.value = '';
        passwordInput.value = '';
        alert(error.error?.error || error.message);
      },
    });
  }
}
