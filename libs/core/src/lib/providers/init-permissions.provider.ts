import { APP_INITIALIZER, Provider } from '@angular/core';
import { PermissionsResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { PermissionsService } from '../services/permissions.service';

export const INIT_PERMISSIONS_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory(permissionsService: PermissionsService): () => Observable<PermissionsResponse> {
    return () => permissionsService.getPermissions();
  },
  deps: [PermissionsService],
  multi: true,
};
