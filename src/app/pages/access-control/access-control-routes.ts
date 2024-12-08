import { Routes } from '@angular/router';
import { RolesComponent } from './components';
import { DepartmentComponent } from './components';

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
