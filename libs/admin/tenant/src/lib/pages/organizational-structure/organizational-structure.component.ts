import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PromptService } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, from, iif, Subscriber } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { OrganizationalLevel } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';

@Component({
  selector: 'hcm-organizational-structure',
  templateUrl: './organizational-structure.component.html',
  styleUrls: ['./organizational-structure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationalStructureComponent {
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
  readonly refresh$ = new BehaviorSubject('');
  readonly structure$ = this.refresh$.pipe(switchMap(() => this.adminTenantService.getOrganizationalStructure()));
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
    },
    {
      key: 'parentOrgTypeLabel',
      type: 'select',
      templateOptions: {
        required: true,
        translate: true,
        label: 'parentLevel',
        placeholder: 'chooseParentLevel',
        labelProp: 'orgTypeLabel',
        subLabelProp: 'orgType',
        options: this.structure$,
        matcherBy: 'id',
      },
    },
  ];

  constructor(
    private readonly adminTenantService: AdminTenantService,
    private readonly dialogService: TuiDialogService,
    private readonly translocoService: TranslocoService,
    private promptService: PromptService
  ) {}

  upsertLevel(content: PolymorpheusContent<TuiDialogContext>, level?: Partial<OrganizationalLevel>) {
    this.model = level || {};
    this.dialogService
      .open(content, {
        label: this.translocoService.translate(this.model.id ? 'editOrganizationalLevel' : 'addOrganizationalLevel'),
      })
      .subscribe();
  }

  submitLevel(observer: Subscriber<unknown>) {
    if (this.form.valid) {
      observer.complete();
      this.form.markAsUntouched();
      this.adminTenantService
        .upsertOrganizationalLevel(this.model, this.model.id ? 'put' : 'post')
        .pipe(switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions)))
        .subscribe(() => this.refresh$.next(''));
    }
  }

  deleteLevel(id: string) {
    from(this.promptService.open({ icon: 'warning', showCancelButton: true } as SweetAlertOptions))
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminTenantService.deleteOrganizationalLevel(id))),
        switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions))
      )
      .subscribe(() => this.refresh$.next(''));
  }
}
