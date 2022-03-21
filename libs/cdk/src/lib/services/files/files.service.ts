import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(private readonly http: HttpClient, private readonly sanitizer: DomSanitizer) {}

  getFileObject(id: string): Observable<string> {
    return this.http
      .get(`/fileapp/store/file/get?subPath=${id}`, { responseType: 'blob' })
      .pipe(map((blob) => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)) as string));
  }

  getFile(id: string): Observable<Blob> {
    return this.http.get(`/fileapp/store/file/get?subPath=${id}`, { responseType: 'blob' });
  }
}
