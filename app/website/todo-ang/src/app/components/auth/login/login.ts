import { Component, inject } from '@angular/core';
import { LoginService } from '../../../services/authService/login/login-service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrls: ['./login.css', './stars.css'],
})
export class Login {
  loginService = inject(LoginService);
}
