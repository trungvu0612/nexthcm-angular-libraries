import { NgModule } from '@angular/core';
import { GetFilePipe } from './get-file.pipe';

@NgModule({
  declarations: [GetFilePipe],
  exports: [GetFilePipe],
})
export class GetFileModule {}
