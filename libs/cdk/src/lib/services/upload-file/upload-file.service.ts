import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';

import { CropImageDialogComponent } from '../../components';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  constructor(
    private readonly http: HttpClient,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector
  ) {}

  cropImage(data: File): Observable<File> {
    return this.dialogService.open(new PolymorpheusComponent(CropImageDialogComponent, this.injector), { data });
  }

  uploadFile(subPath: string, file: File, keepSize = false, keepName = false): Observable<string> {
    const formData = new FormData();

    formData.append('subPath', subPath);
    formData.append('file', file, keepName ? file.name : undefined);
    formData.append('keepSize', '' + keepSize);
    formData.append('keepName', '' + keepName);
    return this.http.post('/fileapp/store/file/upload', formData, { responseType: 'text' });
  }
}
