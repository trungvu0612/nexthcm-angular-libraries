import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  constructor(private http: HttpClient) {}

  uploadFile(file: File, subPath: string, keepName = true): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subPath', subPath);
    formData.append('keepName', '' + keepName);
    return this.http.post('/fileapp/store/file/upload', formData, { responseType: 'text' });
  }
}
