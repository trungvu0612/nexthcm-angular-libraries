import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Level } from '../../../models/level';
import { JobLevelService } from '../../../services/job-level.service';

@Component({
  selector: 'hcm-upsert-job-level',
  templateUrl: './upsert-job-level.component.html',
  styleUrls: ['./upsert-job-level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertJobLevelComponent implements OnInit {
  id!: string;
  levelForm!: FormGroup<Level>;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private levelService: JobLevelService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.levelForm = this.formBuilder.group<Level>({
      orgId: 'd6e6eec4-bd8c-4a34-bf3f-f2d3a11716aa',
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: [0]
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.getLevel();
    }
  }

  getLevel(): void {
    this.levelService.getLevel(this.id).subscribe((item) => {
      this.levelForm.patchValue(item);
    });
  }

  submit(): void {
    this.levelForm.markAllAsTouched();
    if (this.levelForm.valid) {
      if (this.id) {
        this.levelService.editLevel(this.levelForm.value, this.id).subscribe((item) => {
          this.router.navigateByUrl('/human-resource/job-level');
        });
      } else {
        this.levelService.createLevel(this.levelForm.value).subscribe((item) => {
          this.router.navigateByUrl('/human-resource/job-level');
        });
      }
    }
  }
}
