import {
  Input,
  Directive,
  Renderer2,
  ElementRef,
  HostListener,
  AfterViewInit,
} from '@angular/core';

@Directive({
  selector: '[autocompleteOff]',
})
export class AutocompleteOffDirective implements AfterViewInit {
  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {}

  @Input('autocompleteOff') autocompleteType!: boolean;

  /**
   * *Disables autocomplete of an Input field by setting a random name and autocomplete attribute value.
   *
   *
   */
  ngAfterViewInit(): void {
    if (this.autocompleteType) {
      this.removeAutoComplete();
    }
  }

  /**
   * *Removes input element autocomplete on blur event.
   *
   * @param {Event} event - The Event object that was triggered
   *
   *
   */
  @HostListener('blur', ['$event'])
  public onValueChange(): void {
    this.removeAutoComplete();
  }

  /**
   * *Removes input element autocomplete by setting a random value in the 'name' and 'autocomplete' attributes of the input element.
   *
   * @remarks
   * This method removes autocomplete by setting a random value in the 'name' and 'autocomplete' attributes of the input element.
   *
   *
   */
  private removeAutoComplete(): void {
    const randomString = Math.random().toString(36).slice(-6);
    this._renderer.setAttribute(
      this._elementRef.nativeElement,
      'name',
      randomString
    );
    this._renderer.setAttribute(
      this._elementRef.nativeElement,
      'autocomplete',
      randomString
    );
  }
}
