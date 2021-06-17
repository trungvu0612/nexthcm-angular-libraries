import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { TuiHostedDropdownComponent } from '@taiga-ui/core';
import { Permission, ServiceInfo } from '../../models/permission';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'hcm-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionListComponent implements OnInit {
  @ViewChild(TuiHostedDropdownComponent) component?: TuiHostedDropdownComponent;
  open = false;
  items = ['All', 'One', 'Two'];
  indexItem = 0;
  columns = ['name', 'description', 'service', 'action'];
  servicesInfo!: ServiceInfo[];
  permissions!: Permission[];

  constructor(private adminPermissions: AdminPermissionsService) {}

  onClick(index: number) {
    this.open = false;
    this.indexItem = index;
    if (this.component && this.component.nativeFocusableElement) this.component.nativeFocusableElement.focus();
  }

  ngOnInit(): void {
    this.adminPermissions.getPermissions().subscribe((data) => (this.permissions = data));
    this.adminPermissions.getServicesInfo().subscribe((data) => (this.servicesInfo = data));
  }
}
