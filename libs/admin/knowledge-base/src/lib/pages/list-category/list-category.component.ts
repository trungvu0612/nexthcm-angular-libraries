import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { KnowledgeBaseService } from '@nexthcm/knowledge-base';
import { FormGroup } from '@ngneat/reactive-forms';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent } from 'ngx-easy-table';
import { from, iif, of, Subject, Subscriber } from 'rxjs';
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
import { Category } from '../../models/policies';

@Component({
  selector: 'hcm-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.scss'],
  providers: [RxState, TuiDestroyService],
})
export class ListCategoryComponent extends AbstractServerSortPaginationTableComponent<Category> {
  @ViewChild('table') table!: BaseComponent;
  readonly columns$ = this.translocoService
    .selectTranslateObject('KNOWLEDGE_BASE_TABLE', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((translate) => [
        { key: 'creator', title: translate.creator },
        { key: 'category', title: translate.category },
        { key: 'description', title: translate.description },
        { key: 'status', title: translate.status },
        { key: 'action', title: translate.action, orderEnabled: false },
      ])
    );
  readonly form = new FormGroup<Partial<Category>>({});
  model!: Partial<Category>;
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'status',
      type: 'toggle',
      defaultValue: true,
      templateOptions: {
        translate: true,
        label: 'status',
        textfieldLabelOutside: true,
      },
      hooks: {
        onInit: (field) => {
          if (field?.templateOptions && field.formControl)
            field.templateOptions.status = field.formControl.valueChanges.pipe(
              takeUntil(this.destroy$),
              startWith(field.formControl.value as boolean),
              switchMap((value) => this.translocoService.selectTranslate(value ? 'active' : 'deactivate'))
            );
        },
      },
    },
    {
      key: 'description',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'description',
        textfieldLabelOutside: true,
      },
    },
  ];

  readonly search$ = new Subject<string | null>();
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.knowledgeBaseService.getCategories(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    readonly state: RxState<Pagination<Category>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private knowledgeBaseService: KnowledgeBaseService,
    private promptService: PromptService,
    private translocoService: TranslocoService,
    private dialogService: TuiDialogService,
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

  upsertCategory(content: PolymorpheusContent<TuiDialogContext>, id?: string) {
    if (id) this.knowledgeBaseService.getCategory(id).subscribe((category) => (this.model = category));
    else this.model = {};
    this.dialogService
      .open(content, {
        label: this.translocoService.translate(id ? 'editCategory' : 'addCategory'),
      })
      .subscribe();
  }

  submitCategory(observer: Subscriber<unknown>) {
    if (this.form.valid) {
      observer.complete();
      this.form.markAsUntouched();
      this.model.status = this.model.status ? 1 : 0;
      this.knowledgeBaseService[this.model.id ? 'editCategory' : 'createCategory'](this.model)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse('addNewCategorySuccessfully', () =>
            this.queryParams$.next(this.queryParams$.value)
          )
        );
    }
  }

  deleteCategory(id: string) {
    from(this.promptService.open({ icon: 'warning', showCancelButton: true } as SweetAlertOptions))
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.knowledgeBaseService.deleteCategory(id))),
        switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions)),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.queryParams$.next(this.queryParams$.value));
  }
}
