import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { appSettings } from '@app/configs';
import { HttpService } from '@app/core/http';
import {
  angularDatepickerModule,
  angularModule,
  angularTableModule,
  angularFormsModule,
  angularSidenavModule,
} from '@app/core/modules';
import { CommonService } from '@app/core/services';
import { WarningDialogComponent } from '@app/shared/components/dialogs/components';
import { ListFilterComponent } from '@app/shared/components/list-filter/list-filter.component';
import { ServiceTypesSidebarWrapperComponent } from '@app/shared/components/service-types/components/service-types-sidebar-wrapper/service-types-sidebar-wrapper.component';
import { PaginatorDirective } from '@app/shared/directives';
import {
  AllServiceTypeList,
  DeleteServiceType,
  FetchMothList,
} from '@app/store/actions/settings.action';
import { SettingsState } from '@app/store/state/settings.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-service-types-list',
  standalone: true,
  imports: [
    ListFilterComponent,
    angularDatepickerModule,
    angularModule,
    angularTableModule,
    angularFormsModule,
    angularSidenavModule,
    PaginatorDirective,
    MatTooltipModule,
    ServiceTypesSidebarWrapperComponent,
  ],
  templateUrl: './service-types-list.component.html',
  styleUrl: './service-types-list.component.scss',
})
export class ServiceTypesListComponent implements OnInit {
  private _store = inject(Store);
  private _common = inject(CommonService);
  private _toastr = inject(ToastrService);
  private _dialog = inject(MatDialog);
  private _http = inject(HttpService);
  private _loadingBar = inject(LoadingBarService);

  public pageType = signal<string>('');
  public selectedServiceTypes = signal<IServiceTypeList | null>(null);
  public isAddEditServiceTypesSidebarOpen = signal<boolean>(false);

  public count!: number;
  private first!: number;
  public pageNumber!: number;
  public pageSize = appSettings.rowsPerPage;

  public serviceValue = '';
  public serviceMatchMode = '';
  public selectedStatusValue: string | number = '';
  private searchModel: string | number = '';

  public dialogRef!: MatDialogRef<any>;
  private subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public filterDropDown: { value: string; label: string }[] =
    appSettings.stringFilterDropDown;

  public serviceTypesList: IServiceTypeList[] = [];
  public dataList = new MatTableDataSource<IServiceTypeList, MatPaginator>([]);
  serviceTypeLIst$: Observable<IServiceTypeList[]> = this._store.select(
    SettingsState.serviceTypeList
  );
  serviceTypeLIstCount$: Observable<number> = this._store.select(
    SettingsState.serviceTypeListCount
  );

  public statusFilterArr: { value: number; label: string }[] = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];
  displayedColumns: string[] = [
    'service_title',
    'service_month',
    'created_at',
    'updated_at',
    'status',
    'action',
  ];

  public monthArr: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  constructor() {}

  ngOnInit(): void {
    this.loadServiceTypeList(1, '');
    // this.getMonthData();
  }

  getDataFromStore() {
    this.subscriptions.push(
      this.serviceTypeLIst$.subscribe((data) => {
        if (data) {
          this.serviceTypesList = data;
          this.dataList = new MatTableDataSource(this.serviceTypesList);
        }
      }),
      this.serviceTypeLIstCount$.subscribe((data) => {
        this.count = data;
      })
    );
  }

  loadServiceTypeList(pageNumber: number, searchModel: any) {
    let payload: any = {
      first: pageNumber,
      rows: this.pageSize,
      filters: {
        service_type_name: {
          matchMode: this.serviceMatchMode
            ? this.serviceMatchMode
            : 'startsWith',
          value: this.serviceValue ? this.serviceValue : '',
        },
        service_month: {
          matchMode: 'eq',
          value: '',
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
      this._store.dispatch(new AllServiceTypeList(payload)).subscribe({
        next: (apiResult) => {
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

  onDeleteServiceTypeDialog(
    event: Event,
    serviceTypeId: number,
    data: IServiceTypeList
  ) {
    event.stopImmediatePropagation();
    this.dialogRef = this._dialog.open(WarningDialogComponent, {
      panelClass: 'custom-warning-dialog',
      backdropClass: 'customDialogBackdrop',
      hasBackdrop: true,
      data: {
        photoIcon: 'assets/images/warning.svg',
        message: `Are you sure you want to delete ${data.service_type_name} service type?`,
        buttonText: {
          ok: 'Yes',
          cancel: 'No',
        },
      },
    });
    const subscribeDialog =
      this.dialogRef.componentInstance.onConfirmDialog.subscribe(() => {
        this.onDeleteServiceType(serviceTypeId);
      });
    this.dialogRef.afterClosed().subscribe(() => {
      subscribeDialog.unsubscribe();
    });
  }

  onDeleteServiceType(serviceTypeId: number) {
    const param: IDeleteServiceTypParam = {
      id: serviceTypeId,
    };

    this._loadingBar.useRef().start();
    this.subscriptions.push(
      this._store.dispatch(new DeleteServiceType(param)).subscribe({
        next: () => {
          this._loadingBar.useRef().complete();
          // this.loadServiceTypeList();
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

  /* Fetching All Months from Api Using BehaviorSubject */
  // getMonthData() {
  //   this._http.get('service-types/master-months').subscribe({
  //     next: (apiResult) => {
  //       const monthData = apiResult.response.dataset.months;
  //       this._common.setMonthData(monthData);
  //     },
  //   });
  // }

  /* Fetching All Months from Api Using Store */
  onAddEditSidebarOpen(
    event: Event,
    sidebarType: 'add' | 'edit',
    data: IServiceTypeList | null
  ) {
    event.preventDefault();
    this.subscriptions.push(
      this._store.dispatch(new FetchMothList()).subscribe({
        next: (apiResult) => {
          this._common.setLoadingStatus(false);
          if (sidebarType === 'edit') {
            this.selectedServiceTypes.set(data);
          }
          this.pageType.set(sidebarType);
          this.isAddEditServiceTypesSidebarOpen.set(true);
        },
        error: (apiError) => {
          this._common.setLoadingStatus(false);
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
    this.loadServiceTypeList(this.pageNumber, this.searchModel);
  }

  serviceFilter(value: any) {
    this.pageNumber = 1;
    this.serviceValue = value;
    this.loadServiceTypeList(this.pageNumber, this.searchModel);
  }

  serviceMatchModeChange() {
    if (this.serviceValue) {
      this.pageNumber = 1;
      this.loadServiceTypeList(this.pageNumber, this.searchModel);
    }
  }

  onSelectStatusFilters(value: string | number) {
    this.selectedStatusValue = value;
    this.pageNumber = 1;
    this.loadServiceTypeList(this.pageNumber, this.searchModel);
  }

  onClearFilter(filterType: 'title' | 'status') {
    this.pageNumber = 1;
    switch (filterType) {
      case 'status':
        this.selectedStatusValue = '';
        break;
      case 'title':
        this.serviceValue = '';
        this.serviceMatchMode = '';
        break;
      default:
        break;
    }
    this.loadServiceTypeList(this.pageNumber, this.searchModel);
  }

  onSearch(searchValue: string | number) {
    this.pageNumber = 1;
    this.searchModel = searchValue;
    this.loadServiceTypeList(this.pageNumber, this.searchModel);
  }

  onClearSearch(event: Event) {
    this.searchModel = '';
    // this.selectedStatusValue = '';
  }

  onAddEditSidebarClose(event: Event) {
    event.preventDefault();
    this.isAddEditServiceTypesSidebarOpen.set(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
