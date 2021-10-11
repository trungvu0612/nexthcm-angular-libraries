import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService, UploadFileService } from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TRANSLOCO_SCOPE, TranslocoScope } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { AdminKnowledgeBaseService } from '../../admin-knowledge-base.service';
import { AdminPolicy } from '../../models/policies';

@Component({
  selector: 'hcm-upsert-policy',
  templateUrl: './upsert-policy.component.html',
  styleUrls: ['./upsert-policy.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertPolicyComponent implements OnInit {
  id!: string;
  form!: FormGroup<AdminPolicy>;
  model!: AdminPolicy;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid md:grid-cols-1 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'topic',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: 'topic',
            translocoScope: this.scope,
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'grid md:grid-cols-1 mb-4',
      fieldGroup: [
        {
          key: 'status',
          type: 'toggle',
          defaultValue: true,
          templateOptions: {
            translate: true,
            description: 'status',
            translocoScope: this.scope,
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'policyCategory.id',
          type: 'select',
          templateOptions: {
            translate: true,
            label: 'category',
            labelClassName: 'font-semibold',
            placeholder: 'ADMIN_POLICIES.chooseCategory',
            options: this.policiesService.select('categories'),
            valueProp: 'id',
            labelProp: 'name',
          },
        },
        {
          className: 'attachFile',
          key: 'thumbnail',
          type: 'upload-file',
          templateOptions: {
            accept: 'image/*',
            textfieldSize: 's',
            translate: true,
            label: 'thumbnail',
            previewImage: true,
            serverRequest: this.uploadFileService.uploadFile.bind(this.uploadFileService, 'policy'),
            translocoScope: this.scope,
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'grid md:grid-cols-1 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'shortDescription',
          type: 'text-area',
          templateOptions: {
            required: true,
            translate: true,
            label: 'shortDescription',
            placeholder: 'Short Description',
            translocoScope: this.scope,
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'grid md:grid-cols-1 gap-6',
      fieldGroup: [
        {
          key: 'longDescription',
          type: 'editor',
          templateOptions: {
            required: true,
            translate: true,
            label: 'longDescription',
            translocoScope: this.scope,
          },
        },
      ],
    },
    { key: 'mobileThumbnail' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private uploadFileService: UploadFileService,
    private cdr: ChangeDetectorRef,
    private destroy$: TuiDestroyService,
    private policiesService: AdminKnowledgeBaseService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly promptService: PromptService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.form = this.formBuilder.group<AdminPolicy>({});
  }

  ngOnInit(): void {
    if (this.id) {
      this.getLevel();
    }
  }

  getLevel(): void {
    this.policiesService.getPolicy(this.id).subscribe((item) => {
      this.form.patchValue(item);
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.form?.controls?.mobileThumbnail?.patchValue(this.form?.controls?.thumbnail?.value);
      this.form?.controls?.status?.patchValue(this.form.value.status ? 1 : 0);
      if (this.id) {
        this.policiesService
          .editPolicies(this.form.value, this.id)
          .subscribe(
            this.promptService.handleResponse('adminKnowledgeBase.updatePolicySuccessfully', () =>
              this.router.navigateByUrl('/admin/knowledge-base')
            )
          );
      } else {
        this.policiesService
          .createPolicies(this.form.value)
          .subscribe(
            this.promptService.handleResponse('adminKnowledgeBase.createPolicySuccessfully', () =>
              this.router.navigateByUrl('/admin/knowledge-base')
            )
          );
      }
    }
  }
}
