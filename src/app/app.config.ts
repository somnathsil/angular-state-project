import {
  ApplicationConfig,
  importProvidersFrom,
  provideExperimentalZonelessChangeDetection,
  // provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HttpProviders } from './http.providers';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccessControlState } from './store';
import { provideStore } from '@ngxs/store';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { provideAnimations } from '@angular/platform-browser/animations';
import { userManagementState } from './store/state/user-management.state';

const STATES: any = [AccessControlState, userManagementState];

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideStore([...STATES], withNgxsLoggerPlugin()),
    provideExperimentalZonelessChangeDetection(),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    HttpProviders,
    provideToastr({
      closeButton: true,
      positionClass: 'toast-top-right',
      timeOut: 3000,
    }),
  ],
};
