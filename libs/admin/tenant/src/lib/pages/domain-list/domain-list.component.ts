import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination, PromptService, Tenant, UploadFileService } from '@nexthcm/cdk';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns, DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, from, Observable, of, Subscriber } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  startWith,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { Domain } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'hcm-domain',
  templateUrl: './domain-list.component.html',
  styleUrls: ['./domain-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState]
})
export class DomainListComponent {
  @ViewChild('table') table!: BaseComponent;
  private readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', 0).set('size', 10));
  readonly searchControl = new FormControl<string>();
  readonly form = new FormGroup<Partial<Domain>>({});
  model!: Partial<Domain>;
  domainId: string | undefined;
  readonly configuration = { ...DefaultConfig, paginationEnabled: false };
  readonly columns$: Observable<Columns[]> = this.translocoService.selectTranslateObject('ZONE_TABLE').pipe(
    map((result) => [
      { key: 'name', title: result.name },
      { key: 'domainUrl', title: result.domainUrl },
      { key: 'status', title: result.status },
      { key: 'action', title: result.action }
    ])
  );

  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'Domain name',
        textfieldLabelOutside: true
      }
    },
    {
      key: 'status',
      className: 'tui-form__row block',
      type: 'toggle',
      templateOptions: {
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold'
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('ADMIN_CONTRACT_MANAGEMENT_COLUMNS.status'),
        'templateOptions.description': this.form?.valueChanges.pipe(
          startWith(null),
          map((value) => value?.status),
          distinctUntilChanged(),
          switchMap((status) => this.translocoService.selectTranslate(`${status ? 'active' : 'inactive'}`))
        )
      }
    },
    {
      key: 'domainUrl',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'Domain',
        textfieldLabelOutside: true
      }
    }
  ];

  data$ = this.adminTenantService.getTenantDetail(this.adminTenantService.get('id')).pipe(map((res) => res.domains));

  constructor(
    public state: RxState<Pagination<Tenant>>,
    private readonly adminTenantService: AdminTenantService,
    private readonly uploadFileService: UploadFileService,
    private readonly translocoService: TranslocoService,
    private router: Router,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private destroy$: TuiDestroyService,
    private activatedRoute: ActivatedRoute,
    private promptService: PromptService,
    private cdr: ChangeDetectorRef
  ) {
  }

  upsertDomain(content: PolymorpheusContent<TuiDialogContext>, id?: string) {
    if (id) {
      this.domainId = id;
      this.adminTenantService.getDomainDetail(id).subscribe((item) => {
        this.form.patchValue(item);
      });
    }
    this.dialogService
      .open(content, {
        label: this.translocoService.translate(id ? 'editDomain' : 'createDomain')
      })
      .subscribe((item) => {
        this.cdr.detectChanges();
      });
  }

  submitDomain(observer: Subscriber<unknown>, id?: string) {
    if (this.form.valid) {
      const formModel = this.form.value;
      const dataDomain = {
        id: '',
        status: formModel.status,
        name: formModel.name,
        domainUrl: formModel.domainUrl,
        tenant: {
          id: this.adminTenantService.get('id')
        }
      };
      if (id) {
        dataDomain.id = id;
        this.adminTenantService
          .editDomain(dataDomain)
          .pipe(
            mapTo({ icon: 'success', text: 'Update Domain Successfully!' } as SweetAlertOptions),
            takeUntil(this.destroy$),
            catchError((err) =>
              of({
                icon: 'error',
                text: err.error.message,
                showCancelButton: true,
                showConfirmButton: false
              } as SweetAlertOptions)
            ),
            switchMap((options) => this.promptService.open(options)),
            filter((result) => result.isConfirmed),
            takeUntil(this.destroy$)
          )
          .subscribe(() => {
            observer.complete();
            this.cdr.detectChanges();
          });
      } else {
        this.adminTenantService
          .createDomain(dataDomain)
          .pipe(
            mapTo({ icon: 'success', text: 'Add Domain Successfully!' } as SweetAlertOptions),
            takeUntil(this.destroy$),
            catchError((err) =>
              of({
                icon: 'error',
                text: err.error.message,
                showCancelButton: true,
                showConfirmButton: false
              } as SweetAlertOptions)
            ),
            switchMap((options) => this.promptService.open(options)),
            filter((result) => result.isConfirmed),
            takeUntil(this.destroy$)
          )
          .subscribe(() => {
            observer.complete();
            this.cdr.detectChanges();
          });
      }
      this.form.markAsUntouched();
    }
  }

  deleteDomain(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('ZONE_TABLE.MESSAGES.deleteDomain'),
        showCancelButton: true
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() =>
          this.adminTenantService.deleteDomain(id).pipe(
            mapTo({ icon: 'success', text: 'Delete Domain Successfully!' } as SweetAlertOptions),
            takeUntil(this.destroy$),
            tap(() => this.queryParams$.next(this.queryParams$.value)))
        ),
        catchError((err) =>
          this.promptService.open({
            icon: 'error',
            html: this.translocoService.translate(`ERRORS.${err.error.message}`)
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
