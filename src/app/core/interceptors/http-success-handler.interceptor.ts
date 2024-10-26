import {
  HttpEvent,
  HttpRequest,
  HttpResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, map } from 'rxjs';

export const httpSuccessHandlerInterceptorFn: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const encryptedRequest = false;

  /* Intercepting success requests */
  return next(request).pipe(
    map((response: HttpEvent<any>) => {
      if (response instanceof HttpResponse) {
        const statusCode: number = response['status'];
        const responseObject = response.body;
        responseObject.status = statusCode;
      }
      return response;
    })
  );
};
