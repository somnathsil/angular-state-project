import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { appSettings } from '@app/configs/app-settings.config';
import {
  angularFormsModule,
  angularModule,
  angularSidenavModule,
  angularTableModule,
} from '@app/core/modules';
import { RolesSidebarWrapperComponent } from '@app/shared/components/access-control/components';
import { ListFilterComponent } from '@app/shared/components/list-filter/list-filter.component';
import { PaginatorDirective } from '@app/shared/directives';

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
export class RolesComponent implements OnInit {
  public pageSize = 10;
  public count!: number;
  public pageNumber!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public nameMatchMode: string = 'startsWith';
  public noOfEmpFilterValue: number | null = null;
  public noOfEmpFilterMethod: string = 'equals';
  public filterDropDown: { value: string; label: string }[] =
    appSettings.stringFilterDropDown;
  public noOfEmpFilterDropDown: { value: string; label: string }[] =
    appSettings.numberFilterDropDown;
  public statusFilterArr: { value: number; label: string }[] = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];

  public isAddEditRoleSidebarOpen = signal<boolean>(false);

  displayedColumns: string[] = [
    'role_name',
    'number_of_employee',
    'status',
    'action',
  ];
  rolesList: ISupplierAuditTrialList[] = [
    {
      role_name: 'Admin',
      number_of_employee: 45,
      status: 0,
    },
    {
      role_name: 'Account Strategist',
      number_of_employee: 20,
      status: 1,
    },
    {
      role_name: 'Accountant',
      number_of_employee: 12,
      status: 0,
    },
    {
      role_name: 'Office Executive ',
      number_of_employee: 40,
      status: 1,
    },
  ];
  dataList = new MatTableDataSource(this.rolesList);

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataList.paginator = this.paginator;
  }

  /* Open roles sidebar */
  onAddEditSidebarOpen(event: Event, sidebarType: 'add' | 'edit') {
    event.preventDefault();
    this.isAddEditRoleSidebarOpen.set(true);
  }

  /* Close roles sidebar */
  onAddEditSidebarClose(event: Event) {
    event.preventDefault();
    this.isAddEditRoleSidebarOpen.set(false);
  }
}
