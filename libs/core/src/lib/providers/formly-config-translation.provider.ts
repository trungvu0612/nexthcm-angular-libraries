import { Provider } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { FORMLY_CONFIG, FormlyFieldConfig } from '@ngx-formly/core';

export class TranslateExtension {
  constructor(private translate: TranslocoService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const to = field.templateOptions || {};
    if (!to['translate'] || to['_translated']) {
      return;
    }

    to['_translated'] = true;
    field.expressionProperties = {
      ...(field.expressionProperties || {}),
      'templateOptions.label': this.translate.selectTranslate(to.label || '', to['labelParams']),
      'templateOptions.placeholder': this.translate.selectTranslate(to.placeholder || '', to['placeholderParams']),
      'templateOptions.description': this.translate.selectTranslate(to.description || '', to['descriptionParams']),
      'templateOptions.labelText': this.translate.selectTranslate(to['labelText'] || '', to['labelTextParams']),
      'templateOptions.linkText': this.translate.selectTranslate(to['linkText'] || '', to['linkTextParams']),
    };
  }
}

export const FORMLY_CONFIG_TRANSLATION_PROVIDER: Provider = {
  provide: FORMLY_CONFIG,
  useFactory(translate: TranslocoService) {
    return {
      extensions: [{ name: 'translate', extension: new TranslateExtension(translate) }],
      validationMessages: [
        { name: 'required', message: () => translate.selectTranslate('VALIDATION.required') },
        { name: 'requiredError', message: () => translate.selectTranslate('VALIDATION.required') },
        { name: 'email', message: () => translate.selectTranslate('VALIDATION.email') },
        { name: 'numeric', message: () => translate.selectTranslate('VALIDATION.numeric') },
        {
          name: 'maxLength',
          message: (error: { requiredLength: number }) =>
            translate.selectTranslate('VALIDATION.maxLength', { length: error.requiredLength }),
        },
        {
          name: 'maxLengthError',
          message: (error: { maxLength: number }) =>
            translate.selectTranslate('VALIDATION.maxLength', { length: error.maxLength }),
        },
      ],
    };
  },
  deps: [TranslocoService],
  multi: true,
};
