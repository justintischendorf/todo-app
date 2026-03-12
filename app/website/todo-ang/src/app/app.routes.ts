import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'home', component: Homepage, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'register', component: Register },
];
