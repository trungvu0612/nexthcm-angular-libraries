import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseUser, EmployeesService } from '@nexthcm/cdk';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { isPresent, TuiContextWithImplicit, TuiIdentityMatcher, TuiLetModule, TuiStringMatcher } from '@taiga-ui/cdk';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiDataListModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiComboBoxModule } from '@taiga-ui/kit';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { FormFieldModule } from '../../modules/formly-taiga-ui';

@Component({
  selector: 'hcm-formly-user-combo-box',
  templateUrl: './formly-user-combo-box.component.html',
  styleUrls: ['./formly-user-combo-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyUserComboBoxComponent extends FieldType {
  defaultOptions = {
    templateOptions: {
      textfieldSize: 'l',
      textfieldLabelOutside: true,
    },
  };
  readonly search$ = new Subject<string | null>();
  readonly users$: Observable<BaseUser[] | null> = this.search$.pipe(
    filter(isPresent),
    debounceTime(500),
    distinctUntilChanged(),
    switchMap((search) => this.employeesService.searchEmployees(search).pipe(startWith(null))),
    startWith([]),
    shareReplay(1)
  );

  constructor(private employeesService: EmployeesService) {
    super();
  }

  readonly identityMatcher: TuiIdentityMatcher<any> = (item1: BaseUser, item2: BaseUser) => item1.id === item2.id;

  readonly stringify: TuiStringHandler<any> = (item: BaseUser) => item.name;

  readonly keyofUser = (index: string) => index as keyof BaseUser;

  readonly stringify$: Observable<TuiStringHandler<any>> = this.users$.pipe(
    filter(isPresent),
    map((items: BaseUser[]) => new Map(items.map((item) => [item[this.keyofUser(this.to.valueProp)], item.name]))),
    startWith(new Map()),
    map(
      (map) => (id: string | TuiContextWithImplicit<string>) =>
        typeof id === 'string' ? map.get(id) : map.get(id.$implicit) || ''
    )
  );

  readonly strictMatcher: TuiStringMatcher<BaseUser> = (
    item: BaseUser,
    search: string,
    stringify: TuiStringHandler<BaseUser>
  ) => !!item.id && stringify(item).toLowerCase() === search.toLowerCase();
}

@NgModule({
  declarations: [FormlyUserComboBoxComponent],
  imports: [
    CommonModule,
    TuiComboBoxModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [
        {
          name: 'user-combo-box',
          component: FormlyUserComboBoxComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiLoaderModule,
    ReactiveFormsModule,
    TuiLetModule,
  ],
  exports: [FormlyUserComboBoxComponent],
})
export class FormlyUserComboBoxComponentModule {}
