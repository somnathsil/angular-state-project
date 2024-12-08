import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { appSettings } from '@app/configs';
import {
  angularModule,
  angularTableModule,
  angularFormsModule,
  angularSidenavModule,
} from '@app/core/modules';
import { CommonService } from '@app/core/services';
import { DepartmentSidebarWrapperComponent } from '@app/shared/components/access-control/components';
import { WarningDialogComponent } from '@app/shared/components/dialogs/components';
import { ListFilterComponent } from '@app/shared/components/list-filter/list-filter.component';
import { PaginatorDirective } from '@app/shared/directives';
import {
  AccessControlState,
  DeleteDepartment,
  FetchDepartmentList,
} from '@app/store';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [
    ListFilterComponent,
    angularModule,
    angularTableModule,
    angularFormsModule,
    angularSidenavModule,
    PaginatorDirective,
    MatTooltipModule,
    DepartmentSidebarWrapperComponent,
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
})
export class DepartmentComponent implements OnInit {
  private _store = inject(Store);
  private _common = inject(CommonService);
  private _toastr = inject(ToastrService);
  private _dialog = inject(MatDialog);
  private _loadingBar = inject(LoadingBarService);

  public pageType = signal<string>('');
  public selectedDepartment = signal<IDepartmentList | null>(null);
  public isAddEditDepartmentSidebarOpen = signal<boolean>(false);

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

  public allDepartmentList: IDepartmentList[] = [];
  public dataList = new MatTableDataSource<IDepartmentList, MatPaginator>([]);
  public detartmentList$: Observable<IDepartmentList[]> = this._store.select(
    AccessControlState.departmentList
  );
  public departmentListCount$: Observable<number> = this._store.select(
    AccessControlState.departmentListCount
  );

  public statusFilterArr: { value: number; label: string }[] = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];

  displayedColumns: string[] = [
    'department_name',
    'number_of_employee',
    'status',
    'action',
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadDepartmentList(1, '');
  }

  getDataFromStore() {
    this.subscriptions.push(
      this.detartmentList$.subscribe((data) => {
        if (data) {
          this.allDepartmentList = data;
          this.dataList = new MatTableDataSource(this.allDepartmentList);
          // this.dataList.paginator = this.paginator;
          // if (this.dataList.paginator) {
          //   this.paginator.pageIndex = 1;
          // }
        }
      }),
      this.departmentListCount$.subscribe((data) => {
        this.count = data;
      })
    );
  }

  loadDepartmentList(pageNumber: number, searchModel: any) {
    const param: any = {
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
      this._store.dispatch(new FetchDepartmentList(param)).subscribe({
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

  onDeleteDepartmentDialog(
    event: Event,
    departmentID: number,
    data: IDepartmentList
  ) {
    event.stopImmediatePropagation();
    this.dialogRef = this._dialog.open(WarningDialogComponent, {
      panelClass: 'custom-warning-dialog',
      backdropClass: 'customDialogBackdrop',
      hasBackdrop: true,
      data: {
        photoIcon: 'assets/images/warning.svg',
        message: `Are you sure you want to delete ${data.name} department?`,
        buttonText: {
          ok: 'Yes',
          cancel: 'No',
        },
      },
    });
    const subscribeDialog =
      this.dialogRef.componentInstance.onConfirmDialog.subscribe(() => {
        this.onDeleteDepartment(departmentID);
      });
    this.dialogRef.afterClosed().subscribe(() => {
      subscribeDialog.unsubscribe();
    });
  }

  onDeleteDepartment(departmentID: number) {
    const param: IDeleteDepartmentParam = {
      id: departmentID,
    };
    this._loadingBar.useRef().start();
    this.subscriptions.push(
      this._store.dispatch(new DeleteDepartment(param)).subscribe({
        next: () => {
          this._loadingBar.useRef().complete();
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
    this.loadDepartmentList(this.pageNumber, this.searchModel);
  }

  nameFilter(value: any) {
    this.pageNumber = 1;
    this.nameValue = value;
    this.loadDepartmentList(this.pageNumber, this.searchModel);
  }
  nameMatchModeChange() {
    if (this.nameValue) {
      this.pageNumber = 1;
      this.loadDepartmentList(this.pageNumber, this.searchModel);
    }
  }

  employeeFilter(value: any) {
    this.pageNumber = 1;
    this.employeeValue = value;
    this.loadDepartmentList(this.pageNumber, this.searchModel);
  }
  employeeMatchModeChange() {
    if (this.employeeValue) {
      this.pageNumber = 1;
      this.loadDepartmentList(this.pageNumber, this.searchModel);
    }
  }

  onSelectStatusFilters(value: number | string) {
    this.selectedStatusValue = value;
    this.pageNumber = 1;
    this.loadDepartmentList(this.pageNumber, this.searchModel);
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
    this.loadDepartmentList(this.pageNumber, this.searchModel);
  }

  onSearch(searchValue: string | number) {
    this.pageNumber = 1;
    this.searchModel = searchValue;
    this.loadDepartmentList(this.pageNumber, this.searchModel);
  }

  onClearSearch(event: Event) {
    this.searchModel = '';
    this.nameValue = '';
    this.nameMatchMode = '';
    this.selectedStatusValue = '';
    this.employeeValue = '';
    this.employeeMatchMode = '';
  }

  onAddEditSidebarOpen(
    event: Event,
    sidebarType: 'add' | 'edit',
    data: IDepartmentList | null
  ) {
    event.preventDefault();
    if (sidebarType == 'edit') {
      this.selectedDepartment.set(data);
    }
    this.pageType.set(sidebarType);
    this.isAddEditDepartmentSidebarOpen.set(true);
  }

  onAddEditSidebarClose(event: Event) {
    event.preventDefault();
    this.isAddEditDepartmentSidebarOpen.set(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
