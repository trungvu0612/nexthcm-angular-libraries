import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { PromptComponent } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { DefaultConfig } from 'ngx-easy-table';
import { from, iif, Subscriber } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OrganizationalLevel } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'hcm-organizational-structure',
  templateUrl: './organizational-structure.component.html',
  styleUrls: ['./organizational-structure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationalStructureComponent {
  @ViewChild('prompt') prompt!: PromptComponent;
  readonly configuration = { ...DefaultConfig, orderEnabled: false, paginationEnabled: false, fixedColumnWidth: false };
  readonly columns$ = this.translocoService.selectTranslateObject('TENANT_TABLE').pipe(
    map((translate) => [
      { key: 'name', title: translate.name },
      { key: 'organizationalLevel', title: translate.organizationalLevel },
      { key: 'parentLevel', title: translate.parentLevel },
      { key: 'companyName', title: translate.companyName },
      { key: 'action', title: translate.action },
    ])
  );
  readonly structure$ = this.adminTenantService.select('structure');
  readonly form = new FormGroup<Partial<OrganizationalLevel>>({});
  model!: Partial<OrganizationalLevel>;
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'orgTypeLabel',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        placeholder: 'enterName',
        textfieldLabelOutside: true,
      },
      validation: { messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') } },
    },
    {
      key: 'parentOrgTypeLabel.id',
      type: 'select',
      templateOptions: {
        required: true,
        translate: true,
        label: 'parentLevel',
        placeholder: 'chooseParentLevel',
        labelProp: 'orgTypeLabel',
        subLabelProp: 'orgType',
        valueProp: 'id',
        options: this.structure$,
        matcherBy: 'id',
      },
      validation: { messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') } },
    },
  ];

  constructor(
    private readonly adminTenantService: AdminTenantService,
    private readonly dialogService: TuiDialogService,
    private readonly translocoService: TranslocoService
  ) {}

  upsertLevel(content: PolymorpheusContent<TuiDialogContext>, level?: Partial<OrganizationalLevel>) {
    this.model = level || {};
    this.dialogService.open(content, { dismissible: false }).subscribe();
  }

  submitLevel(observer: Subscriber<unknown>) {
    if (this.form.valid) {
      this.adminTenantService
        .upsertOrganizationalLevel(this.model, this.model.id ? 'put' : 'post')
        .pipe(switchMap(() => this.prompt.open({ icon: 'success' } as SweetAlertOptions)))
        .subscribe(() => observer.complete());
    }
  }

  deleteLevel(id: string) {
    from(this.prompt.open({ icon: 'warning', showCancelButton: true } as SweetAlertOptions))
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminTenantService.deleteOrganizationalLevel(id))),
        switchMap(() => this.prompt.open({ icon: 'success' } as SweetAlertOptions))
      )
      .subscribe();
  }
}
