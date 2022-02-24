import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@datorama/akita-ng-effects';
import { CommonStatus, PromptService, UploadFileService } from '@nexthcm/cdk';
import { KnowledgeBaseArticle, KnowledgeBaseService } from '@nexthcm/knowledge-base';
import { AbstractControl, FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, debounceTime, map, share, startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { AdminKnowledgeBaseService } from '../../admin-knowledge-base.service';
import { KnowledgeBaseCategoriesQuery, loadKnowledgeBaseCategories } from '../../state/knowledge-base-categories';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-upsert-knowledge-base-article',
  templateUrl: './upsert-knowledge-base-article.component.html',
  styleUrls: ['./upsert-knowledge-base-article.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertKnowledgeBaseArticleComponent {
  form = this.fb.group<KnowledgeBaseArticle>({} as KnowledgeBaseArticle);
  model = {} as KnowledgeBaseArticle;
  oldTopic = '';
  fields: FormlyFieldConfig[] = [
    {
      key: 'topic',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        required: true,
        textfieldLabelOutside: true,
        label: `${TRANSLATION_SCOPE}.topic`,
        labelClassName: 'font-semibold',
        placeholder: `${TRANSLATION_SCOPE}.enterTopic`,
      },
      asyncValidators: {
        topic: {
          expression: (control: AbstractControl<string>) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : control.valueChanges.pipe(
                  debounceTime(1000),
                  take(1),
                  switchMap((name: string) =>
                    this.oldTopic === name
                      ? of(true)
                      : this.adminKnowledgeBaseService.checkKnowledgeBaseArticleNameExists(name)
                  ),
                  tap(() => control.markAsTouched())
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.valueExisting'),
        },
      },
    },
    {
      key: 'thumbnail',
      className: 'tui-form__row block',
      type: 'upload-file',
      templateOptions: {
        required: true,
        accept: 'image/*',
        labelClassName: 'font-semibold',
        previewImage: true,
        serverRequest: this.uploadFileService.uploadFile.bind(this.uploadFileService, 'policy'),
      },
      expressionProperties: {
        'templateOptions.linkText': this.translocoService.selectTranslate('chooseImage'),
        'templateOptions.labelText': this.translocoService.selectTranslate('dragHere'),
        'templateOptions.label': this.translocoService.selectTranslate('thumbnail'),
      },
    },
    {
      key: 'policyCategory',
      className: 'tui-form__row block',
      type: 'select',
      templateOptions: {
        translate: true,
        required: true,
        label: 'category',
        labelClassName: 'font-semibold',
        placeholder: 'chooseCategory',
        options: this.knowledgeBaseCategoriesQuery.selectAll(),
        labelProp: 'name',
      },
    },
    {
      key: 'statusBoolean',
      className: 'tui-form__row block',
      type: 'status-toggle',
      defaultValue: true,
      templateOptions: {
        translate: true,
        label: 'status',
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
      },
    },
    {
      key: 'shortDescription',
      className: 'tui-form__row block',
      type: 'text-area',
      templateOptions: {
        translate: true,
        textfieldLabelOutside: true,
        label: 'description',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
      },
    },
    {
      key: 'longDescription',
      className: 'tui-form__row block',
      type: 'editor',
      templateOptions: {
        translate: true,
        required: true,
        textfieldLabelOutside: true,
        label: 'content',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
      },
    },
    { key: 'id' },
    { key: 'mobileThumbnail' },
  ];
  private readonly request$ = (this.articleId
    ? this.knowledgeBaseService.getKnowledgeBaseArticle(this.activatedRoute.snapshot.params.articleId).pipe(
        tap((data) => {
          this.oldTopic = data.topic;
          this.model = { ...this.model, ...data, statusBoolean: data.status === CommonStatus.active };
        })
      )
    : of({})
  ).pipe(startWith(null), share());
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly fb: FormBuilder,
    private readonly knowledgeBaseService: KnowledgeBaseService,
    private readonly adminKnowledgeBaseService: AdminKnowledgeBaseService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly uploadFileService: UploadFileService,
    private readonly knowledgeBaseCategoriesQuery: KnowledgeBaseCategoriesQuery,
    private readonly actions: Actions
  ) {
    actions.dispatch(loadKnowledgeBaseCategories());
  }

  get articleId(): string {
    return this.activatedRoute.snapshot.params.articleId;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      formModel.status = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      this.adminKnowledgeBaseService
        .upsertKnowledgeBaseArticle(formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse(
            `adminKnowledgeBase.${formModel.id ? 'updateArticleSuccessfully' : 'createArticleSuccessfully'}`,
            () => {
              if (!formModel.id) {
                this.onCancel();
              }
            }
          )
        );
    }
  }

  onCancel(): void {
    this.router.navigateByUrl('/admin/knowledge-base/articles');
  }
}
