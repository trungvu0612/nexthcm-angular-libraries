import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DefaultConfig } from 'ngx-easy-table';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { PolymorpheusContent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { Subscriber } from 'rxjs';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Category } from '../../models/knowledge';
import { TuiDestroyService } from '@taiga-ui/cdk';

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
      { key: 'action', title: translate.action },
    ])
  );
  data = [
    { creator: 'Lorem ipsum', category: 'Lorem ipsum', status: false },
    { creator: 'Lorem ipsum', category: 'Lorem ipsum', status: false },
  ];

  readonly form = new FormGroup<Partial<Category>>({});
  model!: Partial<Category>;
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'category',
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
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService
  ) {}

  upsertCategory(content: PolymorpheusContent<TuiDialogContext>, category?: Partial<Category>) {
    this.model = category || {};
    this.dialogService
      .open(content, {
        label: this.translocoService.translate(this.model.id ? 'editCategory' : 'addCategory'),
      })
      .subscribe();
  }

  submitCategory(observer: Subscriber<unknown>) {
    if (this.form.valid) {
      observer.complete();
    }
  }
}
