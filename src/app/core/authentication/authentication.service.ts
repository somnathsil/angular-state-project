import { HttpService } from '@core/http';
import { Injectable } from '@angular/core';
import { appSettings } from '@app/configs';
import { Observable, mergeMap, of, tap } from 'rxjs';
import { CommonService } from '@core/services';
import { CookieService } from 'ngx-cookie-service';
import { HttpStatusCode } from '@angular/common/http';
// import { HttpStatusCode } from '@angular/common/http';
// import { browserInfo } from '@app/shared/utilities';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private credentials: string = appSettings.credentialsKey;

  constructor(
    private _http: HttpService,
    private _commonService: CommonService,
    private _cookieService: CookieService
  ) {}

  public authenticate(data: IAuthParam, remember_me: boolean) {
    let param = { ...data };

    return this._http.post('auth/login', param).pipe(
      tap((result) => {
        const authData: IAuthResponse = result.response.dataset;
        if (result.status === HttpStatusCode.Ok) {
          const storedData: string = this._cookieService.get(
            appSettings.rememberKey
          );
          this._cookieService.deleteAll();

          if (remember_me) {
            this._cookieService.delete(appSettings.rememberKey, '/');
            this._cookieService.set(
              appSettings.rememberKey,
              JSON.stringify(param),
              {
                path: '/',
                expires: 365,
                sameSite: 'Lax',
              }
            );
          } else {
            this._cookieService.delete(appSettings.rememberKey, '/');
          }

          this._cookieService.set(
            this.credentials,
            JSON.stringify({ ...authData }),
            {
              path: '/',
              expires: 365,
              sameSite: 'Lax',
            }
          );
          // take token backup
          this._commonService.saveToken(JSON.stringify({ ...authData }));
        }
      })
    );
  }

  /**
   * *Handling registration
   *
   * @param param email for registration
   * @returns observable
   *
   */
  public registration(param: IRegistrationParam): Observable<unknown> {
    return this._http.post('auth/register', param);
  }

  /**
   * *Handling forget password
   *
   * @param param email for forget password
   * @returns observable
   *
   */
  public forgetPassword(param: IForgetPasswordParam) {
    return this._http.post('auth/forgot-password', param);
  }

  /**
   * *Handling enter otp
   *
   * @param param email for enter otp
   * @returns observable
   *
   */
  public enterOTP(param: IOtpParam) {
    return this._http.post('auth/verify-otp', param);
  }

  /**
   * *Handling resend otp
   *
   * @param param email for resend otp
   * @returns observable
   *
   */
  public resendOTP(param: IResendOtpParam) {
    return this._http.post('auth/resend-otp', param);
  }

  /**
   * *Resetting user password
   *
   * @param data for reset pwd
   * @returns observable
   *
   */
  public resetPassword(data: IResetPWDParam) {
    return this._http.post('auth/reset-password', data);
  }

  /**
   * *Creating user password
   *
   * @param data for reset pwd
   * @returns observable
   *
   */
  public createPassword(data: ICreatePWDParam): Observable<unknown> {
    return this._http.post('generatePwd', data);
  }

  /**
   * *getting user from storage
   *
   * @returns current user's data
   *
   */
  public getUser(): IAuthResponse {
    const user = this._cookieService.get(this.credentials);
    const savedCredentials: IAuthResponse =
      user !== '' ? JSON.parse(user) : null;
    // take token backup
    if (user) this._commonService.saveToken(user);
    return savedCredentials;
  }

  /**
   * *Returning current user detail from storage
   *
   * @returns observable of current user
   *
   */
  public getUserInfo(): Observable<IAuthResponse> {
    const savedCredentials: IAuthResponse = this.getUser();
    return of(savedCredentials);
  }

  /**
   * *Getting current user token from cookie
   *
   * @returns JWT Token
   *
   */
  public getToken(): string {
    const savedCredentials: IAuthResponse = this.getUser();
    return savedCredentials != null ? savedCredentials.accessToken : '';
  }

  /**
   * *Getting current user type from cookie
   *
   * @returns User Type
   *
   */
  // public getUserType(): string {
  //   const userInfo: IAuthResponse = this.getUser();
  //   if (userInfo !== null) {
  //     return userInfo.user_type ? userInfo.user_type : '';
  //   }
  //   return '';
  // }

  /* Removing current user detail from storage */
  private clearUserInfo() {
    this._cookieService.delete(this.credentials);
    this._cookieService.delete(this.credentials, '/');
  }

  /**
   * *Sign outs user
   * *Removes details from the token storage
   *
   * @returns observable of boolean
   *
   */
  public logout() {
    // if api call is require please call here
    this.clearUserInfo();
  }

  /**
   * *If user is authenticated
   *
   * @returns boolean if authenticated
   *
   */
  public isAuthenticated() {
    if (this._cookieService.get(this.credentials)) {
      return true;
    }
    return false;
  }

  /**
   * *Generate new token
   *
   * @returns refresh token
   *
   */
  public getRefreshToken() {
    const userInfo = this.getUser();
    const param: IRegenerateTokenParam = {
      // browser_id: browserInfo().browser_id,
      refresh_token: userInfo.refreshToken,
      // browser_name: browserInfo().browser_name,
      // browser_version: browserInfo().browser_version,
    };
    return this._http.post('user/regenerate-token', param);
  }

  /**
   * *Updating new tokens in cookie
   *
   * @param authData refresh auth result
   *
   */
  public updateRefreshedToken(authData: IAuthResponse): void {
    const savedCredentials: IAuthResponse = this.getUser();
    // get remember me
    // const rememberMe = this._cookieService.get(appSettings.rememberKey);
    const updated = {
      ...savedCredentials,
      ...authData,
    };
    // delete cookie before delete
    // this._cookieService.deleteAll();
    // set cookie
    // if (rememberMe)
    //   this._cookieService.set(appSettings.rememberKey, rememberMe, {
    //     path: '/',
    //   });
    this._cookieService.set(this.credentials, JSON.stringify(updated), {
      path: '/',
    });
    // take token backup
    this._commonService.saveToken(JSON.stringify(updated));
  }
}
