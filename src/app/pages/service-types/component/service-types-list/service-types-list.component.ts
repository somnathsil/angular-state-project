import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { appSettings } from '@app/configs';
import {
  angularDatepickerModule,
  angularModule,
  angularTableModule,
  angularFormsModule,
  angularSidenavModule,
} from '@app/core/modules';
import { CommonService } from '@app/core/services';
import { ListFilterComponent } from '@app/shared/components/list-filter/list-filter.component';
import { ServiceTypesSidebarWrapperComponent } from '@app/shared/components/service-types/components/service-types-sidebar-wrapper/service-types-sidebar-wrapper.component';
import { PaginatorDirective } from '@app/shared/directives';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Store } from '@ngxs/store';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

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
  private _loadingBar = inject(LoadingBarService);

  public pageType = signal<string>('');
  public selectedServiceTypes = signal<IPolicyList | null>(null);
  public isAddEditServiceTypesSidebarOpen = signal<boolean>(false);

  public count!: number;
  private first!: number;
  public pageNumber!: number;
  public pageSize = appSettings.rowsPerPage;

  public dialogRef!: MatDialogRef<any>;
  private subscriptions: Subscription[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public serviceTypesList: IPolicyList[] = [];
  public dataList = new MatTableDataSource<IPolicyList, MatPaginator>([]);

  public statusFilterArr: { value: number; label: string }[] = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];
  displayedColumns: string[] = [
    'service_title',
    'service_month',
    'status',
    'action',
  ];

  constructor() {}

  ngOnInit(): void {
    this._common.setLoadingStatus(false);
  }

  onAddEditSidebarOpen(event: Event) {
    event.preventDefault();
    this.isAddEditServiceTypesSidebarOpen.set(true);
  }

  onAddEditSidebarClose(event: Event) {
    event.preventDefault();
    this.isAddEditServiceTypesSidebarOpen.set(false);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
