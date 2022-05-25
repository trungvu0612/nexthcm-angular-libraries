import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseUser, EmployeesService } from '@nexthcm/cdk';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { isPresent, TuiAutoFocusModule, TuiIdentityMatcher, TuiLetModule, TuiStringMatcher } from '@taiga-ui/cdk';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiDataListModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiComboBoxModule } from '@taiga-ui/kit';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, switchMap } from 'rxjs/operators';

import { FormFieldModule } from '../../modules/formly-taiga-ui';
import { AvatarComponentModule } from '../avatar/avatar.component';

@Component({
  selector: 'hcm-formly-user-combo-box',
  templateUrl: './formly-user-combo-box.component.html',
  styleUrls: ['./formly-user-combo-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyUserComboBoxComponent extends FieldType {
  override defaultOptions = {
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
    switchMap((search) => this.employeesService.searchEmployees(search, this.to['tenantId']).pipe(startWith(null))),
    startWith([])
  );

  constructor(private employeesService: EmployeesService) {
    super();
  }

  readonly identityMatcher: TuiIdentityMatcher<BaseUser> = (item1, item2) => item1.id === item2.id;

  readonly stringify: TuiStringHandler<BaseUser> = (item) => item.name;

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
    AvatarComponentModule,
    PushModule,
    TuiAutoFocusModule,
  ],
  exports: [FormlyUserComboBoxComponent],
})
export class FormlyUserComboBoxComponentModule {}
