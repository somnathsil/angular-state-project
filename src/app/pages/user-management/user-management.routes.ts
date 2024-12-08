import { Routes } from '@angular/router';
import { UserManagementComponent } from './components';

export const userManagementRoutes: Routes = [
  {
    path: '',
    title: 'User Management',
    component: UserManagementComponent,
  },
];
