import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LeaveTypesService } from '../../leave-types.service';
import { LeaveType } from '../../models/leave-type';
import { Process } from '../../models/process';

@Component({
  selector: 'hcm-upsert-leave-type',
  templateUrl: './upsert-leave-type.component.html',
  styleUrls: ['./upsert-leave-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertLeaveTypeComponent implements OnInit {
  id!: string;
  form!: FormGroup<LeaveType>;
  model!: LeaveType;
  private readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', 0).set('size', 666));
  dataProcesses$ = this.leaveTypeService.getProcesses(this.queryParams$.value).pipe(map((res) => res.data.items));
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid md:grid-cols-1 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'name',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: 'ADMIN_LEAVE_TYPES.LEAVE_TYPES_COLUMNS.name',
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'grid md:grid-cols-1 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'processId',
          type: 'select',
          templateOptions: {
            options: this.dataProcesses$,
            labelProp: 'name',
            valueProp: 'id',
            label: 'ADMIN_LEAVE_TYPES.LEAVE_TYPES_COLUMNS.process',
            required: true,
            translate: true,
            multiple: true,
            compareWith: (item1: Process, item2: Process) => item1.id === item2.id,
          },
        },
      ],
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
            description: 'ADMIN_LEAVE_TYPES.LEAVE_TYPES_COLUMNS.status',
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'grid md:grid-cols-1 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'description',
          type: 'text-area',
          templateOptions: {
            required: true,
            translate: true,
            label: 'ADMIN_LEAVE_TYPES.LEAVE_TYPES_COLUMNS.description',
            placeholder: 'Short Description',
          },
        },
      ],
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private leaveTypeService: LeaveTypesService
  ) {
    this.id = this.activatedRoute.snapshot.params.id;
    this.form = this.formBuilder.group<LeaveType>({
      name: ['', Validators.required],
      deleted: [0],
    });
  }

  ngOnInit(): void {
    if (this.id) {
      this.getLeaveType();
    }
  }

  getLeaveType(): void {
    this.leaveTypeService
      .getLeaveType(this.id)
      .pipe(
        map((type) => {
          const leaveType: LeaveType = { ...type.data };
          this.leaveTypeService.getProcess(type?.data?.processId || '').subscribe((res) => {
            leaveType.process = res?.data;
          });
          return leaveType;
        })
      )
      .subscribe((item) => {
        this.form.patchValue(item);
      });
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.form?.controls?.status?.patchValue(this.form.value.status ? 1 : 0);
    if (this.form.valid) {
      if (this.id) {
        this.leaveTypeService.editLeaveType(this.form.value, this.id).subscribe((item) => {
          this.router.navigateByUrl('/admin/leave-types');
        });
      } else {
        this.leaveTypeService.createLeaveType(this.form.value).subscribe((item) => {
          this.router.navigateByUrl('/admin/leave-types');
        });
      }
    }
  }
}
