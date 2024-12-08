import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/http';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { FetchUserManagementList } from '../actions/user-management-action';
import { tap } from 'rxjs/operators';

interface IUserManagementModel {
  userManagementList: IUserManagementList[];
  userManagementListCount: number;
}

@State<IUserManagementModel>({
  name: 'userManagementState',
  defaults: {
    userManagementList: [],
    userManagementListCount: 0,
  },
})
@Injectable()
export class userManagementState {
  constructor(private _http: HttpService, private _toastr: ToastrService) {}

  @Selector()
  static userManagementList(state: IUserManagementModel) {
    return state.userManagementList;
  }

  @Selector()
  static userManagementListCount(state: IUserManagementModel) {
    return state.userManagementListCount;
  }

  @Action(FetchUserManagementList)
  FetchUserManagementList(
    ctx: StateContext<IUserManagementModel>,
    { param }: FetchUserManagementList
  ) {
    return this._http.post('auth/list-users', param).pipe(
      tap((apiResult) => {
        const result = apiResult.response.dataset;
        ctx.patchState({
          userManagementList: result.users,
          userManagementListCount: result.total_count,
        });
        this._toastr.success(apiResult.response.status.message, 'success', {
          closeButton: true,
          timeOut: 3000,
        });
      })
    );
  }
}
