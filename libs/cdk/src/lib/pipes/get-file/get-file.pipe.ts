import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { filterNilValue } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FilesService } from '../../services';
import { FileObjectsQuery } from '../../state';

@Pipe({
  name: 'getFile',
})
export class GetFilePipe implements PipeTransform {
  constructor(private readonly query: FileObjectsQuery, private readonly filesService: FilesService) {}

  transform(value: string): Observable<string> {
    if (this.query.hasEntity(value)) {
      return this.query.selectEntity(value).pipe(
        filterNilValue(),
        map((e) => e.objectUrl)
      );
    }
    return this.filesService.getFileObject(value);
  }
}

@NgModule({
  declarations: [GetFilePipe],
  exports: [GetFilePipe],
})
export class GetFilePipeModule {}
