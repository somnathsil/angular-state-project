import {
  Router,
  ResolveFn,
  // RouterStateSnapshot,
  // ActivatedRouteSnapshot,
} from '@angular/router';
import { inject } from '@angular/core';
import { HttpService } from '@core/http';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, map, of } from 'rxjs';
// import { AuthenticationService } from '@core/authentication';
import { CommonService } from '@core/services/common.service';
interface MainMenu {
  value: boolean;
  action: Action[];
  menu_id: number;
  sub_menu: SubMenu[];
  main_menu: string;
}

interface SubMenu {
  value: boolean;
  action: Action[];
  sub_menu_id: number;
  sub_menu_name: string;
}

interface Action {
  name: string;
  value: boolean;
  action_id: number;
}
export const viewPermissionResolverFn: ResolveFn<MainMenu | null> = ():
  | Observable<MainMenu | null>
  | Promise<MainMenu | null>
  | MainMenu => {
  const _router = inject(Router);
  const _toastr = inject(ToastrService);
  const _httpService = inject(HttpService);
  const _commonService = inject(CommonService);
  // const userInfo = inject(AuthenticationService).getUser();

  /**
   * Acl permission resolver
   * Call api for specific user type
   */

  // if (userInfo && String(userInfo.user_type) !== '1') {
  return _httpService.post('acl/check-all-permission', {}).pipe(
    map((apiResult) => {
      const accessControl = apiResult.response.dataset.permissions;
      _commonService.setAccessControls(accessControl);
      return accessControl;
    }),
    catchError((apiError) => {
      _router.navigate(['/forbidden']);
      _toastr.error(apiError.error.response.status.msg, 'error', {
        closeButton: true,
        timeOut: 3000,
      });
      return of(null);
    })
  );
  // } else {
  //   return of(null);
  // }
};
