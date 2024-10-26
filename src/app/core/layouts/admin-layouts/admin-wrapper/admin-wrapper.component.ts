import { Component, inject } from '@angular/core';
import { angularModule } from '@app/core/modules';
import { AdminLeftbarComponent } from '../admin-leftbar/admin-leftbar.component';
import { AdminTopbarComponent } from '../admin-topbar/admin-topbar.component';
import { PreloaderComponent } from '@app/shared/components/preloader/preloader.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'admin-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminLeftbarComponent,
    AdminTopbarComponent,
    PreloaderComponent,
  ],
  templateUrl: './admin-wrapper.component.html',
  styleUrl: './admin-wrapper.component.scss',
})
export class AdminWrapperComponent {
  constructor() {}
}
