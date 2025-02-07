import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/http';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import {
  AddPolicy,
  AllPolicyList,
  DeletePolicy,
  EditPolicy,
} from '../actions/settings.action';
import { tap } from 'rxjs';
import { patch, removeItem } from '@ngxs/store/operators';

interface ISettingsModel {
  policyList: IPolicyList[];
  policyListCount: number;
}

@State<ISettingsModel>({
  name: 'settingsState',
  defaults: {
    policyList: [],
    policyListCount: 0,
  },
})
@Injectable()
export class SettingsState {
  constructor(private _http: HttpService, private _toastr: ToastrService) {}

  @Selector()
  static policyList(state: ISettingsModel) {
    return state.policyList;
  }
  @Selector()
  static policyListCount(state: ISettingsModel) {
    return state.policyListCount;
  }

  @Action(AllPolicyList)
  AllPolicyList(ctx: StateContext<ISettingsModel>, { param }: AllPolicyList) {
    return this._http.post('policies/list', param).pipe(
      tap((apiResult) => {
        const result = apiResult.response.dataset;
        ctx.patchState({
          policyList: result.policies,
          policyListCount: result.total_count,
        });
        // this._toastr.success(apiResult.response.status.message, 'success', {
        //   closeButton: true,
        //   timeOut: 3000,
        // });
      })
    );
  }

  @Action(DeletePolicy)
  DeletePolicy(ctx: StateContext<ISettingsModel>, { param }: DeletePolicy) {
    return this._http.post('policies/delete', param).pipe(
      tap((apiResult) => {
        ctx.setState(
          patch({
            policyList: removeItem<IPolicyList>((item) => item.id === param.id),
          })
        );
        this._toastr.success(apiResult.response.status.message, 'success', {
          closeButton: true,
          timeOut: 3000,
        });
      })
    );
  }

  @Action(AddPolicy)
  AddPolicy(ctx: StateContext<ISettingsModel>, { param }: AddPolicy) {
    return this._http.post('policies/add', param).pipe(
      tap((apiResult) => {
        this._toastr.success(apiResult.response.status.message, 'success', {});
      })
    );
  }

  @Action(EditPolicy)
  EditPolicy(ctx: StateContext<ISettingsModel>, { param }: EditPolicy) {
    return this._http.post('policies/edit', param).pipe(
      tap((apiResult) => {
        // const resultData = apiResult.response.dataset;
        // ctx.patchState({
        //   settingsPolicyId: resultData.id,
        // });
        this._toastr.success(apiResult.response.status.message, 'success', {});
      })
    );
  }
}
