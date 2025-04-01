import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/http';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import {
  AddPolicy,
  AddServiceType,
  AllPolicyList,
  AllServiceTypeList,
  DeletePolicy,
  DeleteServiceType,
  EditPolicy,
  EditServiceType,
  FetchMothList,
} from '../actions/settings.action';
import { tap } from 'rxjs';
import { patch, removeItem } from '@ngxs/store/operators';

interface ISettingsModel {
  policyList: IPolicyList[];
  policyListCount: number;
  serviceTypeList: IServiceTypeList[];
  serviceTypeListCount: number;
  monthForServiceTye: IMasterMonthList[];
}

@State<ISettingsModel>({
  name: 'settingsState',
  defaults: {
    policyList: [],
    policyListCount: 0,
    serviceTypeList: [],
    serviceTypeListCount: 0,
    monthForServiceTye: [],
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

  @Selector()
  static serviceTypeList(state: ISettingsModel) {
    return state.serviceTypeList;
  }
  @Selector()
  static serviceTypeListCount(state: ISettingsModel) {
    return state.serviceTypeListCount;
  }

  @Selector()
  static monthForServiceTye(state: ISettingsModel) {
    return state.monthForServiceTye;
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

  @Action(AllServiceTypeList) AllServiceTypeList(
    ctx: StateContext<ISettingsModel>,
    { param }: AllServiceTypeList
  ) {
    return this._http.post('service-types/list', param).pipe(
      tap((apiResult) => {
        const result = apiResult.response.dataset;
        ctx.patchState({
          serviceTypeList: result.serviceTypes,
          serviceTypeListCount: result.total_count,
        });
      })
    );
  }

  @Action(DeleteServiceType)
  DeleteServiceType(
    ctx: StateContext<ISettingsModel>,
    { param }: DeleteServiceType
  ) {
    return this._http.post('service-types/delete', param).pipe(
      tap((apiResult) => {
        ctx.setState(
          patch({
            serviceTypeList: removeItem<IServiceTypeList>(
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

  @Action(AddServiceType)
  AddServiceType(ctx: StateContext<ISettingsModel>, { param }: AddServiceType) {
    return this._http.post('service-types/add', param).pipe(
      tap((apiResult) => {
        // const listparam = ctx.getState()?.serviceTypeListCount;
        // if (listparam) ctx.dispatch(new AllServiceTypeList(listparam));
        this._toastr.success(apiResult.response.status.message, 'success', {});
      })
    );
  }

  @Action(EditServiceType)
  EditServiceType(
    ctx: StateContext<ISettingsModel>,
    { param }: EditServiceType
  ) {
    return this._http.post('service-types/edit', param).pipe(
      tap((apiResult) => {
        this._toastr.success(apiResult.response.status.message, 'success', {});
      })
    );
  }

  @Action(FetchMothList) FetchMothList(
    ctx: StateContext<ISettingsModel>,
    {}: FetchMothList
  ) {
    return this._http.get('service-types/master-months').pipe(
      tap((apiResult) => {
        const result = apiResult.response.dataset.months;
        ctx.patchState({
          monthForServiceTye: result,
        });
      })
    );
  }
}
