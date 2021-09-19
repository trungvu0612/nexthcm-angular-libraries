import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { AbstractServerPaginationTableComponent, Pagination, PromptService, Zone } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
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
import { SweetAlertOptions } from 'sweetalert2';
import { AdminOfficesService } from '../../services/admin-offices.service';
import { Office } from '../../models/office';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hcm-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class OfficesComponent extends AbstractServerPaginationTableComponent<Office> implements OnInit {
  @ViewChild('table') table!: BaseComponent;
  readonly columns$ = this.translocoService.selectTranslateObject('ZONE_TABLE').pipe(
    map((translate) => [
      { key: 'name', title: translate.name },
      { key: 'address', title: translate.address },
      { key: 'description', title: translate.description },
      { key: 'action', title: translate.action },
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
    readonly state: RxState<Pagination<Office>>,
    private adminOfficesService: AdminOfficesService,
    private translocoService: TranslocoService,
    private dialogService: TuiDialogService,
    private promptService: PromptService,
    private activatedRoute: ActivatedRoute,
    private destroy$: TuiDestroyService
  ) {
    super(state);
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
        .pipe(
          switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions)),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.queryParams$.next(this.queryParams$.value));
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
