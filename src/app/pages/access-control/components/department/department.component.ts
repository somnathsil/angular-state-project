import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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
import { ListFilterComponent } from '@app/shared/components/list-filter/list-filter.component';
import { PaginatorDirective } from '@app/shared/directives';

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
  private _common = inject(CommonService);

  public pageSize = 10;
  public count!: number;
  public pageNumber!: string;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public noOfEmpFilterValue: number | null = null;
  public noOfEmpFilterMethod: string = 'equals';
  public nameMatchMode: string = 'startsWith';
  public filterDropDown: { value: string; label: string }[] =
    appSettings.stringFilterDropDown;
  public noOfEmpFilterDropDown: { value: string; label: string }[] =
    appSettings.numberFilterDropDown;
  public statusFilterArr: { value: number; label: string }[] = [
    { value: 1, label: 'Active' },
    { value: 0, label: 'Inactive' },
  ];

  public isAddEditDepartmentSidebarOpen = signal<boolean>(false);

  displayedColumns: string[] = [
    'department_name',
    'number_of_employee',
    'status',
    'action',
  ];

  departmentList: any[] = [
    {
      department_name: 'Administration',
      number_of_employee: 45,
      status: 0,
    },
    {
      department_name: 'BDM',
      number_of_employee: 20,
      status: 1,
    },
    {
      department_name: 'Development',
      number_of_employee: 12,
      status: 0,
    },
    {
      department_name: 'QA',
      number_of_employee: 40,
      status: 1,
    },
  ];
  dataList = new MatTableDataSource(this.departmentList);

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this._common.setLoadingStatus(false);
    this.dataList.paginator = this.paginator;
  }

  /* Open department sidebar */
  onAddEditSidebarOpen(event: Event, sidebarType: 'add' | 'edit') {
    this.isAddEditDepartmentSidebarOpen.set(true);
  }

  /* Close department sidebar */
  onAddEditSidebarClose(event: Event) {
    event.preventDefault();
    this.isAddEditDepartmentSidebarOpen.set(false);
  }
}
