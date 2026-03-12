import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(username: string, email: string, password: string): Observable<{ accessToken: string; userId: string }> {
    return this.http
      .post<{ accessToken: string; userId: string }>(
        `${environment.apiUrl}/auth/login`,
        { username, email, password },
        { withCredentials: true },
      )
      .pipe(tap((res) => this.setAccessToken(res.accessToken)));
  }

  register(username: string, email: string, password: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/register`, {
      username,
      email,
      password,
    });
  }

  logout(): void {
    this.http
      .post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        complete: () => this.onLoggedOut(),
        error: () => this.onLoggedOut(),
      });
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  clear(): void {
    this.accessToken = null;
  }

  private onLoggedOut(): void {
    this.accessToken = null;
    this.router.navigate(['/login']);
  }
}
