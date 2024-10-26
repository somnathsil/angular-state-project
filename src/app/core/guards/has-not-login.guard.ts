import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { AuthenticationService } from '../authentication';
import { Router, UrlTree, CanActivateFn } from '@angular/router';

export const hasNotLoginGuard: CanActivateFn = ():
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  /**
   * *Auth Guard for prevent user to visit after login pages
   *
   *
   */
  const _router: Router = inject(Router);
  const _authService: AuthenticationService = inject(AuthenticationService);
  if (_authService.isAuthenticated()) {
    _router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
