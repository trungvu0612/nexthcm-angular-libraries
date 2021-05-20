import { InjectionToken } from '@angular/core';

export interface Environment {
  production: boolean;
  imageUrl?: string;
  apiUrl: string;
  authUrl?: string;
}

export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT');
