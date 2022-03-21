import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { BaseUser } from '@nexthcm/cdk';
import { AvatarComponentModule, FormFieldModule } from '@nexthcm/ui';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiLetModule } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-formly-assignee',
  templateUrl: './formly-assignee.component.html',
  styleUrls: ['./formly-assignee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyAssigneeComponent extends FieldType {
  userInfo = (item: unknown) => item as BaseUser;
}

@NgModule({
  declarations: [FormlyAssigneeComponent],
  imports: [
    CommonModule,
    TuiLetModule,
    AvatarComponentModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [{ name: 'assignee', component: FormlyAssigneeComponent, wrappers: ['form-field'] }],
    }),
    PushModule,
  ],
  exports: [FormlyAssigneeComponent],
})
export class FormlyAssigneeComponentModule {}
