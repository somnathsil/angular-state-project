import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { appSettings } from '@app/configs';
import {
  angularModule,
  angularTableModule,
  angularFormsModule,
} from '@app/core/modules';
import { CommonService } from '@app/core/services';
import { ListFilterComponent } from '@app/shared/components/list-filter/list-filter.component';
import { PaginatorDirective } from '@app/shared/directives';
import { FetchUserManagementList } from '@app/store/actions/user-management-action';
import { userManagementState } from '@app/store/state/user-management.state';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    ListFilterComponent,
    angularModule,
    angularTableModule,
    angularFormsModule,
    PaginatorDirective,
  ],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  private _store = inject(Store);
  private _common = inject(CommonService);
  private _toastr = inject(ToastrService);
  private _loadingBar = inject(LoadingBarService);

  public count!: number;
  public pageNumber!: number;
  public pageSize = appSettings.rowsPerPage;

  public nameValue = '';
  public nameMatchMode = '';
  public emailValue = '';
  public emailMatchMode = '';
  private searchModel: string | number = '';

  private subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public dataList = new MatTableDataSource<IUserManagementList, MatPaginator>(
    []
  );

  public filterDropDown: { value: string; label: string }[] =
    appSettings.stringFilterDropDown;
  public noOfEmpFilterDropDown: { value: string; label: string }[] =
    appSettings.numberFilterDropDown;

  public userManagementList: IUserManagementList[] = [];
  userManagementList$: Observable<IUserManagementList[]> = this._store.select(
    userManagementState.userManagementList
  );
  userManagementListCount$: Observable<number> = this._store.select(
    userManagementState.userManagementListCount
  );

  displayedColumns: string[] = ['name', 'email', 'created_at'];

  ngOnInit(): void {
    this.loadUserManagementList(1, '');
  }

  getDataFromStore() {
    this.subscriptions.push(
      // this.userManagementList$.subscribe((data) => {
      //   if (data) {
      //     this.userManagementList = data;
      //     this.dataList = new MatTableDataSource(this.userManagementList);
      //   }
      // }),
      // this.userManagementListCount$.subscribe((data) => {
      //   this.count = data;
      // })
      combineLatest([
        this.userManagementList$,
        this.userManagementListCount$,
      ]).subscribe({
        next: (apiData) => {
          if (apiData[0]) {
            this.userManagementList = apiData[0];
            this.dataList = new MatTableDataSource(this.userManagementList);
          }
          if (apiData[1]) {
            this.count = apiData[1];
          }
        },
      })
    );
  }

  loadUserManagementList(pageNumber: number, searchModel: any) {
    const param: any = {
      first: pageNumber,
      rows: this.pageSize,
      filters: {
        name: {
          matchMode: this.nameMatchMode ? this.nameMatchMode : 'startsWith',
          value: this.nameValue ? this.nameValue : '',
        },
        email: {
          matchMode: this.emailMatchMode ? this.emailMatchMode : 'contain',
          value: this.emailValue ? this.emailValue : '',
        },
      },
      globalFilter: searchModel ? searchModel : '',
    };
    this._loadingBar.useRef().start();
    this.subscriptions.push(
      this._store.dispatch(new FetchUserManagementList(param)).subscribe({
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

  onPageChange(event: PageEvent) {
    // this.first = e.pageSize * e.pageIndex;
    // this.pageNumber = (e.pageIndex + 1).toString();
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUserManagementList(this.pageNumber, this.searchModel);
  }

  nameFilter(value: any) {
    this.pageNumber = 1;
    this.nameValue = value;
    this.loadUserManagementList(this.pageNumber, this.searchModel);
  }

  nameMatchModeChange() {
    if (this.nameValue) {
      this.pageNumber = 1;
      this.loadUserManagementList(this.pageNumber, this.searchModel);
    }
  }

  emailFilter(value: any) {
    this.pageNumber = 1;
    this.emailValue = value;
    this.loadUserManagementList(this.pageNumber, this.searchModel);
  }

  emailMatchModeChange() {
    if (this.emailValue) {
      this.pageNumber = 1;
      this.loadUserManagementList(this.pageNumber, this.searchModel);
    }
  }

  onClearFilter(filterType: 'name' | 'email') {
    this.pageNumber = 1;
    switch (filterType) {
      case 'name':
        this.nameValue = '';
        this.nameMatchMode = '';
        break;
      case 'email':
        this.emailValue = '';
        this.emailMatchMode = '';
        break;
    }
    this.loadUserManagementList(this.pageNumber, this.searchModel);
  }

  onSearch(searchValue: string | number) {
    this.pageNumber = 1;
    this.searchModel = searchValue;
    this.loadUserManagementList(this.pageNumber, this.searchModel);
  }

  onClearSearch(event: Event) {
    this.searchModel = '';
    this.nameValue = '';
    this.nameMatchMode = '';
    this.emailValue = '';
    this.emailMatchMode = '';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
