import { APP_INITIALIZER, Provider } from '@angular/core';
import { PermissionsService } from '../services/permissions.service';

export const preLoadPermissions = (permissionsService: PermissionsService) => () =>
  permissionsService.getPermissions().toPromise();

export const INIT_PERMISSIONS_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: preLoadPermissions,
  deps: [PermissionsService],
  multi: true,
};
