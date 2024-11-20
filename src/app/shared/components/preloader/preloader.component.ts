import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonService } from '@app/core/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'preloader',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './preloader.component.html',
  styleUrl: './preloader.component.scss',
})
export class PreloaderComponent implements AfterViewInit {
  public isLoading!: boolean;
  private subscriptions: Subscription[] = [];
  constructor(
    private _commonService: CommonService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getPreloaderStatus();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
