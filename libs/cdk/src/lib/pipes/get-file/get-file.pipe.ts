import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

import { FilesService } from '../../services';

@Pipe({
  name: 'getFile',
})
export class GetFilePipe implements PipeTransform {
  constructor(private readonly filesService: FilesService) {}

  transform(value: string): Observable<string> {
    return this.filesService.getFileObject(value);
  }
}

@NgModule({
  declarations: [GetFilePipe],
  exports: [GetFilePipe],
})
export class GetFilePipeModule {}
