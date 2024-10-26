import {
  httpErrorHandlerInterceptorFn,
  httpHeaderHandlerInterceptorFn,
  httpSuccessHandlerInterceptorFn,
} from '@core/interceptors';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// the better way (more future proof) is to use interceptor functions

export const HttpProviders = [
  provideHttpClient(
    // do this, to keep using your class-based interceptors.
    withInterceptors([
      httpErrorHandlerInterceptorFn,
      httpHeaderHandlerInterceptorFn,
      httpSuccessHandlerInterceptorFn,
    ])
  ),
];
