import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AdminPermissionsService } from '@nexthcm/admin-permissions';
import { FieldType } from '@ngx-formly/core';
import { TuiContextWithImplicit, TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';
import { BehaviorSubject } from 'rxjs';
import { AdminUserRolesService } from '../../services/admin-user-roles.service';

@Component({
  selector: 'hcm-formly-select-permissions',
  templateUrl: './formly-select-permissions.component.html',
  styleUrls: ['./formly-select-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FormlySelectPermissionsComponent extends FieldType implements OnInit {
  columns = ['name', 'code', 'description', 'action'];
  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 100 });

  constructor(
    private adminUserRolesService: AdminUserRolesService,
    private adminPermissionsService: AdminPermissionsService) {
    super();
  }

  ngOnInit(): void {
  }

  readonly stringify: TuiStringHandler<any | TuiContextWithImplicit<any>> = (item) =>
    'name' in item ? item.name : item.$implicit.name;
  readonly identityMatcher: TuiIdentityMatcher<any> = (item1, item2) => item1.id === item2.id;

  changePagination(key: 'page' | 'size', value: number): void {
    this.params$.next({ ...this.params$.value, [key]: value });
  }

  delete(index: number) {
    const result = (this.formControl.value as any[]).slice();
    result.splice(index, 1);
    this.formControl.setValue(result);
  }

  tranfer() {
    //Thang nay goi ve services de lay data policies[] lan dau, luu lai
  }
}
