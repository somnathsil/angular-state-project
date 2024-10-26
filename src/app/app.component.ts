import { Component, OnInit } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { PreloaderComponent } from './shared/components/preloader/preloader.component';
import { Subscription } from 'rxjs';
import { CommonService } from './core/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoadingBarModule, PreloaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'angular-state-project';
  private currentURL = '';
  private subscriptions: Subscription[] = [];
  constructor(private _router: Router, private _common: CommonService) {}

  ngOnInit(): void {
    this.handleLoadingState();
  }

  private handleLoadingState() {
    this.subscriptions.push(
      this._router.events.subscribe((event: any) => {
        if (event instanceof NavigationStart) {
          const URl = event.url;
          if (
            URl.split('?')[0].split('#')[0] !==
            this.currentURL.split('?')[0].split('#')[0]
          ) {
            this._common.setLoadingStatus(true);
          }
        }
        if (event instanceof NavigationEnd) {
          this.currentURL = event.url;
        }
        if (
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this._common.setLoadingStatus(false);
        }
      })
    );
  }
}
