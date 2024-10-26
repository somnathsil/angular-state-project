import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * *Validates if the password and matching password controls match
 *
 * @param {string} controlName - The name of the password control
 * @param {string} matchingControlName - The name of the matching password control
 * @returns A validation error object if the passwords don't match, null otherwise
 *
 * @date 11 May 2022
 *
 */
export function passwordValidator(
  controlName: string,
  matchingControlName: string
) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    // return if controls are null
    if (control === null || matchingControl === null) {
      return null;
    }

    // return if another validator has already found an error on the matchingControl
    if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
      return null;
    }

    // return if matchingControl does not have a value
    if (!matchingControl.value) {
      return null;
    }

    // checking controls values
    if (
      !!control.value &&
      !!matchingControl.value &&
      control.value !== matchingControl.value
    ) {
      matchingControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      matchingControl.setErrors(null);
      return null;
    }
  };
}
