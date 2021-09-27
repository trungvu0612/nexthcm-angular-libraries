import { Provider } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { FORMLY_CONFIG, FormlyFieldConfig } from '@ngx-formly/core';

export class TranslateExtension {
  constructor(private translate: TranslocoService) {}

  prePopulate(field: FormlyFieldConfig): void {
    const to = field.templateOptions || {};
    if (!to.translate || to._translated) {
      return;
    }

    to._translated = true;
    field.expressionProperties = {
      ...(field.expressionProperties || {}),
      'templateOptions.label': this.translate.selectTranslate(to.label || '', to.labelParams, to.translocoScope),
      'templateOptions.placeholder': this.translate.selectTranslate(
        to.placeholder || '',
        to.placeholderParams,
        to.translocoScope
      ),
      'templateOptions.description': this.translate.selectTranslate(
        to.description || '',
        to.descriptionParams,
        to.translocoScope
      ),
      'templateOptions.labelText': this.translate.selectTranslate(
        to.labelText || '',
        to.labelTextParams,
        to.translocoScope
      ),
      'templateOptions.linkText': this.translate.selectTranslate(
        to.linkText || '',
        to.linkTextParams,
        to.translocoScope
      ),
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
        { name: 'email', message: () => translate.selectTranslate('VALIDATION.email') },
        { name: 'numeric', message: () => translate.selectTranslate('VALIDATION.numeric') },
      ],
    };
  },
  deps: [TranslocoService],
  multi: true,
};
