import { Routes } from '@angular/router';
import { PolicyListComponent } from './components';

export const policyRoutes: Routes = [
  {
    path: '',
    title: 'Policy List',
    component: PolicyListComponent,
  },
];
