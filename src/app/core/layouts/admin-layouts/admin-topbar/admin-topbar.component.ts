import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/core/authentication';

@Component({
  selector: 'admin-topbar',
  standalone: true,
  imports: [],
  templateUrl: './admin-topbar.component.html',
  styleUrl: './admin-topbar.component.scss',
})
export class AdminTopbarComponent {
  private _router = inject(Router);
  private _authService = inject(AuthenticationService);

  public isSidebarOpen: boolean = false;

  constructor() {}

  /**
   * *Admin Toggle Menu
   */
  toggleSidebar(event: Event) {
    event.preventDefault();
    const adminWrapperEl = document.querySelector(
      '.admin-layout-container'
    ) as HTMLElement;
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      adminWrapperEl.classList.add('sidebar-collapse');
    } else {
      adminWrapperEl.classList.remove('sidebar-collapse');
    }
  }
}
