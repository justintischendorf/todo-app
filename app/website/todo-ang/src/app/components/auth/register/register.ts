import { Component, inject } from '@angular/core';
import { RegisterService } from '../../../services/authService/registration/register-service';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.html',
  styleUrls: ['./register.css', './stars.css'],
})
export class Register {
  registrationService = inject(RegisterService);
}
