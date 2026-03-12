import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../environment';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const http = inject(HttpClient);
  const router = inject(Router);

  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  let authReq = req.clone({ withCredentials: true });

  const token = authService.getAccessToken();
  if (token && !req.url.includes('/auth/refresh') && !req.url.includes('/auth/logout')) {
    authReq = authReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return http
          .post<{ accessToken: string }>(
            `${environment.apiUrl}/auth/refresh`,
            {},
            { withCredentials: true },
          )
          .pipe(
            switchMap((res) => {
              authService.setAccessToken(res.accessToken);
              const retryReq = req.clone({
                withCredentials: true,
                setHeaders: { Authorization: `Bearer ${res.accessToken}` },
              });
              return next(retryReq);
            }),
            catchError(() => {
              authService.clear();
              router.navigate(['/login']);
              return throwError(() => error);
            }),
          );
      }
      return throwError(() => error);
    }),
  );
};
