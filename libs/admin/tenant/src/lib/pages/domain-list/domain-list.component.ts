import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filterBySearch, UploadFileService } from '@nexthcm/ui';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, combineLatest, Subscriber } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Domain } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'hcm-domain',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomainListComponent {
  readonly searchControl = new FormControl<string>();
  readonly refresh$ = new BehaviorSubject('');
  readonly source$ = this.refresh$.pipe(switchMap(() => this.adminTenantService.getDomains()));
  readonly domains$ = combineLatest([this.source$, this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
    map(([domains, search]) => filterBySearch<Domain>(domains, search, 'domainUrl'))
  );
  readonly form = new FormGroup<Partial<Domain>>({});
  model!: Partial<Domain>;
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'domainUrl',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'domain',
        textfieldLabelOutside: true,
      },
      validation: { messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') } },
    },
  ];

  constructor(
    private readonly adminTenantService: AdminTenantService,
    private readonly uploadFileService: UploadFileService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService
  ) {}

  upsertDomain(content: PolymorpheusContent<TuiDialogContext>, domain?: Partial<Domain>) {
    this.model = domain || {};
    this.dialogService.open(content, { dismissible: false }).subscribe();
  }

  submitDomain(observer: Subscriber<unknown>) {
    if (this.form.valid) {
      observer.complete();
    }
  }
}
