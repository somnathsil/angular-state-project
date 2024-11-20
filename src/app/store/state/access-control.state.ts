import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  AddRole,
  DeleteRole,
  EditRole,
  FetchRoleList,
} from '../actions/access-control.action';
import { pipe, tap } from 'rxjs';
import { HttpService } from '@app/core/http';
import { ToastrService } from 'ngx-toastr';
import {
  insertItem,
  patch,
  removeItem,
  updateItem,
} from '@ngxs/store/operators';

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
          roleList: result.roles,
          roleListCount: result.total_count,
        });
        this._toastr.success(apiResult.response.status.message, 'success', {
          closeButton: true,
          timeOut: 3000,
        });
      })
    );
  }

  @Action(DeleteRole)
  DeleteRole(ctx: StateContext<IAccessControlModel>, { param }: DeleteRole) {
    return this._http.post('role/delete', param).pipe(
      tap((apiResult) => {
        ctx.setState(
          patch({
            roleList: removeItem<IRoleList>((item) => item.id === param.id),
          })
        );
        this._toastr.success(apiResult.response.status.message, 'success', {
          closeButton: true,
          timeOut: 3000,
        });
      })
    );
  }

  @Action(AddRole)
  AddRole(ctx: StateContext<IAccessControlModel>, { param }: AddRole) {
    return this._http.post('role/add', param).pipe(
      tap((apiResult) => {
        const state = ctx.getState();
        const roleTypeListCount = state.roleListCount;
        let addedItem: IRoleList = {
          id: apiResult.response.dataset.id,
          name: param.name,
          status: param.status,
          numberOfEmployees: param.number_of_employees,
        };
        ctx.setState(
          patch<IAccessControlModel>({
            roleListCount: roleTypeListCount + 1,
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

  @Action(EditRole)
  EditRole(ctx: StateContext<IAccessControlModel>, { param }: EditRole) {
    return this._http.post('role/edit', param).pipe(
      tap((apiResult) => {
        const roleTypeID = apiResult.response.dataset.id;
        ctx.setState(
          patch<IAccessControlModel>({
            roleList: updateItem<IRoleList>(
              (item) => item.id === param.id,
              patch({
                id: roleTypeID,
                name: param.name,
                status: param.status,
                numberOfEmployees: param.number_of_employees,
              })
            ),
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
