import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorIntl,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { appSettings } from '@app/configs/app-settings.config';
import {
  angularFormsModule,
  angularModule,
  angularSidenavModule,
  angularTableModule,
} from '@app/core/modules';
import { CommonService } from '@app/core/services';
import { RolesSidebarWrapperComponent } from '@app/shared/components/access-control/components';
import { WarningDialogComponent } from '@app/shared/components/dialogs/components';
import { ListFilterComponent } from '@app/shared/components/list-filter/list-filter.component';
import { PaginatorDirective } from '@app/shared/directives';
import { AccessControlState, DeleteRole, FetchRoleList } from '@app/store';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

// export interface ISupplierAuditTrialList {
//   role_name: string;
//   number_of_employee: number;
//   status: number;
// }

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    ListFilterComponent,
    angularModule,
    angularTableModule,
    angularFormsModule,
    angularSidenavModule,
    PaginatorDirective,
    MatTooltipModule,
    RolesSidebarWrapperComponent,
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss',
})
export class RolesComponent implements OnInit, OnDestroy {
  private _store = inject(Store);
  private _common = inject(CommonService);
  private _toastr = inject(ToastrService);
  private _dialog = inject(MatDialog);
  private _loadingBar = inject(LoadingBarService);
  // private paginators = inject(MatPaginatorIntl);

  public pageType = signal<string>('');
  public selectedRole = signal<IRoleList | null>(null);
  public isAddEditRoleSidebarOpen = signal<boolean>(false);

  public count!: number;
  private first!: number;
  public pageNumber!: number;
  public pageSize = appSettings.rowsPerPage;

  public nameValue = '';
  public nameMatchMode = '';
  public employeeValue = '';
  public employeeMatchMode = '';
  public selectedStatusValue: string | number = '';
  private searchModel: string | number = '';

  public dialogRef!: MatDialogRef<any>;
  private subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public filterDropDown: { value: string; label: string }[] =
    appSettings.stringFilterDropDown;
  public noOfEmpFilterDropDown: { value: string; label: string }[] =
    appSettings.numberFilterDropDown;

  public roleList: IRoleList[] = [];
  public dataList = new MatTableDataSource<IRoleList, MatPaginator>([]);
  roleList$: Observable<IRoleList[]> = this._store.select(
    AccessControlState.roleList
  );
  roleListCount$: Observable<number> = this._store.select(
    AccessControlState.roleListCount
  );
  // rolesList: Signal<IRoleList[]> = this._store.selectSignal(
  //   AccessControlState.roleList
  // );

  public statusFilterArr: { value: number; label: string }[] = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];
  displayedColumns: string[] = [
    'role_name',
    'number_of_employee',
    'status',
    'action',
  ];

  constructor() {
    // effect(() => {
    //   // this.roleList = this.rolesList();
    //   this.dataList = new MatTableDataSource(this.rolesList());
    // });
  }

  ngOnInit(): void {
    this.loadRoleList(1, '');
  }

  getDataFromStore() {
    this.subscriptions.push(
      this.roleList$.subscribe((data) => {
        if (data) {
          this.roleList = data;
          this.dataList = new MatTableDataSource(this.roleList);
          // this.dataList.paginator = this.paginator;
          // if (this.dataList.paginator) {
          //   this.paginator.pageIndex = 1;
          // }
        }
      }),
      this.roleListCount$.subscribe((data) => {
        this.count = data;
      })
    );
  }

  loadRoleList(pageNumber: number, searchModel: any) {
    const param: IRoleListParam = {
      first: pageNumber,
      rows: this.pageSize,
      filters: {
        name: {
          matchMode: this.nameMatchMode ? this.nameMatchMode : 'startsWith',
          value: this.nameValue ? this.nameValue : '',
        },
        number_of_employees: {
          matchMode: this.employeeMatchMode ? this.employeeMatchMode : 'eq',
          value: this.employeeValue ? this.employeeValue : '',
        },
        status: {
          matchMode: 'eq',
          value:
            this.selectedStatusValue !== undefined
              ? this.selectedStatusValue
              : '',
        },
      },
      globalFilter: searchModel ? searchModel : '',
    };
    this._loadingBar.useRef().start();
    this.subscriptions.push(
      this._store.dispatch(new FetchRoleList(param)).subscribe({
        next: () => {
          setTimeout(() => {
            this._loadingBar.useRef().complete();
            this.getDataFromStore();
            this._common.setLoadingStatus(false);
          }, 50);
        },
        error: (apiError) => {
          this._common.setLoadingStatus(false);
          this._loadingBar.useRef().complete();
          this._toastr.error(apiError.error.response.status.message, 'error', {
            closeButton: true,
            timeOut: 3000,
          });
        },
      })
    );
  }

  onDeleteRoleDialog(event: Event, roleId: number, data: IRoleList) {
    event.stopImmediatePropagation();
    this.dialogRef = this._dialog.open(WarningDialogComponent, {
      panelClass: 'custom-warning-dialog',
      backdropClass: 'customDialogBackdrop',
      hasBackdrop: true,
      data: {
        photoIcon: 'assets/images/warning.svg',
        message: `Are you sure you want to delete ${data.name} role?`,
        buttonText: {
          ok: 'Yes',
          cancel: 'No',
        },
      },
    });
    const subscribeDialog =
      this.dialogRef.componentInstance.onConfirmDialog.subscribe(() => {
        this.onDeleteRole(roleId);
      });
    this.dialogRef.afterClosed().subscribe(() => {
      subscribeDialog.unsubscribe();
    });
  }

  onDeleteRole(roleID: number) {
    const param: IDeleteRoleParam = {
      id: roleID,
    };

    this._loadingBar.useRef().start();
    this.subscriptions.push(
      this._store.dispatch(new DeleteRole(param)).subscribe({
        next: () => {
          this._loadingBar.useRef().complete();
          // this.loadRoleList();
        },
        error: (apiError) => {
          this._loadingBar.useRef().complete();
          this._toastr.error(apiError.error.response.status.message, 'error', {
            closeButton: true,
            timeOut: 3000,
          });
        },
      })
    );
  }

  onPageChange(e: PageEvent) {
    // this.first = e.pageSize * e.pageIndex;
    // this.pageNumber = (e.pageIndex + 1).toString();
    this.pageNumber = e.pageIndex + 1;
    this.pageSize = e.pageSize;
    this.loadRoleList(this.pageNumber, this.searchModel);
  }

  nameFilter(value: any) {
    this.pageNumber = 1;
    this.nameValue = value;
    this.loadRoleList(this.pageNumber, this.searchModel);
  }

  nameMatchModeChange() {
    if (this.nameValue) {
      this.pageNumber = 1;
      this.loadRoleList(this.pageNumber, this.searchModel);
    }
  }

  employeeFilter(value: any) {
    this.pageNumber = 1;
    this.employeeValue = value;
    this.loadRoleList(this.pageNumber, this.searchModel);
  }

  employeeMatchModeChange() {
    if (this.employeeValue) {
      this.pageNumber = 1;
      this.loadRoleList(this.pageNumber, this.searchModel);
    }
  }

  onSelectStatusFilters(value: string | number) {
    this.selectedStatusValue = value;
    this.pageNumber = 1;
    this.loadRoleList(this.pageNumber, this.searchModel);
  }

  onClearFilter(filterType: 'name' | 'status' | 'employee') {
    this.pageNumber = 1;
    switch (filterType) {
      case 'name':
        this.nameValue = '';
        this.nameMatchMode = '';
        break;
      case 'status':
        this.selectedStatusValue = '';
        break;
      case 'employee':
        this.employeeValue = '';
        this.employeeMatchMode = '';
        break;
    }
    this.loadRoleList(this.pageNumber, this.searchModel);
  }

  onSearch(searchValue: string | number) {
    this.pageNumber = 1;
    this.searchModel = searchValue;
    this.loadRoleList(this.pageNumber, this.searchModel);
  }

  onClearSearch(event: Event) {
    this.searchModel = '';
    this.nameValue = '';
    this.nameMatchMode = '';
    this.selectedStatusValue = '';
    this.employeeValue = '';
    this.employeeMatchMode = '';
  }

  /* Open roles sidebar */
  onAddEditSidebarOpen(
    event: Event,
    sidebarType: 'add' | 'edit',
    data: IRoleList | null
  ) {
    event.preventDefault();
    if (sidebarType === 'edit') {
      this.selectedRole.set(data);
    }
    this.pageType.set(sidebarType);
    this.isAddEditRoleSidebarOpen.set(true);
  }

  /* Close roles sidebar */
  onAddEditSidebarClose(event: Event) {
    event.preventDefault();
    this.isAddEditRoleSidebarOpen.set(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
