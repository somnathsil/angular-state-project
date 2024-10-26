import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: 'img[imageFallback]',
})
export class ImageFallbackDirective {
  constructor(private _elementRef: ElementRef) {}

  @Input() fallbackImage!: string;

  /**
   * *HostListener function listen to 'error' event on the image element
   * *and update the source with fallback image URL on error
   *
   *
   */
  @HostListener('error')
  public onError() {
    const element: HTMLImageElement = <HTMLImageElement>(
      this._elementRef.nativeElement
    );
    element.src = this.fallbackImage || './assets/images/no-image.svg';
  }
}
