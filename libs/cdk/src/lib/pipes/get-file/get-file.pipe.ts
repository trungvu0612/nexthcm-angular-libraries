import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { filterNilValue } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ImagesService } from '../../services';
import { ImagesQuery } from '../../state';

@Pipe({
  name: 'getFile',
})
export class GetFilePipe implements PipeTransform {
  constructor(private readonly imagesQuery: ImagesQuery, private readonly imagesService: ImagesService) {}

  transform(value: string): Observable<string> {
    if (this.imagesQuery.hasEntity(value)) {
      return this.imagesQuery.selectEntity(value).pipe(
        filterNilValue(),
        map((e) => e.objectUrl)
      );
    }
    return this.imagesService.getImage(value);
  }
}

@NgModule({
  declarations: [GetFilePipe],
  exports: [GetFilePipe],
})
export class GetFilePipeModule {}
