import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';

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
      'templateOptions.label': this.translate.selectTranslate(to.label || '', to.labelParams),
      'templateOptions.placeholder': this.translate.selectTranslate(to.placeholder || ''),
      'templateOptions.description': this.translate.selectTranslate(to.description || ''),
      'templateOptions.labelText': this.translate.selectTranslate(to.labelText || ''),
      'templateOptions.linkText': this.translate.selectTranslate(to.linkText || ''),
    };
  }
}

export const registerTranslateExtension = (translate: TranslocoService) => ({
  extensions: [{ name: 'translate', extension: new TranslateExtension(translate) }],
});
