import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { JobLevelService } from '../job-level.service';
import { Level } from '../models/level';

@Component({
  selector: 'hcm-upsert-job-level',
  templateUrl: './upsert-job-level.component.html',
  styleUrls: ['./upsert-job-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertJobLevelComponent implements OnInit {
  id!: string;
  form!: FormGroup<Level>;
  model!: Level;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'name',
          type: 'input',
          templateOptions: {
            textfieldLabelOutside: true,
            required: true,
            placeholder: 'Topic',
          },
        },
      ],
    },
    {
      key: 'description',
      type: 'text-area',
      templateOptions: {
        required: true,
        textfieldLabelOutside: true,
        placeholder: 'Reason',
      },
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private levelService: JobLevelService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.form = this.formBuilder.group<Level>({
      orgId: 'd6e6eec4-bd8c-4a34-bf3f-f2d3a11716aa',
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: [0],
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.getLevel();
    }
  }

  getLevel(): void {
    this.levelService.getLevel(this.id).subscribe((item) => {
      this.form.patchValue(item);
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.id) {
        this.levelService.editLevel(this.form.value, this.id).subscribe((item) => {
          this.router.navigateByUrl('/admin/job-level');
        });
      } else {
        this.levelService.createLevel(this.form.value).subscribe((item) => {
          this.router.navigateByUrl('/admin/job-level');
        });
      }
    }
  }

  cancel() {
    this.router.navigateByUrl('/admin/job-level');
  }
}
