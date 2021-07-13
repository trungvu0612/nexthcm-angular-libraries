import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { FieldType } from '@ngx-formly/core';
import { TuiContextWithImplicit, TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';
import { BehaviorSubject } from 'rxjs';

// import { AdminPermissionsService } from '../../../../../permissions/src/lib/services/admin-permissions.service';

interface Hero {
  readonly id: number;
  readonly name: string;
}

@Component({
  selector: 'hcm-formly-select-permissions',
  templateUrl: './formly-select-permissions.component.html',
  styleUrls: ['./formly-select-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlySelectPermissionsComponent extends FieldType {
  readonly items: ReadonlyArray<Hero> = [
    { id: 1, name: 'Luke Skywalker' },
    { id: 2, name: 'Leia Organa Solo' },
    { id: 3, name: 'Darth Vader' },
    { id: 4, name: 'Han Solo' },
    { id: 5, name: 'Obi-Wan Kenobi' },
    { id: 6, name: 'Yoda' },
  ];

  columns = ['name', 'code', 'description', 'lastModifiedDate', 'action'];
  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 10 });
  // permissions$ = this.params$.pipe(switchMap(() => this.adminPermissionsService.getPermissions(this.params$.value)));

  readonly control = new FormControl([
    {
      id: 4,
      name: 'Han Solo',
    },
  ]);

  constructor() {
    super();
  }

  readonly stringify: TuiStringHandler<any | TuiContextWithImplicit<any>> = (item) =>
    'name' in item ? item.name : item.$implicit.name;
  readonly identityMatcher: TuiIdentityMatcher<any> = (item1, item2) => item1.id === item2.id;

  changePagination(key: 'page' | 'size', value: number): void {
    this.params$.next({ ...this.params$.value, [key]: value });
  }
}
