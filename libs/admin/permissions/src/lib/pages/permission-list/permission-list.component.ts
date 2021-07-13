import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'hcm-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionListComponent {
  columns = ['name', 'code', 'description', 'lastModifiedDate', 'action'];
  params$ = new BehaviorSubject<{ [key: string]: number }>({ size: 10 });
  permissions$ = this.params$.pipe(switchMap(() => this.adminPermissionsService.getPermissions(this.params$.value)));

  constructor(private adminPermissionsService: AdminPermissionsService) {}

  changePagination(key: 'page' | 'size', value: number): void {
    this.params$.next({ ...this.params$.value, [key]: value });
  }
}
