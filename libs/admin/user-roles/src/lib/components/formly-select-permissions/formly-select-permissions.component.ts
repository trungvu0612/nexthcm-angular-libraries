import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { FieldType } from '@ngx-formly/core';
import { TuiContextWithImplicit, TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';
import { Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../../models/admin-user-role';

@Component({
  selector: 'hcm-formly-select-permissions',
  templateUrl: './formly-select-permissions.component.html',
  styleUrls: ['./formly-select-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlySelectPermissionsComponent extends FieldType {
  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    orderEnabled: false,
  };

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_USER_ROLE_PERMISSION_COLUMNS')
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'code', title: result.code },
        { key: 'description', title: result.description },
        { key: 'functions', title: result.functions },
      ])
    );

  constructor(private translocoService: TranslocoService) {
    super();
  }

  item = (item: any) => item;

  readonly stringify: TuiStringHandler<any | TuiContextWithImplicit<any>> = (item) =>
    'name' in item ? item.name : item.$implicit.name;
  readonly identityMatcher: TuiIdentityMatcher<any> = (item1, item2) => item1.id === item2.id;

  delete(index: number) {
    const result = (this.formControl.value as Item[]).slice();
    result.splice(index, 1);
    this.formControl.setValue(result);
  }
}
