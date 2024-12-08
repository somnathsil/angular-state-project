import { Routes } from '@angular/router';
import { AdminWrapperComponent, AuthLayoutComponent } from './core/layouts';
import { hasNotLoginGuard, isLoginGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    canActivate: [hasNotLoginGuard],
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((r) => r.authRoutes),
  },
  {
    path: '',
    canActivate: [isLoginGuard],
    component: AdminWrapperComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.routes').then(
            (m) => m.dashboardRoutes
          ),
      },
      {
        path: 'access-control',
        loadChildren: () =>
          import('./pages/access-control/access-control-routes').then(
            (m) => m.accessControlRoutes
          ),
      },
      {
        path: 'user-management',
        loadChildren: () =>
          import('./pages/user-management/user-management.routes').then(
            (m) => m.userManagementRoutes
          ),
      },
    ],
  },
];
