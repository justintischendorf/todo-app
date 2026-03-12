import { Component } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.html',
  styleUrl: './stars.css',
})
export class Stars {
  readonly starCount = Array(50);
}
