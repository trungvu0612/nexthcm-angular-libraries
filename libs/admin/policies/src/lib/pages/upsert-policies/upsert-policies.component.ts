import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Policy } from '../../policies';
import { PoliciesService } from '../../policies.service';
import { FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'hcm-upsert-policies',
  templateUrl: './upsert-policies.component.html',
  styleUrls: ['./upsert-policies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertPoliciesComponent implements OnInit {

  id!: string;
  form!: FormGroup<Policy>;
  model!: Policy;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid md:grid-cols-1 gap-6 mb-4',
      fieldGroup: [{
        key: 'topic',
        type: 'input',
        templateOptions: {
          textfieldLabelOutside: true,
          required: true,
          placeholder: 'Topic'
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
            required: true
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
            textfieldLabelOutside: true,
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
            textfieldLabelOutside: true
          }
        }
      ]
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
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
      this.form?.controls?.status?.patchValue(this.form.value.status ? 1 : 0);
      if (this.id) {
        this.policiesService.editPolicies(this.form.value, this.id).subscribe((item) => {
          this.router.navigateByUrl('/admin/policies');
        });
      } else {
        this.policiesService.createPolicies(this.form.value).subscribe((item) => {
          this.router.navigateByUrl('/human-resource/job-level');
        });
      }
    }
  }

}
