import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

const TOKEN_KEY = 'stayadmin_token';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem(TOKEN_KEY);
  const isLoginRequest = req.url.includes('/auth/login');

  const authReq =
    token && !isLoginRequest
      ? req.clone({
          setHeaders: {
            Authorization: `bearer ${token}`,
          },
        })
      : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isLoginRequest) {
        localStorage.removeItem(TOKEN_KEY);
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};