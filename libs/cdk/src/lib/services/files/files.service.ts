import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { map } from 'rxjs/operators';

import { CropImageDialogComponent } from '../../components';

const FILES_CACHE = new Map<string, Observable<Blob>>();

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(
    private readonly http: HttpClient,
    private readonly sanitizer: DomSanitizer,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector
  ) {}

  getFile(id: string): Observable<Blob> {
    let file$ = FILES_CACHE.get(id);
    if (!file$) {
      file$ = this.http.get(`/fileapp/store/file/get?subPath=${id}`, { responseType: 'blob' }).pipe(shareReplay(1));
      FILES_CACHE.set(id, file$);
    }
    return file$;
  }

  getFileObject(id: string): Observable<string> {
    return this.getFile(id).pipe(
      map((blob) => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob)) as string)
    );
  }

  cropImage(data: File): Observable<File> {
    return this.dialogService.open(new PolymorpheusComponent(CropImageDialogComponent, this.injector), { data });
  }

  uploadFile(subPath: string, file: File, keepSize = false, keepName = false): Observable<string> {
    const formData = new FormData();

    formData.append('subPath', subPath);
    formData.append('file', file, keepName ? file.name : undefined);
    formData.append('keepSize', '' + keepSize);
    formData.append('keepName', '' + keepName);

    return this.http
      .post('/fileapp/store/file/upload', formData, { responseType: 'text' })
      .pipe(tap((id) => FILES_CACHE.set(id, of(file))));
  }
}
