import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@nexthcm/auth';
import { Organization, OrganizationsService } from '@nexthcm/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { FieldType, FormlyModule } from '@ngx-formly/core';
import { LetModule } from '@rx-angular/template';
import { TuiIdentityMatcher } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiSelectModule } from '@taiga-ui/kit';
import { FormFieldModule } from '../../modules/formly-taiga-ui';

@Component({
  selector: 'hcm-formly-select-org-tree',
  templateUrl: './formly-select-org-tree.component.html',
  styleUrls: ['./formly-select-org-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlySelectOrgTreeComponent extends FieldType {
  defaultOptions = {
    templateOptions: {
      textfieldSize: 'l',
      textfieldLabelOutside: true,
    },
  };
  readonly orgTree$ = this.organizationsService.getOrganizationChart(
    this.authService.get('userInfo', 'tenantId') as string
  );

  constructor(private organizationsService: OrganizationsService, private authService: AuthService) {
    super();
  }

  readonly identityMatcher: TuiIdentityMatcher<any> = (item1, item2) => item1.id === item2.id;

  trackByOrgId(index: number, org: Organization): string {
    return org.id;
  }
}

@NgModule({
  declarations: [FormlySelectOrgTreeComponent],
  imports: [
    CommonModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [{ name: 'select-org-tree', component: FormlySelectOrgTreeComponent, wrappers: ['form-field'] }],
    }),
    TuiSelectModule,
    ReactiveFormsModule,
    TuiTextfieldControllerModule,
    TuiDataListModule,
    TuiLoaderModule,
    TranslocoModule,
    LetModule,
    TuiButtonModule,
  ],
  exports: [FormlySelectOrgTreeComponent],
})
export class FormlySelectOrgTreeComponentModule {}
