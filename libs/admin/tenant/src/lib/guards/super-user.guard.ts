import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SuperUserGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (route.queryParams.superUser === 'true') return true;
    this.router.navigateByUrl('/admin/tenant/information');
    return false;
  }
}
