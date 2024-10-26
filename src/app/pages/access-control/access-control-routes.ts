import { Routes } from '@angular/router';
import { RolesComponent } from './components/roles/roles.component';
import { DepartmentComponent } from './components/department/department.component';

export const accessControlRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'roles',
  },
  {
    path: 'roles',
    title: 'Roles',
    component: RolesComponent,
  },
  {
    path: 'department',
    title: 'Department',
    component: DepartmentComponent,
  },
];
