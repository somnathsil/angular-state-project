import {
  take,
  filter,
  timeout,
  finalize,
  switchMap,
  Observable,
  catchError,
  throwError,
} from 'rxjs';
import {
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpStatusCode,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { appSettings } from '@app/configs';
import { AuthenticationService } from '@core/authentication';
import { environment } from '@env/environment';
import { CommonService } from '../services';
import { LoadingBarService } from '@ngx-loading-bar/core';

export const httpErrorHandlerInterceptorFn: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const timeOut = appSettings.ajaxTimeout;
  const regenerateTokenUrl = `${environment.host}/user/regenerate-token`;
  const _router = inject(Router);
  const _authService = inject(AuthenticationService);
  const _commonService = inject(CommonService);
  const _loader = inject(LoadingBarService);

  return next(request).pipe(
    timeout(timeOut),
    catchError((error) => errorHandler(error, request, next))
  );

  /* Handling error based on response codes */
  function errorHandler(
    error: HttpErrorResponse,
    request: HttpRequest<any>,
    next: HttpHandlerFn
  ): Observable<HttpEvent<any>> {
    /* in development mode printing errors in console */
    const httpErrorCode: number = error['status'];

    /* if generate refresh token api get 401(Unauthorized) error just logout */
    if (
      httpErrorCode === HttpStatusCode.Unauthorized &&
      request.url === regenerateTokenUrl
    ) {
      _authService.logout();
      _router.navigate(['/']);
    }

    switch (httpErrorCode) {
      case HttpStatusCode.BadRequest:
        return throwError(() => error);
      case HttpStatusCode.Unauthorized:
        return handle401Error(request, error, next);
      case HttpStatusCode.Forbidden:
        return handle403Error(error);
      case HttpStatusCode.NotFound:
        return handle404Error(error);
      case HttpStatusCode.InternalServerError:
        return throwError(() => error);
      default:
        return throwError(() => error);
    }
  }

  /** Handle 401 error **/
  function handle401Error(
    request: HttpRequest<any>,
    error: HttpErrorResponse,
    next: HttpHandlerFn
  ): Observable<HttpEvent<any>> {
    /**
     * If user not logged in no need to handle 401
     */
    if (!_authService.isAuthenticated()) {
      _authService.logout();
      _router.navigate(['/']);
      return throwError(() => error);
    }

    /**
     * if token invalid then call regenerate token ${new token}
     */

    if (!_commonService.isRefreshToken) {
      _commonService.isRefreshToken = true;
      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      _commonService.saveInterceptorToken(null);
      return _authService.getRefreshToken().pipe(
        switchMap((apiResult) => {
          const data = apiResult.response.dataset;
          _authService.updateRefreshedToken(data);

          _commonService.saveInterceptorToken(data.access_token);
          return next(addTokenInHeader(request, data.access_token));
        }),
        catchError((error) => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          if (error.url === regenerateTokenUrl) {
            _authService.logout();
            _router.navigate(['/']);
          } else _commonService.isRefreshToken = false;
          return throwError(() => error);
        }),
        finalize(() => {
          _commonService.isRefreshToken = false;
        })
      );
    } else {
      return _commonService.intTokenSource$.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          return next(addTokenInHeader(request, token as string));
        })
      );
    }
  }

  /** Handle 403 error **/
  function handle403Error(
    error: HttpErrorResponse
  ): Observable<HttpEvent<any>> {
    _router.navigate(['/forbidden']); // redirect to forbidden page
    return throwError(() => error);
  }

  /** Handle 404 error **/
  function handle404Error(
    error: HttpErrorResponse
  ): Observable<HttpEvent<any>> {
    _router.navigate(['/not-found']); // redirect to 404 page not found
    return throwError(() => error);
  }

  function addTokenInHeader(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    return request.clone({
      setHeaders: { Authorization: 'Bearer ' + token },
    });
  }
};
