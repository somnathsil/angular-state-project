import { Component } from '@angular/core';
import { CommonService } from '@app/core/services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private _common: CommonService) {}

  ngAfterViewInit() {
    this._common.setLoadingStatus(false);
  }
}
