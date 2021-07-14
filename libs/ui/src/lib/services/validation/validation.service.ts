import { Injectable } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';

type ValidFunc = (control: FormControl) => ValidationErrors | null;

interface Messages {
  [key: string]: () => Observable<string>;
}

interface Validation {
  validation: { messages: Messages };
  validators: { validation: ValidFunc[] };
}

const EMAIL_VALIDATOR = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  private requiredMessage: Messages = {
    required: () => this.translocoService.selectTranslate<string>('VALIDATION.required'),
  };
  private emailMessage: Messages = {
    email: () => this.translocoService.selectTranslate<string>('VALIDATION.invalidEmail'),
  };

  constructor(private translocoService: TranslocoService) {}

  getValidation(messages?: string[], validators?: string[]): Validation {
    const result: Validation = { validation: { messages: {} }, validators: { validation: [] } };
    const addMessage = (key: string) => {
      if (this[(key + 'Message') as keyof this])
        Object.assign(result.validation.messages, this[(key + 'Message') as keyof this]);
    };
    if (messages) {
      messages.forEach((key) => {
        addMessage(key);
      });
    }
    if (validators) {
      validators.forEach((key) => {
        const validator = this[(key + 'Validator') as keyof this];
        if (validator) {
          result.validators.validation.push(validator as any);
          addMessage(key);
        }
      });
    }
    return result;
  }

  private emailValidator: ValidFunc = (control: FormControl): ValidationErrors | null =>
    control.value && !EMAIL_VALIDATOR.test(control.value)
      ? {
          email: true,
        }
      : null;
}
