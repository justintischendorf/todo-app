import { Component, inject, OnInit } from '@angular/core';
import { Todo } from './todo/todo';
import { HomepageService } from '../../services/homepageService/homepage-service';
import { LoginService } from '../../services/authService/login/login-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [Todo],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css', 'stars.css'],
})
export class Homepage implements OnInit {
  homepageService = inject(HomepageService);
  private loginService = inject(LoginService);
  private router = inject(Router);

  ngOnInit() {
    const token = this.loginService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.homepageService.refreshTodos();
  }
}
