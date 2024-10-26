import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  /* token backup for reuse token */
  private _tokenSubject = new BehaviorSubject<string | null>(null);
  public tokenSource$ = this._tokenSubject.asObservable();

  /**
   * *Save token to the subject
   *
   * @param {string} token - The token to be saved. Can be a string or null to
   *
   *
   */
  public saveToken(type: string | null) {
    this._tokenSubject.next(type);
  }

  /* title addon for dynamic title */
  private _titleAddonSubject = new Subject<string | null>();
  public pageTitleAddon$ = this._titleAddonSubject.asObservable();

  /**
   * *Setting title addon to the subject
   *
   * @param {string} addon - The addon to be appended to the page title. Can be a string or null to
   *
   *
   */
  public setPageTitleAddon(addon: string | null): void {
    this._titleAddonSubject.next(addon);
  }

  /**
   * Setting Loader status
   */
  private _loaderSubject = new BehaviorSubject<boolean>(true);
  public loaderSource$ = this._loaderSubject.asObservable();

  public setLoadingStatus(type: boolean): void {
    this._loaderSubject.next(type);
  }

  /* Set access controls *ACL* */
  private accessControls: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public accessControls$ = this.accessControls.asObservable();

  public setAccessControls(data: any) {
    this.accessControls.next(data);
  }

  /**  refresh token   **/
  public isRefreshToken = false;
  private _intTokenSubject = new BehaviorSubject<string | null>(null);
  public intTokenSource$ = this._intTokenSubject.asObservable();

  /**
   * *Save token to the subject
   *
   * @param {string} token - The token to be saved. Can be a string or null to
   *
   */
  public saveInterceptorToken(type: string | null) {
    this._intTokenSubject.next(type);
  }

  /** Manage Client */
  private _manageClientSidebarSubject: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  public _manageClientSidebarSubject$ =
    this._manageClientSidebarSubject.asObservable();

  public setManageClientSidebarSubject(data: boolean) {
    this._manageClientSidebarSubject.next(data);
  }
}
