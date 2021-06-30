import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';

interface AppPermissions {
  [k: string]: string[];
}

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
    this.http.get<AppPermissions>('/accountapp/v1.0/permissions/me').subscribe((res) => {
      this.ngxRolesService.addRoles(res);
      this.permissionsService.loadPermissions(new Array<string>().concat(...Object.values(res)));
    });
  }

  flushRoles(): void {
    this.ngxRolesService.flushRoles();
  }
}
