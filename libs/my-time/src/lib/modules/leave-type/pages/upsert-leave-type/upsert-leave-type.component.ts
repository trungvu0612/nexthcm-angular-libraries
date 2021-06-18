import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { LeaveType } from '../../../../models/leave-type';
import { LeaveTypeService } from '../../../../services/leave-type.service';

@Component({
  selector: 'hcm-upsert-leave-type',
  templateUrl: './upsert-leave-type.component.html',
  styleUrls: ['./upsert-leave-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpsertLeaveTypeComponent implements OnInit {
  id!: string;
  leaveTypeForm!: FormGroup<LeaveType>;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leaveTypeService: LeaveTypeService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.leaveTypeForm = this.formBuilder.group<LeaveType>({
      orgId: '3ca97c73-7312-4191-b54d-3a8e0cc9e4dd',
      name: ['', Validators.required],
      deleted: [0]
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.getLeaveType();
    }
  }

  getLeaveType(): void {
    this.leaveTypeService.getLeaveType(this.id).subscribe((item) => {
      this.leaveTypeForm.patchValue(item);
    });
  }

  submit(): void {
    this.leaveTypeForm.markAllAsTouched();
    if (this.leaveTypeForm.valid) {
      if (this.id) {
        this.leaveTypeService.editLeaveType(this.leaveTypeForm.value, this.id).subscribe((item) => {
          this.router.navigateByUrl('/my-time/leave-type/list');
        });
      } else {
        this.leaveTypeService.createLeaveType(this.leaveTypeForm.value).subscribe((item) => {
          this.router.navigateByUrl('/my-time/leave-type/list');
        });
      }
    }
  }
}
