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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideExperimentalZonelessChangeDetection(),
    importProvidersFrom(
      FormsModule,
      ReactiveFormsModule
      // NgxsModule.forRoot([...STATES], {
      //   developmentMode: !environment.production,
      // })
    ),
    HttpProviders,
    provideToastr({
      closeButton: true,
      positionClass: 'toast-top-right',
      timeOut: 3000,
    }),
    provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync(),
  ],
};
