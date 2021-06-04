import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Provider } from '@angular/core';
import { Translation, TRANSLOCO_LOADER, TranslocoLoader } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../app-config.token';
import { AppConfig } from '../models';

@Injectable({
  providedIn: 'root',
})
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient, @Inject(APP_CONFIG) protected appConfig: AppConfig) {}

  getTranslation(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`${this.appConfig.baseUrl}/assets/i18n/${lang}.json`);
  }
}

export const httpLoader: Provider = { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader };
