import { TuiCheckboxLabeledModule, TuiCheckboxModule, TuiInputModule, TuiInputPasswordModule } from '@taiga-ui/kit';
import { TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { LoginComponent } from './pages/login/login.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  ],
})
export class AuthModule {}
