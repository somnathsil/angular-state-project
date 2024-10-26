import {
  OnInit,
  Output,
  OnDestroy,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { take } from 'rxjs/operators';
import { Subscription, fromEvent } from 'rxjs';

@Directive({
  selector: '[clickOutside]',
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  private captured = false;
  private subscriptions: Subscription[] = [];
  @Output() public clickOutside = new EventEmitter();

  constructor(private _elementRef: ElementRef) {}

  ngOnInit() {
    this.onDocumentClick();
  }

  /**
   * *HostListener function to handle the 'click' event on document
   *
   * @param {Event} target - Getting html element from DragEvent object
   *
   *
   */
  @HostListener('document:click', ['$event.target'])
  onClick(target: HTMLElement) {
    if (!this.captured) {
      return;
    }

    if (!this._elementRef.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }

  /**
   * *A directive that emits an event when a user clicks outside of the element.
   *
   *
   */
  private onDocumentClick(): void {
    this.subscriptions.push(
      fromEvent(document, 'click', { capture: true })
        .pipe(take(1))
        .subscribe(() => (this.captured = true))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
