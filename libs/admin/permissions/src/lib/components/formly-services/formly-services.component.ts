import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldArrayType } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-services',
  templateUrl: './formly-services.component.html',
  styleUrls: ['./formly-services.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyServicesComponent extends FieldArrayType {}
