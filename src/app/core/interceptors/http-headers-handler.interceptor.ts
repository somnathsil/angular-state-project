import {
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { Inject, inject } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { AuthenticationService } from '../authentication';

export const httpHeaderHandlerInterceptorFn: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loadingBar = inject(LoadingBarService);
  const _authService = inject(AuthenticationService);
  /* Adding Authorization token in header */
  const headersConfig: { Authorization?: string } = {};
  const token: string = _authService.getToken();

  /* If token found setting it in header */
  // const token = 'test token';

  /**
   * If token available set headers
   *
   *
   */
  if (token) {
    headersConfig['Authorization'] = 'Bearer ' + token;
  }

  loadingBar.useRef().start();
  const HTTPRequest = request.clone({ setHeaders: headersConfig });
  // return next(HTTPRequest);

  return next(HTTPRequest).pipe(
    finalize(() => loadingBar.useRef().complete()),
    catchError((error: any) => {
      loadingBar.useRef().complete();
      return throwError(() => error);
    })
  );
};
