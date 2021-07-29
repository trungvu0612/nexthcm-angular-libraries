import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DefaultConfig } from 'ngx-easy-table';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { BehaviorSubject, from, iif, Subscriber } from 'rxjs';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Category } from '../../models/knowledge';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { KnowledgeBaseService } from '../../services/knowledge-base.service';
import { SweetAlertOptions } from 'sweetalert2';
import { PromptService } from '@nexthcm/ui';

@Component({
  selector: 'hcm-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CategoryComponent {
  readonly configuration = { ...DefaultConfig, paginationEnabled: false, fixedColumnWidth: false };
  readonly columns$ = this.translocoService.selectTranslateObject('KNOWLEDGE_BASE_TABLE').pipe(
    map((translate) => [
      { key: 'creator', title: translate.creator },
      { key: 'category', title: translate.category },
      { key: 'description', title: translate.description },
      { key: 'status', title: translate.status },
      { key: 'action', title: translate.action },
    ])
  );
  readonly params$ = new BehaviorSubject<{ [key: string]: number }>({ size: 10 });
  readonly data$ = this.params$.pipe(switchMap((params) => this.knowledgeBaseService.getCategories(params)));

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

  constructor(
    private readonly knowledgeBaseService: KnowledgeBaseService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService
  ) {}

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
        .pipe(switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions)))
        .subscribe(() => this.params$.next(this.params$.value));
    }
  }

  deleteCategory(id: string) {
    from(this.promptService.open({ icon: 'warning', showCancelButton: true } as SweetAlertOptions))
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.knowledgeBaseService.deleteCategory(id))),
        switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions))
      )
      .subscribe(() => this.params$.next(this.params$.value));
  }

  changePagination(key: 'page' | 'size', value: number): void {
    this.params$.next({ ...this.params$.value, [key]: value });
  }
}
