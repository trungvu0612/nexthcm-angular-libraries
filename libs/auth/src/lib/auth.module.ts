import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiCheckboxModule, TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { CookieModule } from 'ngx-cookie';

import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { TOKEN_INTERCEPTOR_PROVIDER } from './interceptors';
import { LoginComponent } from './pages';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTableModule,
    TuiSvgModule,
    TuiTextfieldControllerModule,
    TuiInputPasswordModule,
    TuiCheckboxModule,
    TuiCheckboxLabeledModule,
    CookieModule.forRoot(),
    FormlyModule,
    TranslocoModule,
    TuiButtonModule,
    PushModule,
  ],
  providers: [
    TOKEN_INTERCEPTOR_PROVIDER,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'auth', loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class AuthModule {}
