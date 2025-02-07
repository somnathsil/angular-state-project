import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/http';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import {
  ChangePassword,
  EditProfile,
  GetProfileData,
} from '../actions/profile.action';

interface IProfileModel {
  profileData: IProfileData | null;
}

@State<IProfileModel>({
  name: 'profiletState',
  defaults: {
    profileData: null,
  },
})
@Injectable()
export class ProfiletState {
  constructor(private _http: HttpService, private _toastr: ToastrService) {}

  @Selector()
  static profileData(state: IProfileModel) {
    return state.profileData;
  }

  @Action(ChangePassword)
  ChangePassword(ctx: StateContext<IProfileModel>, { param }: ChangePassword) {
    return this._http.post('auth/change-password', param).pipe(
      tap((apiResult) => {
        this._toastr.success(apiResult.response.status.message, 'success', {
          closeButton: true,
          timeOut: 3000,
        });
      })
    );
  }

  @Action(GetProfileData)
  GetProfileData(ctx: StateContext<IProfileModel>) {
    return this._http.post('auth/view-profile', {}).pipe(
      tap((apiResult) => {
        const resultData = apiResult.response.dataset;
        ctx.patchState({
          profileData: resultData,
        });
        this._toastr.success(apiResult.response.status.message, 'success', {
          closeButton: true,
          timeOut: 3000,
        });
      })
    );
  }

  @Action(EditProfile)
  EditProfile(ctx: StateContext<IProfileModel>, { param }: EditProfile) {
    return this._http.post('auth/edit-profile', param).pipe(
      tap((apiResult) => {
        ctx.patchState({
          profileData: {
            ...param,
          },
        });
        this._toastr.success(apiResult.response.status.message, 'success', {
          closeButton: true,
          timeOut: 3000,
        });
      })
    );
  }
}
