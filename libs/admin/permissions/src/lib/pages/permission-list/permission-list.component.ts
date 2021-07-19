import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AdminPermissionsService } from '../../services/admin-permissions.service';
import { DefaultConfig } from 'ngx-easy-table';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'hcm-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrls: ['./permission-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionListComponent {
  readonly configuration = { ...DefaultConfig, paginationEnabled: false, fixedColumnWidth: false };
  readonly columns$ = this.translocoService.selectTranslateObject('PERMISSION_TABLE').pipe(
    map((translate) => [
      { key: 'name', title: translate.name },
      { key: 'code', title: translate.code },
      { key: 'description', title: translate.description },
      { key: 'action', title: translate.action },
    ])
  );
  params$ = new BehaviorSubject<{ [key: string]: number }>({ size: 10 });
  data$ = this.params$.pipe(switchMap(() => this.adminPermissionsService.getPermissions(this.params$.value)));

  constructor(
    private adminPermissionsService: AdminPermissionsService,
    private readonly translocoService: TranslocoService
  ) {}

  changePagination(key: 'page' | 'size', value: number): void {
    this.params$.next({ ...this.params$.value, [key]: value });
  }
}
