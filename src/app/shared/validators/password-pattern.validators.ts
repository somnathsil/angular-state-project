import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordPattern {
  static isReadOnly: boolean = false;

  static passwordValidation(): ValidatorFn {
    return (controls: AbstractControl): ValidationErrors | null => {
      const value = controls.value;
      const errors: ValidationErrors = {};

      if (value === null || value === '') {
        return null;
      }

      if (!/[A-Z]/g.test(value)) {
        errors['upperCase'] = true;
      }
      if (!/[a-z]/g.test(value)) {
        errors['lowerCase'] = true;
      }
      if (!/[0-9]/g.test(value)) {
        errors['number'] = true;
      }
      if (!/[$&+,:;=?@#|'<>.^*()%!_\/\\-]/g.test(value)) {
        errors['specialCharacter'] = true;
      }
      if (!(value.length >= 8)) {
        errors['length'] = true;
      }
      // if (Object.keys(errors).length === null) {
      // }
      // if (Object.keys(errors).length == null) {
      //   this.isReadOnly=true;
      //   return this.isReadOnly
      // }
      return Object.keys(errors).length ? errors : null;
    };
  }
}
