import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiCheckboxModule, TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { CookieModule } from 'ngx-cookie';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './pages/login/login.component';

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
