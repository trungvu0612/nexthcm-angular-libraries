import { FormControl, ValidationErrors } from '@angular/forms';
import { TuiValidationError } from '@taiga-ui/cdk';

export function validatorText(maxCharacters: number): (c: FormControl) => ValidationErrors | null {
  return (control: FormControl): ValidationErrors | null => {
    return !control.value || /[^a-zA-Z0-9+=,.@-_]/.test(control.value) || control.value.length > maxCharacters
      ? {
          name: new TuiValidationError(
            "Use alphanumeric and '+=,.@-_' characters. Maximum " + maxCharacters + ' characters.'
          ),
        }
      : null;
  };
}
