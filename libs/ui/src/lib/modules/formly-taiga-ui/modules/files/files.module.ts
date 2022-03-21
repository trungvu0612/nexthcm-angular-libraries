import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiFilesModule, TuiInputFilesModule } from '@taiga-ui/kit';

import { FormFieldModule } from '../form-field/form-field.module';
import { SharingFileComponent } from './sharing-file/sharing-file.component';
import { UploadFileComponent } from './upload-file/upload-file.component';

@NgModule({
  declarations: [UploadFileComponent, SharingFileComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GetFilePipeModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [
        { name: 'upload-file', component: UploadFileComponent, wrappers: ['form-field'] },
        { name: 'sharing-file', component: SharingFileComponent, wrappers: ['form-field'] },
      ],
    }),
    TuiInputFilesModule,
    TuiFilesModule,
    TuiLetModule,
    PushModule,
  ],
})
export class FilesModule {}
