import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { angularModule } from '@app/core/modules';

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [angularModule],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  private bodyElement = document.querySelector('body');
  public cuttentYear = signal<number>(Object.create(null));

  constructor() {}

  ngOnInit(): void {
    this.bodyElement?.classList.add('auth-background');
    this.cuttentYear.set(new Date().getFullYear());
  }

  ngOnDestroy(): void {
    this.bodyElement?.classList.remove('auth-background');
  }
}
