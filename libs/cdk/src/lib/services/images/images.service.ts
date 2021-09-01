import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ImagesStore } from '../../state';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  constructor(
    private readonly http: HttpClient,
    private readonly sanitizer: DomSanitizer,
    private readonly imagesStore: ImagesStore
  ) {}

  getImage(id: string): Observable<string> {
    return this.http.get(`/fileapp/store/file/get?subPath=${id}`, { responseType: 'blob' }).pipe(
      map((blob) => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)) as string),
      tap((url) => this.imagesStore.upsert(id, { id, objectUrl: url }))
    );
  }
}
