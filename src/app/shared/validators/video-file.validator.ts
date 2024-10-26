import { AbstractControl, ValidationErrors } from '@angular/forms';

export function videoFileValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    const fileVaue = control.value;
    //const fileSizeInMB = fileVaue.size / (2 * 1024 * 1024);
    const allowedFileTypes = ['mp4'];

    const fileType = fileVaue
      ? fileVaue.name?.split('.').pop().toLowerCase()
      : '';

    if (fileVaue === '' || fileVaue === null) {
      return null;
    }

    if (control?.errors) {
      return null;
    }

    if (typeof fileVaue === 'object' && fileVaue instanceof File) {
      if (allowedFileTypes.indexOf(fileType) === -1) {
        return { fileTypeError: true };
      }
    } else {
      return null;
    }

    return null;
  };
}
