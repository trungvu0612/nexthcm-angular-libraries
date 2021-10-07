import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  constructor(private http: HttpClient) {}

  uploadFile(subPath: string, file: File, keepName = false): Observable<string> {
    const formData = new FormData();

    formData.append('subPath', subPath);
    formData.append('file', file, keepName ? file.name : undefined);
    formData.append('keepName', '' + keepName);
    return this.http.post('/fileapp/store/file/upload', formData, { responseType: 'text' });
  }
}
