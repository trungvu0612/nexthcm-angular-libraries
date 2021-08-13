import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLabelModule, TuiTooltipModule } from '@taiga-ui/core';
import { TuiFieldErrorModule, TuiInputFileModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { FormFieldModule } from '../form-field/form-field.module';
import { UploadFileComponent } from './upload-file/upload-file.component';

@NgModule({
  declarations: [UploadFileComponent],
  imports: [
    CommonModule,
    TuiInputFileModule,
    TuiFieldErrorModule,
    ReactiveFormsModule,
    TuiLabelModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [{ name: 'upload-file', component: UploadFileComponent, wrappers: ['form-field'] }],
    }),
    TuiTooltipModule,
    PolymorpheusModule,
    GetFilePipeModule,
  ],
})
export class FilesModule {}
