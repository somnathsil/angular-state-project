import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { FetchRoleList } from '../actions/access-control.action';
import { pipe, tap } from 'rxjs';
import { HttpService } from '@app/core/http';
import { ToastrService } from 'ngx-toastr';

interface IAccessControlModel {
  roleList: IRoleList[];
  roleListCount: number;
}

@State<IAccessControlModel>({
  name: 'accessControlState',
  defaults: {
    roleList: [],
    roleListCount: 0,
  },
})
@Injectable()
export class AccessControlState {
  constructor(private _http: HttpService, private _toastr: ToastrService) {}

  @Selector()
  static roleList(state: IAccessControlModel) {
    return state.roleList;
  }

  @Action(FetchRoleList)
  FetchRoleList(
    ctx: StateContext<IAccessControlModel>,
    { param }: FetchRoleList
  ) {
    return this._http.post('role/list', param).pipe(
      tap((apiResult) => {
        console.log(apiResult);
      })
    );
  }
}
