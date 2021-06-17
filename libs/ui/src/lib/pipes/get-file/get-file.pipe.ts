import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'getFile',
})
export class GetFilePipe implements PipeTransform {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  transform(value: string): Observable<SafeUrl> {
    return value
      ? this.http
          .get('/fileapp/store/file/get', {
            params: { subPath: value },
            responseType: 'blob',
          })
          .pipe(map((blob) => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))))
      : of('');
  }
}
