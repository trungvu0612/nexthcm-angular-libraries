import { HttpClient } from '@angular/common/http';
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'getFile',
})
export class GetFilePipe implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  transform(value: string): Observable<string> {
    return this.http
      .get('/fileapp/store/file/get', { params: { subPath: value }, responseType: 'blob' })
      .pipe(map((blob) => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)) as string));
  }
}

@NgModule({
  declarations: [GetFilePipe],
  exports: [GetFilePipe],
})
export class GetFilePipeModule {}
