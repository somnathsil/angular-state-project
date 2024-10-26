import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[middleControlClick]',
})
export class MiddleControlClickDirective {
  @Output() middleControlClick: EventEmitter<Event> = new EventEmitter();

  /**
   * *Listen to the 'mouseup' event and emit the 'middleControlClick' event on middle mouse click or control + left click
   *
   * @param {MouseEvent} event - The original 'MouseEvent' object
   *
   *
   */
  @HostListener('mouseup', ['$event'])
  public onMouseUp(event: MouseEvent) {
    if (event.button === 1 || (event.ctrlKey && event.button === 0)) {
      event.preventDefault();
      event.stopPropagation();

      this.middleControlClick.emit(event);
    }
  }

  /**
   * *Listen to the 'wheel' event and prevent the default action and propagation to prevent accidental scrolling while middle or control + left clicking
   *
   * @param {WheelEvent} event - The original 'WheelEvent' object
   *
   *
   */
  @HostListener('wheel', ['$event'])
  public onWheel(event: WheelEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
