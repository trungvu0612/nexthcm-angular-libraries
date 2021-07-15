import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { PermissionsResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  constructor(
    private http: HttpClient,
    private ngxRolesService: NgxRolesService,
    private permissionsService: NgxPermissionsService
  ) {}

  getPermissions(): void {
    this.http.get<PermissionsResponse>('/accountapp/v1.0/permissions/me').subscribe((res) => {
      this.permissionsService.loadPermissions(res.permissions);
      this.ngxRolesService.addRoles(res.roles);
    });
  }

  flushRoles(): void {
    this.ngxRolesService.flushRoles();
  }

  flushPermissions(): void {
    this.permissionsService.flushPermissions();
  }
}
