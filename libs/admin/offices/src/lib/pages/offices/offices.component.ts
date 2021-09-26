import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService, Zone } from '@nexthcm/cdk';
import { FormGroup } from '@ngneat/reactive-forms';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent } from 'ngx-easy-table';
import { from, of, Subject, Subscriber } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { Office } from '../../models/office';
import { AdminOfficesService } from '../../services/admin-offices.service';

@Component({
  selector: 'hcm-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class OfficesComponent extends AbstractServerSortPaginationTableComponent<Office> implements OnInit {
  @ViewChild('table') table!: BaseComponent;
  readonly columns$ = this.translocoService
    .selectTranslateObject('ZONE_TABLE', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((translate) => [
        { key: 'name', title: translate.name },
        { key: 'address', title: translate.address },
        { key: 'description', title: translate.description },
        { key: 'action', title: translate.action, orderEnabled: false },
      ])
    );

  readonly search$ = new Subject<string | null>();
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminOfficesService.getOffices(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  readonly form = new FormGroup({});
  model!: Partial<Zone>;
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'officeName',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'address',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'address',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'description',
      type: 'text-area',
      templateOptions: {
        label: 'description',
        translate: true,
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    readonly state: RxState<Pagination<Office>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private adminOfficesService: AdminOfficesService,
    private translocoService: TranslocoService,
    private dialogService: TuiDialogService,
    private promptService: PromptService,
    private destroy$: TuiDestroyService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.search$.pipe(
        filter(isPresent),
        debounceTime(300),
        distinctUntilChanged(),
        tap((searchQuery) => this.queryParams$.next(this.queryParams$.value.set('search', searchQuery)))
      )
    );
  }

  ngOnInit(): void {
    const searchParam = this.activatedRoute.snapshot.queryParams.search;
    if (searchParam) this.search$.next(searchParam);
  }

  upsertOffice(content: PolymorpheusContent<TuiDialogContext>, office?: Partial<Zone>): void {
    this.model = office || { status: 0, longitude: 0, latitude: 0 };
    this.dialogService
      .open(content, {
        label: this.translocoService.translate(this.model.id ? 'editOffice' : 'createOffice'),
      })
      .subscribe();
  }

  submitOffice(observer: Subscriber<unknown>) {
    if (this.form.valid) {
      observer.complete();
      this.form.markAsUntouched();
      this.adminOfficesService[this.model.id ? 'editOffice' : 'createOffice'](this.model)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse(this.model.id ? 'updateOfficeSuccessfully' : 'addOfficeSuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }

  deleteOffice(id: string) {
    if (id) {
      from(
        this.promptService.open({
          icon: 'question',
          html: this.translocoService.translate('deleteOffice'),
          showCancelButton: true,
        })
      )
        .pipe(
          filter((result) => result.isConfirmed),
          switchMap(() =>
            this.adminOfficesService.deleteOffice(id).pipe(tap(() => this.queryParams$.next(this.queryParams$.value)))
          ),
          catchError((err) => this.promptService.open({ icon: 'error', text: err.error.message })),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }
}
