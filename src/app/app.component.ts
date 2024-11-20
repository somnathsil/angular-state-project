import { Component, inject, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { PreloaderComponent } from './shared/components/preloader/preloader.component';
import { Subscription } from 'rxjs';
import { CommonService } from './core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoadingBarModule, PreloaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private _router = inject(Router);
  private _common = inject(CommonService);

  private subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    this.handleLoadingState();
  }

  private handleLoadingState() {
    this.subscriptions.push(
      this._router.events.subscribe((event) => {
        switch (true) {
          case event instanceof NavigationStart: {
            this._common.setLoadingStatus(true);
            break;
          }
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            this._common.setLoadingStatus(false);
            break;
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
