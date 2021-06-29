import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Policy } from '../../policies';
import { PoliciesService } from '../../policies.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { UploadFileService } from '@nexthcm/ui';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'hcm-upsert-policies',
  templateUrl: './upsert-policies.component.html',
  styleUrls: ['./upsert-policies.component.scss'],
  providers: [TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertPoliciesComponent implements OnInit {
  id!: string;
  form!: FormGroup<Policy>;
  model!: Policy;
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
            label: 'ADMIN_POLICIES.POLICIES_MANAGEMENT_COLUMNS.topic'
          },
          validation: {
            messages: {
              required: () => this.translocoService.selectTranslate('VALIDATION.required')
            }
          }
        }
      ]
    },
    {
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'status',
          type: 'toggle',
          templateOptions: {
            required: true,
            translate: true,
            description: 'ADMIN_POLICIES.POLICIES_MANAGEMENT_COLUMNS.status'
          }
        },
        {
          className: 'attachFile',
          key: 'thumbnail',
          type: 'upload-file',
          templateOptions: {
            accept: 'image/*',
            textfieldSize: 's',
            translate: true,
            label: 'ADMIN_POLICIES.POLICIES_MANAGEMENT_COLUMNS.thumbnail',
            previewImage: true,
            serverRequest: this.uploadFileService.uploadFile.bind(this.uploadFileService, 'policy')
          }
        }
      ]
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
            label: 'ADMIN_POLICIES.POLICIES_MANAGEMENT_COLUMNS.shortDescription',
            placeholder: 'Short Description'
          }
        }
      ]
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
            label: 'ADMIN_POLICIES.POLICIES_MANAGEMENT_COLUMNS.longDescription'
          }
        }
      ]
    },
    {
      key: 'mobileThumbnail'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private uploadFileService: UploadFileService,
    private cdr: ChangeDetectorRef,
    private translocoService: TranslocoService,
    private destroy$: TuiDestroyService,
    private policiesService: PoliciesService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.form = this.formBuilder.group<Policy>({});
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
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.form?.controls?.mobileThumbnail?.patchValue(this.form?.controls?.thumbnail?.value);
      this.form?.controls?.status?.patchValue(this.form.value.status ? 1 : 0);
      if (this.id) {
        this.policiesService.editPolicies(this.form.value, this.id).subscribe((item) => {
          this.router.navigateByUrl('/admin/policies');
        });
      } else {
        this.policiesService.createPolicies(this.form.value).subscribe((item) => {
          this.router.navigateByUrl('/admin/policies');
        });
      }
    }
  }
}
