import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiCheckboxModule, TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { CookieModule } from 'ngx-cookie';
import { TOKEN_INTERCEPTOR_PROVIDER } from './interceptors';
import { LoginComponent, LogoutComponent } from './pages';

@NgModule({
  declarations: [LoginComponent, LogoutComponent],
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
  ],
  providers: [TOKEN_INTERCEPTOR_PROVIDER],
})
export class AuthModule {}
