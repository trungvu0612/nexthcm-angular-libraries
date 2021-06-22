import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'hcm-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionListComponent {
  columns = ['name', 'description', 'service', 'action'];
  servicesLength$ = this.adminPermissions.getServices().pipe(map((items) => items.length));
  policies$ = this.adminPermissions.getPolicies();

  constructor(private adminPermissions: AdminPermissionsService) {}
}
