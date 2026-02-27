import { Routes } from '@angular/router';
import { Homepage } from './components/homepage/homepage';
import { Login } from './components/login/login';

export const routes: Routes = [
  { path: 'home', component: Homepage },
  { path: 'login', component: Login },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
