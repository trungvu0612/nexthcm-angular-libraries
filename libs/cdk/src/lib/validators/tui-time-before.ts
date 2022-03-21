import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TuiTime } from '@taiga-ui/cdk';

export function tuiTimeBefore(fieldName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controlToCompare = control.root.get(fieldName);
    if (
      control.value instanceof TuiTime &&
      controlToCompare?.value instanceof TuiTime &&
      control.value.toAbsoluteMilliseconds() >= controlToCompare.value.toAbsoluteMilliseconds()
    ) {
      return { tuiTimeBefore: true };
    }
    return null;
  };
}
