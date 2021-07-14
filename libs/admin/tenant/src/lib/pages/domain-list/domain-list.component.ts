import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filterBySearch, UploadFileService, ValidationService } from '@nexthcm/ui';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, combineLatest, Subscriber } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Domain } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';

@Component({
  selector: 'hcm-domain',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DomainListComponent implements OnInit {
  isAdd!: boolean;
  readonly searchControl = new FormControl<string>();
  readonly refresh$ = new BehaviorSubject('');
  readonly source$ = this.refresh$.pipe(switchMap(() => this.adminTenantService.getDomains()));
  readonly domains$ = combineLatest([this.source$, this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
    map(([domains, search]) => filterBySearch<Domain>(domains, search, 'domainUrl')),
    map((domains) => Array(3).fill(domains[0]) as Domain[])
  );
  readonly form = new FormGroup<Partial<Domain>>({});
  model: Partial<Domain> = {};
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'tenant.tenantName',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        disabled: true,
        label: 'companyName',
        textfieldLabelOutside: true,
      },
      ...this.validationService.getValidation(['required']),
    },
    {
      key: 'tenant.image',
      type: 'upload-file',
      templateOptions: {
        required: true,
        translate: true,
        disabled: true,
        label: 'companyLogo',
        linkText: 'chooseAnImage',
        labelText: 'orDropItHere',
        accept: 'image/*',
        previewImage: true,
        serverRequest: (file: File) => this.uploadFileService.uploadFile('admin-tenant/domain', file),
      },
    },
    {
      key: 'domainUrl',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'domain',
        textfieldLabelOutside: true,
      },
      ...this.validationService.getValidation(['required']),
    },
  ];

  constructor(
    private readonly adminTenantService: AdminTenantService,
    private readonly uploadFileService: UploadFileService,
    private readonly validationService: ValidationService,
    private readonly dialogService: TuiDialogService
  ) {}

  ngOnInit(): void {
    this.model = { tenant: this.adminTenantService.get() };
  }

  showDialog(content: PolymorpheusContent<TuiDialogContext>, domain?: Partial<Domain>) {
    if (domain) {
      this.isAdd = false;
      Object.assign(this.model, domain);
    } else this.isAdd = true;
    this.dialogService.open(content).subscribe();
  }

  save(observer: Subscriber<unknown>) {
    observer.complete();
  }
}
