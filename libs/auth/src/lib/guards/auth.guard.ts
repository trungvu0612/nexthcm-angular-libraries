import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthQuery } from '../state/auth/auth.query';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authQuery: AuthQuery) {}

  canActivate(): boolean {
    if (this.authQuery.isLoggedIn()) {
      return true;
    }
    this.router.navigateByUrl('/auth');
    return false;
  }
}
