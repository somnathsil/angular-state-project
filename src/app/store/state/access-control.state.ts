import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  AddDepartment,
  AddRole,
  DeleteDepartment,
  DeleteRole,
  EditDepartment,
  EditRole,
  FetchDepartmentList,
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
  departmentList: IDepartmentList[];
  departmentListCount: number;
}

@State<IAccessControlModel>({
  name: 'accessControlState',
  defaults: {
    roleList: [],
    roleListCount: 0,
    departmentList: [],
    departmentListCount: 0,
  },
})
@Injectable()
export class AccessControlState {
  constructor(private _http: HttpService, private _toastr: ToastrService) {}

  @Selector()
  static roleList(state: IAccessControlModel) {
    return state.roleList;
  }
  @Selector()
  static roleListCount(state: IAccessControlModel) {
    return state.roleListCount;
  }
  @Selector()
  static departmentList(state: IAccessControlModel) {
    return state.departmentList;
  }
  @Selector()
  static departmentListCount(state: IAccessControlModel) {
    return state.departmentListCount;
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
        const roleTypeID = apiResult.response.dataset.id;
        let addedItem: IRoleList = {
          id: roleTypeID,
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

  @Action(FetchDepartmentList)
  FetchDepartmentList(
    ctx: StateContext<IAccessControlModel>,
    { param }: FetchDepartmentList
  ) {
    return this._http.post('department/list', param).pipe(
      tap((apiResult) => {
        console.log('Stttttaaaattteeee', apiResult);
        const result = apiResult.response.dataset;
        ctx.patchState({
          departmentList: result.roles,
          departmentListCount: result.total_count,
        });
        this._toastr.success(apiResult.response.status.message, 'success', {
          closeButton: true,
          timeOut: 3000,
        });
      })
    );
  }

  @Action(DeleteDepartment)
  DeleteDepartment(
    ctx: StateContext<IAccessControlModel>,
    { param }: DeleteDepartment
  ) {
    return this._http.post('department/delete', param).pipe(
      tap((apiResult) => {
        ctx.setState(
          patch({
            departmentList: removeItem<IDepartmentList>(
              (item) => item.id === param.id
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

  @Action(AddDepartment)
  AddDepartment(
    ctx: StateContext<IAccessControlModel>,
    { param }: AddDepartment
  ) {
    return this._http.post('department/add', param).pipe(
      tap((apiResult) => {
        const state = ctx.getState();
        const departmentTypeListCount = state.departmentListCount;
        const departmentTypeID = apiResult.response.dataset.department.id;
        let addedItem: IDepartmentList = {
          id: departmentTypeID,
          name: param.name,
          status: param.status,
          numberOfEmployees: param.number_of_employees,
        };
        ctx.setState(
          patch<IAccessControlModel>({
            departmentListCount: departmentTypeListCount + 1,
            departmentList: insertItem<IDepartmentList>(addedItem),
          })
        );
        this._toastr.success(apiResult.response.status.message, 'success', {
          closeButton: true,
          timeOut: 3000,
        });
      })
    );
  }

  @Action(EditDepartment)
  EditDepartment(
    ctx: StateContext<IAccessControlModel>,
    { param }: EditDepartment
  ) {
    return this._http.post('department/edit', param).pipe(
      tap((apiResult) => {
        const departmentTypeID = apiResult.response.dataset.department.id;
        ctx.setState(
          patch<IAccessControlModel>({
            departmentList: updateItem<IDepartmentList>(
              (item) => item.id === param.id,
              patch({
                id: departmentTypeID,
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
