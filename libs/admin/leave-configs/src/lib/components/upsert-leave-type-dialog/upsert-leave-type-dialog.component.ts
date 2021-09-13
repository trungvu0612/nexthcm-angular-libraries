import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { LeaveConfigsService } from '../../leave-configs.service';
import { LeaveType } from '../../models/leave-type';

@Component({
  selector: 'hcm-upsert-leave-type-dialog',
  templateUrl: './upsert-leave-type-dialog.component.html',
  styleUrls: ['./upsert-leave-type-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertLeaveTypeDialogComponent implements OnInit {
  form = this.fb.group<LeaveType>({} as LeaveType);
  model = {} as LeaveType;
  fields: FormlyFieldConfig[] = [
    { key: 'id', defaultValue: '' },
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
            label: 'name',
          },
        },
      ],
    },
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
          templateOptions: {
            textfieldLabelOutside: true,
            labelClassName: 'font-semibold',
            translate: true,
            label: 'paidLeave',
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
            label: 'description',
            placeholder: 'Short Description',
          },
        },
      ],
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<LeaveType, LeaveType>,
    private fb: FormBuilder,
    private authService: AuthService,
    private leaveConfigsService: LeaveConfigsService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = { ...this.model, ...this.context.data };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = {
        ...this.form.value,
      };
      formModel.status = formModel.status ? 1 : 0;
      this.context.completeWith(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
