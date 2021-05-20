import { TuiCheckboxLabeledModule, TuiCheckboxModule, TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieModule } from 'ngx-cookie';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiTableModule,
    TuiSvgModule,
    TuiTextfieldControllerModule,
    TuiInputPasswordModule,
    TuiCheckboxModule,
    TuiCheckboxLabeledModule,
    HttpClientModule,
    RouterModule,
    CookieModule.forRoot(),
  ],
})
export class AuthModule {}
