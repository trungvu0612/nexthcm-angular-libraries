import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdminUserRolesService } from '../../../../../user-roles/src/lib/services/admin-user-roles.service';
import { AdminPermissionsService } from '@nexthcm/admin-permissions';
import { TuiContextWithImplicit, TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';
import { FieldType } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-select-job-titles',
  templateUrl: './formly-select-job-titles.component.html',
  styleUrls: ['./formly-select-job-titles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormlySelectJobTitlesComponent extends FieldType implements OnInit {

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

}
