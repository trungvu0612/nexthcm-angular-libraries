import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'hcm-repeat-departments',
  templateUrl: './repeat-departments.component.html',
  styleUrls: ['./repeat-departments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RepeatDepartmentsComponent extends FieldArrayType {}

