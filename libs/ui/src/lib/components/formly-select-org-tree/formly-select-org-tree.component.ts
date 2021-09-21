import { Component, OnInit, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'hcm-formly-select-org-tree',
  templateUrl: './formly-select-org-tree.component.html',
  styleUrls: ['./formly-select-org-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormlySelectOrgTreeComponent extends FieldType {

  constructor() {
    super();
  }
}

@NgModule({
  declarations: [FormlySelectOrgTreeComponent],
  imports: [CommonModule,
    FormlyModule.forChild({
      types: [{ name: 'select-org-tree', component: FormlySelectOrgTreeComponent }]
    })],
  exports: [FormlySelectOrgTreeComponent]
})
export class FormlySelectOrgTreeComponentModule {
}
