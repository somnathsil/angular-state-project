import { Component } from '@angular/core';
import { CommonService } from '@app/core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'preloader',
  standalone: true,
  imports: [],
  templateUrl: './preloader.component.html',
  styleUrl: './preloader.component.scss',
})
export class PreloaderComponent {
  public isLoading!: boolean;
  private subscriptions: Subscription[] = [];
  constructor(private _commonService: CommonService) {}

  ngOnInit(): void {
    this.getPreloaderStatus();
  }

  /**
   * *Subscribing to loader source to get the updated state
   *
   * @date 29 Nov 2022
   * @developer Somnath Sil
   */
  private getPreloaderStatus() {
    this.subscriptions.push(
      this._commonService.loaderSource$.subscribe({
        next: (type: boolean) => {
          type ? (this.isLoading = true) : (this.isLoading = false);
        },
      })
    );
  }

  /**
   * *Unsubscribing observable on destroy
   *
   * @date 29 Nov 2022
   * @developer Somnath Sil
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
