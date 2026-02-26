import { Component, inject, OnInit } from '@angular/core';
import { Todo } from './todo/todo';
import { HomepageService } from '../../services/homepageService/homepage-service';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [Todo],
  templateUrl: './homepage.html',
  styleUrls: ['./homepage.css'],
})
export class Homepage implements OnInit {
  homepageService = inject(HomepageService);

  ngOnInit() {
    this.homepageService.refreshTodos();
  }
}