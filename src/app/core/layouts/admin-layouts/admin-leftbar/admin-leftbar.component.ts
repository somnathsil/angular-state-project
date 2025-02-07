import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication';
import { CommonService } from '@app/core/services';
import { fadeAnimation, slideInOut } from '@app/shared/animations';
import { WarningDialogComponent } from '@app/shared/components/dialogs/components';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-leftbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-leftbar.component.html',
  styleUrl: './admin-leftbar.component.scss',
  animations: [slideInOut, fadeAnimation],
})
export class AdminLeftbarComponent implements OnInit, OnDestroy {
  public dialogRef!: MatDialogRef<any>;
  public menus: IMenu[] = [];
  private allMenus: IMenu[] = [];
  public footerProfileType = signal<boolean>(false);
  private subscriptions: Subscription[] = [];
  public userType!: any;
  constructor(
    private _router: Router,
    private _authService: AuthenticationService,
    private loadingbar: LoadingBarService,
    private _dialog: MatDialog,
    private _toastr: ToastrService,
    private _common: CommonService
  ) {
    this.getMenus();
    this.getRoute();
  }

  ngOnInit(): void {}

  /* Dynamic Menu and Submenus */
  getMenus() {
    this.menus = [
      {
        id: '0',
        label: 'dashboard',
        icon: './assets/scss/icons.svg#icon-enrollment',
        isActive: false,
        URl: '/dashboard',
        isSubMenuOpen: false,
        subMenus: [],
      },
      {
        id: '1',
        label: 'user management',
        icon: './assets/scss/icons.svg#icon-user-management',
        isActive: false,
        URl: '/user-management',
        isSubMenuOpen: false,
        subMenus: [],
      },
      {
        id: '2',
        label: 'access control',
        icon: './assets/scss/icons.svg#icon-access-control',
        isActive: false,
        URl: '',
        isSubMenuOpen: false,
        subMenus: [
          {
            id: '11',
            label: 'Roles',
            URl: '/access-control/roles',
            isActive: false,
            isSubMenuOpen: false,
            subMenus: [],
          },
          {
            id: '12',
            label: 'Department',
            URl: '/access-control/department',
            isActive: false,
            isSubMenuOpen: false,
            subMenus: [],
          },
        ],
      },
      {
        id: '6',
        label: 'drip',
        icon: './assets/scss/icons.svg#icon-drip',
        isActive: false,
        URl: '/drip/drip-list',
        isSubMenuOpen: false,
        subMenus: [],
      },
      {
        id: '8',
        label: 'client management',
        icon: './assets/scss/icons.svg#icon-client-management',
        isActive: false,
        URl: '/client-management',
        isSubMenuOpen: false,
        subMenus: [],
      },
      {
        id: '10',
        label: 'settings',
        icon: './assets/scss/icons.svg#icon-Settings',
        isActive: false,
        URl: '',
        isSubMenuOpen: false,
        subMenus: [
          {
            id: '14',
            label: 'Policy',
            URl: '/policy',
            isActive: false,
            isSubMenuOpen: false,
            subMenus: [],
          },
          {
            id: '15',
            label: 'Service Types',
            URl: '/settings/service',
            isActive: false,
            isSubMenuOpen: false,
            subMenus: [],
          },
          {
            id: '16',
            label: 'Project Types',
            URl: '/settings/project',
            isActive: false,
            isSubMenuOpen: false,
            subMenus: [],
          },
        ],
      },
    ];
    this.allMenus = JSON.parse(JSON.stringify(this.menus));
  }

  /**
   * * Getting Current Route and setting as active
   */
  getRoute() {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const URL = event.url;
        for (let i = 0; i < this.menus.length; i++) {
          const _menu = this.menus[i];
          // checking for main menu
          if (
            !_menu.subMenus.length &&
            (_menu.URl === URL ||
              _menu.URl === URL.substring(0, URL.lastIndexOf('#')) ||
              _menu.URl === URL.substring(0, URL.lastIndexOf('?')))
          ) {
            this.resetMenu(this.menus);
            _menu.isActive = true;
            _menu.isSubMenuOpen = true;
          }
          // checking for sub-menus
          if (_menu.subMenus.length) {
            for (let j = 0; j < _menu.subMenus.length; j++) {
              const _subMenuOne = _menu.subMenus[j];
              // level 1 submenu checking
              if (!_subMenuOne.subMenus.length) {
                if (
                  !_subMenuOne.subMenus.length &&
                  (_subMenuOne.URl === URL ||
                    _subMenuOne.URl ===
                      URL.substring(0, URL.lastIndexOf('#')) ||
                    _subMenuOne.URl === URL.substring(0, URL.lastIndexOf('?')))
                ) {
                  this.resetMenu(this.menus);
                  _menu.isActive = true;
                  _menu.isSubMenuOpen = true;
                  _subMenuOne.isActive = true;
                  _subMenuOne.isSubMenuOpen = true;
                }
              }
              if (_subMenuOne.subMenus.length) {
                for (let k = 0; k < _subMenuOne.subMenus.length; k++) {
                  const _subMenuTwo = _subMenuOne.subMenus[k];
                  // level 2 submenu checking
                  if (!_subMenuTwo.subMenus.length) {
                    if (
                      !_subMenuTwo.subMenus.length &&
                      (_subMenuTwo.URl === URL ||
                        _subMenuTwo.URl ===
                          URL.substring(0, URL.lastIndexOf('#')) ||
                        _subMenuTwo.URl ===
                          URL.substring(0, URL.lastIndexOf('?')))
                    ) {
                      this.resetMenu(this.menus);
                      _menu.isActive = true;
                      _menu.isSubMenuOpen = true;
                      _subMenuOne.isActive = true;
                      _subMenuOne.isSubMenuOpen = true;
                      _subMenuTwo.isActive = true;
                      _subMenuTwo.isSubMenuOpen = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  resetMenu(menus: IMenu[]) {
    menus.forEach((menu) => {
      menu.isActive = false;
      menu.isSubMenuOpen = false;
      this.resetMenu(menu.subMenus);
    });
  }

  /**
   * *Getting Toggle Dropdown Menu
   */
  toggleSubMenu(event: Event, selectedId: string, type: number = 0) {
    event.preventDefault();
    // 1 => menu with submenu
    // 2 => menu without submenu
    // 3 => submenu with sub-submenu
    // 4 => menu without sub-submenu
    switch (type) {
      case 1:
      case 2:
        this.menus.forEach((_menu) => {
          if (_menu.id === selectedId) {
            _menu.isSubMenuOpen = !_menu.isSubMenuOpen;
          } else {
            _menu.isSubMenuOpen = false;
            _menu.subMenus.forEach(
              (_subMenuOne) => (_subMenuOne.isSubMenuOpen = false)
            );
          }
        });
        break;
      case 3:
      case 4:
        this.menus.forEach((_menu) => {
          _menu.subMenus.forEach((_subMenuOne) => {
            if (_subMenuOne.id === selectedId) {
              _menu.isSubMenuOpen = true;
              _subMenuOne.isSubMenuOpen = !_subMenuOne.isSubMenuOpen;
            } else {
              _subMenuOne.isSubMenuOpen = false;
            }
          });
        });
        break;
      default:
        break;
    }
  }

  routeToLink(route: string, isActive: boolean) {
    if (route == 'javascript:void(0)') {
      return;
    }
    if (isActive) {
      return;
    }
    this._router.navigate([route]);
  }

  // Sidebar footer submenu dropdown toggle
  FooterSubmenuVisible: boolean = false;
  isFooterSubmenuVisible() {
    this.footerProfileType.update((profileType) => {
      return (profileType = !profileType);
    });
  }

  /**
   * Log Out
   */
  onLogout() {
    this._authService.logout();
    this._router.navigate(['/']);
  }

  onLogoutDialog(event: Event) {
    event.stopImmediatePropagation();
    this.dialogRef = this._dialog.open(WarningDialogComponent, {
      panelClass: 'custom-warning-dialog',
      backdropClass: 'customDialogBackdrop',
      hasBackdrop: true,
      data: {
        photoIcon: 'assets/images/warning.svg',
        message: 'Are you sure you want to logout?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No',
        },
      },
    });
    const subscribeDialog =
      this.dialogRef.componentInstance.onConfirmDialog.subscribe(() => {
        this.onLogout();
      });
    this.dialogRef.afterClosed().subscribe(() => {
      subscribeDialog.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((ele) => ele.unsubscribe());
  }
}
