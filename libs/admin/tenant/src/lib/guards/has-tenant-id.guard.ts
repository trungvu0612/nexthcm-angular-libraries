import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AdminTenantService } from '../services/admin-tenant.service';

@Injectable({
  providedIn: 'root',
})
export class HasTenantIdGuard implements CanActivate {
  constructor(private router: Router, private adminTenantService: AdminTenantService) {}

  canActivate(): boolean {
    if (this.adminTenantService.get('id')) return true;
    this.router.navigateByUrl('/admin/tenant');
    return false;
  }
}
