import { DatePipe } from '@angular/common';
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
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
  angularDatepickerModule,
} from '@app/core/modules';
import { CommonService } from '@app/core/services';
import { WarningDialogComponent } from '@app/shared/components/dialogs/components';
import { ListFilterComponent } from '@app/shared/components/list-filter/list-filter.component';
import { PolicySidebarWrapperComponent } from '@app/shared/components/policy/components';
import { PaginatorDirective } from '@app/shared/directives';
import {
  AllPolicyList,
  DeletePolicy,
} from '@app/store/actions/settings.action';
import { SettingsState } from '@app/store/state/settings.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, startWith, Subscription } from 'rxjs';

@Component({
  selector: 'app-policy-list',
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
    PolicySidebarWrapperComponent,
  ],
  providers: [DatePipe],
  templateUrl: './policy-list.component.html',
  styleUrl: './policy-list.component.scss',
})
export class PolicyListComponent implements OnInit, OnDestroy {
  private _store = inject(Store);
  private _common = inject(CommonService);
  private _toastr = inject(ToastrService);
  private _dialog = inject(MatDialog);
  private _loadingBar = inject(LoadingBarService);

  public pageType = signal<string>('');
  public selectedPolicy = signal<IPolicyList | null>(null);
  public isAddEditPolicySidebarOpen = signal<boolean>(false);

  public count!: number;
  private first!: number;
  public pageNumber!: number;
  public pageSize = appSettings.rowsPerPage;

  public titleValue = '';
  public titleMatchMode = '';
  public dateFilter: string = '';
  public dateMatchMode: string = 'before';
  public selectedStatusValue: string | number = '';
  private searchModel: string | number = '';

  public dialogRef!: MatDialogRef<any>;
  private subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public calendarFilterDropDown: { value: string; label: string }[] =
    appSettings.dateFilterDropDown;
  public filterDropDown: { value: string; label: string }[] =
    appSettings.stringFilterDropDown;

  public policyList: IPolicyList[] = [];
  public dataList = new MatTableDataSource<IPolicyList, MatPaginator>([]);
  policyList$: Observable<IPolicyList[]> = this._store.select(
    SettingsState.policyList
  );
  policyListCount$: Observable<number> = this._store.select(
    SettingsState.policyListCount
  );

  public statusFilterArr: { value: number; label: string }[] = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];
  displayedColumns: string[] = [
    'policy_name',
    'last_updated_date',
    'status',
    'action',
  ];

  constructor(private _datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadPloicyList(1, '');
  }

  getDataFromStore() {
    this.subscriptions.push(
      this.policyList$.subscribe((data) => {
        if (data) {
          this.policyList = data;
          this.dataList = new MatTableDataSource(this.policyList);
          // this.dataList.paginator = this.paginator;
          // if (this.dataList.paginator) {
          //   this.paginator.pageIndex = 1;
          // }
        }
      }),
      this.policyListCount$.subscribe((data) => {
        this.count = data;
      })
    );
  }

  loadPloicyList(pageNumber: number, searchModel: any) {
    const param: IPolicyListParam = {
      first: pageNumber,
      rows: this.pageSize,
      filters: {
        policy_name: {
          matchMode: this.titleMatchMode ? this.titleMatchMode : 'startsWith',
          value: this.titleValue ? this.titleValue : '',
        },
        updated_at: {
          matchMode: this.dateMatchMode ? this.dateMatchMode : 'before',
          value: this.dateFilter
            ? this._datePipe.transform(this.dateFilter, 'yyyy-MM-dd') ?? ''
            : '',
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
      this._store.dispatch(new AllPolicyList(param)).subscribe({
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

  onDeletePolicyDialog(event: Event, policyId: number, data: IPolicyList) {
    event.stopImmediatePropagation();
    this.dialogRef = this._dialog.open(WarningDialogComponent, {
      panelClass: 'custom-warning-dialog',
      backdropClass: 'customDialogBackdrop',
      hasBackdrop: true,
      data: {
        photoIcon: 'assets/images/warning.svg',
        message: `Are you sure you want to delete ${data.policy_name} policy?`,
        buttonText: {
          ok: 'Yes',
          cancel: 'No',
        },
      },
    });
    const subscribeDialog =
      this.dialogRef.componentInstance.onConfirmDialog.subscribe(() => {
        this.onDeletePolicy(policyId);
      });
    this.dialogRef.afterClosed().subscribe(() => {
      subscribeDialog.unsubscribe();
    });
  }

  onDeletePolicy(policyId: number) {
    const param: IDeletePolicyParam = {
      id: policyId,
    };

    this._loadingBar.useRef().start();
    this.subscriptions.push(
      this._store.dispatch(new DeletePolicy(param)).subscribe({
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
    this.loadPloicyList(this.pageNumber, this.searchModel);
  }

  titleFilter(value: any) {
    this.pageNumber = 1;
    this.titleValue = value;
    this.loadPloicyList(this.pageNumber, this.searchModel);
  }

  titleMatchModeChange() {
    if (this.titleValue) {
      this.pageNumber = 1;
      this.loadPloicyList(this.pageNumber, this.searchModel);
    }
  }

  /* Open policy sidebar */
  onAddEditSidebarOpen(
    event: Event,
    sidebarType: 'add' | 'edit',
    data: IPolicyList | null
  ) {
    event.preventDefault();
    if (sidebarType === 'edit') {
      this.selectedPolicy.set(data);
    }
    this.pageType.set(sidebarType);
    this.isAddEditPolicySidebarOpen.set(true);
  }

  onSelectStatusFilters(value: string | number) {
    this.selectedStatusValue = value;
    this.pageNumber = 1;
    this.loadPloicyList(this.pageNumber, this.searchModel);
  }

  onDateChange() {
    this.pageNumber = 1;
    this.loadPloicyList(this.pageNumber, this.searchModel);
  }

  onDateMatchModeChange() {
    if (this.dateFilter) {
      this.pageNumber = 1;
      this.loadPloicyList(this.pageNumber, this.searchModel);
    }
  }

  onClearFilter(filterType: 'title' | 'status' | 'date') {
    this.pageNumber = 1;
    switch (filterType) {
      case 'title':
        this.titleValue = '';
        this.titleMatchMode = '';
        break;
      case 'status':
        this.selectedStatusValue = '';
        break;
      case 'date':
        this.dateFilter = '';
        this.dateMatchMode = '';
        break;
    }
    this.loadPloicyList(this.pageNumber, this.searchModel);
  }

  onSearch(searchValue: string | number) {
    this.pageNumber = 1;
    this.searchModel = searchValue;
    this.loadPloicyList(this.pageNumber, this.searchModel);
  }

  onClearSearch(event: Event) {
    this.searchModel = '';
    this.selectedStatusValue = '';
  }

  onAddEditSidebarClose(event: Event) {
    event.preventDefault();
    this.isAddEditPolicySidebarOpen.set(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
