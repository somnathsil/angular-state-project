import { Subscription } from 'rxjs';
import { appSettings } from '@app/configs';
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from '@app/core/services/common.service';
import { Input, OnInit, Directive, OnDestroy, ElementRef } from '@angular/core';
interface MainMenu {
  value: boolean;
  action: Action[];
  menu_id: number;
  sub_menu: SubMenu[];
  main_menu: string;
}

interface SubMenu {
  value: boolean;
  action: Action[];
  sub_menu_id: number;
  sub_menu_name: string;
}

interface Action {
  name: string;
  value: boolean;
  action_id: number;
}
@Directive({
  selector: '[accessControl]',
  standalone: true,
})
export class AccessControlDirective implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private accessControls: MainMenu[] = [];
  private credentials: string = appSettings.credentialsKey;
  @Input('moduleId') moduleId!: number | string;
  @Input('actionId') actionId!: number | string;
  @Input('submoduleId') submoduleId!: number | string;

  constructor(
    private _common: CommonService,
    private elementRef: ElementRef,
    private _cookieService: CookieService
  ) {}

  ngOnInit() {
    const savedCredentials = this._cookieService.get(
      this.credentials
    ) as string;
    const userInfo: IAuthResponse | null =
      savedCredentials !== '' ? JSON.parse(savedCredentials) : null;

    // if (userInfo && String(userInfo.user_type) !== '1') {
    this.subscriptions.push(
      this._common.accessControls$.subscribe((data) => {
        if (data) {
          this.accessControls = data;
          if (this.accessControls && this.accessControls.length) {
            this.checkAccess();
          }
        }
      })
    );
    // }
  }

  checkAccess() {
    let checkModule: any;
    if (this.moduleId) {
      for (let i = 0; i < this.accessControls.length; i++) {
        if (this.accessControls[i].menu_id == this.moduleId) {
          checkModule = this.accessControls[i];
          break;
        }
      }
    } else if (this.submoduleId) {
      for (let i = 0; i < this.accessControls.length; i++) {
        if (this.accessControls[i].sub_menu.length) {
          for (let j = 0; j < this.accessControls[i].sub_menu.length; j++) {
            if (
              this.accessControls[i].sub_menu[j].sub_menu_id == this.submoduleId
            ) {
              checkModule = this.accessControls[i].sub_menu[j];
              break;
            }
          }
        } else {
          for (let k = 0; k < this.accessControls[i].action.length; k++) {
            if (
              this.accessControls[i].action[k].action_id == this.submoduleId
            ) {
              checkModule = this.accessControls[i].action[k];
              break;
            }
          }
        }
      }
    } else if (this.actionId) {
      for (let i = 0; i < this.accessControls.length; i++) {
        if (this.accessControls[i].sub_menu.length) {
          for (let j = 0; j < this.accessControls[i].sub_menu.length; j++) {
            if (this.accessControls[i].sub_menu[j].action.length) {
              for (
                let k = 0;
                k < this.accessControls[i].sub_menu[j].action.length;
                k++
              ) {
                if (
                  this.accessControls[i].sub_menu[j].action[k].action_id ==
                  this.actionId
                ) {
                  checkModule = this.accessControls[i].sub_menu[j].action[k];
                  break;
                }
              }
            }
          }
        }
      }
    }

    // if (checkModule != undefined && this.moduleId != 1) {
    //   this.elementRef.nativeElement.style.opacity =
    //     checkModule.value === true ? '1' : '0';
    //   this.elementRef.nativeElement.style.display =
    //     checkModule.value === true ? '' : 'none';
    // }

    // handle visibility of the element
    if (checkModule != undefined) {
      if (this.elementRef.nativeElement.style) {
        this.elementRef.nativeElement.style.opacity =
          checkModule.value === true ? '1' : '0';
      }
      if (this.elementRef.nativeElement.style)
        this.elementRef.nativeElement.style.display =
          checkModule.value === true ? '' : 'none';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
