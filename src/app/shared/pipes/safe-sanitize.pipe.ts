import {
  SafeUrl,
  SafeHtml,
  SafeStyle,
  SafeScript,
  DomSanitizer,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safe',
  standalone: true,
})
export class SafeSanitizePipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) {}

  /**
   * *Transforms a value into a trusted HTML, style, script, URL, or resource URL formats.
   *
   * @param {any} value - The value to be transformed.
   * @param {string} type - The type of the safe value that should be returned.
   * @returns The sanitized version of the value.
   *
   *
   */
  public transform(
    value: string,
    type: string
  ): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html':
        return this._sanitizer.bypassSecurityTrustHtml(value);
      case 'style':
        return this._sanitizer.bypassSecurityTrustStyle(value);
      case 'script':
        return this._sanitizer.bypassSecurityTrustScript(value);
      case 'url':
        return this._sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl':
        return this._sanitizer.bypassSecurityTrustResourceUrl(value);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
