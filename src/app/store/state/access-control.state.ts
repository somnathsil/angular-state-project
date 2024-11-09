import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { AddRole, FetchRoleList } from '../actions/access-control.action';
import { pipe, tap } from 'rxjs';
import { HttpService } from '@app/core/http';
import { ToastrService } from 'ngx-toastr';
import { insertItem, patch } from '@ngxs/store/operators';

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
        const result = apiResult.response.dataset;
        ctx.patchState({
          roleList: result,
          // roleListCount: result.total_rows,
        });
      })
    );
  }

  @Action(AddRole)
  AddRole(ctx: StateContext<IAccessControlModel>, { param }: AddRole) {
    return this._http.post('role/add', param).pipe(
      tap((apiResult) => {
        console.log('ddhdhdhdh', param);

        let addedItem: any = {
          name: param.name,
          status: param.status,
          number_of_employees: param.number_of_employees,
        };
        ctx.setState(
          patch({
            roleList: insertItem<IRoleList>(addedItem),
          })
        );
        this._toastr.success(apiResult.response.status.message, 'success', {
          closeButton: true,
          timeOut: 3000,
        });
      })
    );
  }
}
