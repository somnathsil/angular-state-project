import {
  AfterContentChecked,
  AfterViewInit,
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
import { Subscription } from 'rxjs';

export interface ISupplierAuditTrialList {
  role_name: string;
  number_of_employee: number;
  status: number;
}

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
export class RolesComponent
  implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy
{
  private _store = inject(Store);
  private _common = inject(CommonService);
  private _toastr = inject(ToastrService);
  private _dialog = inject(MatDialog);
  private _loadingBar = inject(LoadingBarService);
  private paginators = inject(MatPaginatorIntl);

  public pageType = signal<string>('');
  public selectedRole = signal<IRoleList | null>(null);
  public isAddEditRoleSidebarOpen = signal<boolean>(false);
  rolesList: Signal<IRoleList[]> = this._store.selectSignal(
    AccessControlState.roleList
  );

  // dataList$ = this._store.select(AccessControlState.roleList);

  private first!: number;
  public pageNumber!: string;
  public pageSize = appSettings.rowsPerPage;
  private searchModel: string | number = '';

  public dialogRef!: MatDialogRef<any>;
  private subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public nameMatchMode: string = 'startsWith';
  public nameNoFilter: string = '';
  public noOfEmpFilterValue: string = '';
  public noOfEmpFilterMethod: string = 'equals';
  public filterDropDown: { value: string; label: string }[] =
    appSettings.stringFilterDropDown;
  public noOfEmpFilterDropDown: { value: string; label: string }[] =
    appSettings.numberFilterDropDown;

  // public roleList: IRoleList[] = [];
  // dataList = new MatTableDataSource(this.rolesList());
  public dataList!: MatTableDataSource<IRoleList, MatPaginator>;

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

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      // this.roleList = this.rolesList();
      this.dataList = new MatTableDataSource(this.rolesList());
    });
  }

  ngOnInit(): void {
    this.loadRoleList(0, '');
  }

  ngAfterViewInit() {
    // this.dataList.paginator = this.paginator;
    // this.cdr.detectChanges();
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  loadRoleList(first: number, searchModel: any) {
    const param: any = {
      first: 1,
      rows: 25,
      // filters: {
      //   name: {
      //     matchMode: this.nameMatchMode ? this.nameMatchMode : 'startsWith',
      //     value: this.nameNoFilter ? this.nameNoFilter : '',
      //   },
      // },
      // globalFilter: searchModel ? searchModel : '',
    };
    this._loadingBar.useRef().start();
    this.subscriptions.push(
      this._store.dispatch(new FetchRoleList(param)).subscribe({
        next: (apiResult) => {
          this._loadingBar.useRef().complete();
          this._common.setLoadingStatus(false);
          // this.roleList = this.rolesList();
          // this.dataList = new MatTableDataSource(this.roleList);
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
    this.first = e.pageSize * e.pageIndex;
    this.pageSize = e.pageSize;
    this.pageNumber = (e.pageIndex + 1).toString();
    this.loadRoleList(this.first, this.searchModel);
  }

  nameFilter(value: any) {
    this.first = 0;
    this.nameNoFilter = value;
    this.loadRoleList(this.first, this.searchModel);
  }

  nameMatchModeChange() {
    if (this.nameNoFilter) {
      this.first = 0;
      this.loadRoleList(this.first, this.searchModel);
    }
  }

  onClearFilter(filterType: 'name') {
    this.first = 0;
    switch (filterType) {
      case 'name':
        this.nameNoFilter = '';
        this.nameMatchMode = 'startsWith';
        break;
    }
    this.loadRoleList(this.first, this.searchModel);
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
