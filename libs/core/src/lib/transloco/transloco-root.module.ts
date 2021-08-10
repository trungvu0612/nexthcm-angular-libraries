import { NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';

@NgModule({
  imports: [
    TranslocoLocaleModule.init({
      langToLocaleMapping: {
        en: 'en-US',
        vi: 'vi-VN'
      }
    }),
    TranslocoModule,
  ],
  exports : [
    TranslocoModule 
  ]
})
export class TranslocoRootModule {}