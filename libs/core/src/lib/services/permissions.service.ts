import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PermissionsResponse } from '../models/permission-response';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(
    private http: HttpClient,
    private ngxRolesService: NgxRolesService,
    private permissionsService: NgxPermissionsService
  ) {}

  getPermissions(): Observable<PermissionsResponse> {
    return this.http.get<PermissionsResponse>('/accountapp/v1.0/permissions/me').pipe(
      catchError(() => of({ permissions: [], roles: {} })),
      tap((res) => {
        this.permissionsService.loadPermissions(res.permissions);
        this.ngxRolesService.addRoles(res.roles);
      })
    );
  }

  flushPermissions(): void {
    this.ngxRolesService.flushRoles();
    this.permissionsService.flushPermissions();
  }
}
