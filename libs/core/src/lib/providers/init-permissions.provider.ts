import { APP_INITIALIZER, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { PermissionsResponse } from '../models/permission-response';
import { PermissionsService } from '../services/permissions.service';

export const INIT_PERMISSIONS_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  useFactory(permissionsService: PermissionsService): () => Observable<PermissionsResponse> {
    return () => permissionsService.getPermissions();
  },
  deps: [PermissionsService],
  multi: true,
};
