import { FormControl, ValidationErrors } from '@angular/forms';

export function validatorTextPermission(maxCharacters: number): (c: FormControl) => ValidationErrors | null {
  return (control: FormControl): ValidationErrors | null => {
    return control.value && (/[^a-zA-Z0-9+=,.@-_]/.test(control.value) || control.value.length > maxCharacters)
      ? {
          textPermission: maxCharacters,
        }
      : null;
  };
}
