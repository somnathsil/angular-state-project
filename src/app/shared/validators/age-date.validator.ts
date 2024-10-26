import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function AgeDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let currentDate = new Date();
    const value = control.value;

    // return if controls are null
    if (value === null || value === '') {
      return null;
    }
    let oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds

    // 18+ validation

    if (
      currentDate.getFullYear() <= value.getFullYear() &&
      (currentDate.getTime() - value.getTime()) / oneDay < 6570
    ) {
      return { isNotAdult: true };
    }

    return null;
  };
}
