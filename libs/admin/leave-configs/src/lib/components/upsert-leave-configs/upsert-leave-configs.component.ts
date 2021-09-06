import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { LeaveConfigsService } from '../../leave-configs.service';
import { LeaveConfig } from '../../models/leave-config';

@Component({
  selector: 'hcm-upsert-leave-configs',
  templateUrl: './upsert-leave-configs.component.html',
  styleUrls: ['./upsert-leave-configs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertLeaveConfigComponent implements OnInit {
  id!: string;
  form!: FormGroup<LeaveConfig>;
  model!: LeaveConfig;
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    { key: 'tenantId', defaultValue: this.authService.get('userInfo', 'tenantId') },
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
    // {
    //   fieldGroupClassName: 'grid md:grid-cols-1 gap-6 mb-4',
    //   fieldGroup: [
    //     {
    //       key: 'processId',
    //       type: 'select',
    //       templateOptions: {
    //         options: this.dataProcesses$,
    //         labelProp: 'name',
    //         valueProp: 'id',
    //         label: 'ADMIN_LEAVE_TYPES.LEAVE_TYPES_COLUMNS.process',
    //         required: true,
    //         translate: true,
    //         multiple: true,
    //         compareWith: (item1: Process, item2: Process) => item1.id === item2.id,
    //       },
    //     },
    //   ],
    // },
    {
      key: 'processId',
      defaultValue: 'c2b30bfe-0708-11ec-9a03-0242ac130003',
    },
    {
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'status',
          type: 'toggle',
          defaultValue: true,
          templateOptions: {
            textfieldLabelOutside: true,
            labelClassName: 'font-semibold',
          },
          expressionProperties: {
            'templateOptions.label': this.translocoService.selectTranslate('status'),
            'templateOptions.description': this.form?.valueChanges.pipe(
              startWith(null),
              map((value) => value?.status),
              distinctUntilChanged(),
              switchMap((status) => this.translocoService.selectTranslate(`${status ? 'active' : 'inactive'}`))
            ),
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'grid md:grid-cols-2 gap-6 mb-4',
      fieldGroup: [
        {
          key: 'paidLeave',
          type: 'toggle',
          defaultValue: true,
          templateOptions: { textfieldLabelOutside: true, labelClassName: 'font-semibold' },
          expressionProperties: {
            'templateOptions.label': this.translocoService.selectTranslate(
              'ADMIN_LEAVE_TYPES.LEAVE_TYPES_COLUMNS.paidLeave'
            ),
            'templateOptions.description': this.form?.valueChanges.pipe(
              startWith(null),
              map((value) => value?.status),
              distinctUntilChanged(),
              switchMap((status) => this.translocoService.selectTranslate(`${status ? 'active' : 'inactive'}`))
            ),
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
  private readonly queryParams$ = new BehaviorSubject(new HttpParams().set('page', 0).set('size', 666));
  dataProcesses$ = this.leaveTypeService.getProcesses(this.queryParams$.value).pipe(map((res) => res.data.items));

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<LeaveConfig, LeaveConfig>,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private leaveTypeService: LeaveConfigsService,
    private translocoService: TranslocoService
  ) {}

  // getLeaveType(): void {
  //   this.leaveTypeService
  //     .getLeaveType(this.id)
  //     .pipe(
  //       map((type) => {
  //         const leaveType: LeaveType = { ...type.data };
  //         this.leaveTypeService.getProcess(type?.data?.workflowId || '').subscribe((res) => {
  //           leaveType.process = res?.data;
  //         });
  //         return leaveType;
  //       })
  //     )
  //     .subscribe((item) => {
  //       this.form.patchValue(item);
  //     });
  // }

  // submit(): void {
  //   this.form.markAllAsTouched();
  //   this.form?.controls?.status?.patchValue(this.form.value.status ? 1 : 0);
  //   if (this.form.valid) {
  //     if (this.id) {
  //       this.leaveTypeService.editLeaveType(this.form.value, this.id).subscribe((item) => {
  //         this.router.navigateByUrl('/admin/leave-configs');
  //       });
  //     } else {
  //       this.leaveTypeService.createLeaveType(this.form.value).subscribe((item) => {
  //         this.router.navigateByUrl('/admin/leave-configs');
  //       });
  //     }
  //   }
  // }

  ngOnInit(): void {
    if (this.context.data) {
      this.model = { ...this.model, ...this.context.data };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };
      this.context.completeWith(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
