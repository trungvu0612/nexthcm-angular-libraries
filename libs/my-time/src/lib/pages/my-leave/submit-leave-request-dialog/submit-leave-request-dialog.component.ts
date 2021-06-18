import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiBooleanHandler, TuiDay } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Duration, LeaveSubmit } from '../../../models/submit-leave';
import { MyLeaveService } from '../../../services/my-leave/my-leave.service';
import { SubmitLeaveService } from '../../../services/submit-leave.service';

@Component({
  selector: 'hcm-submit-leave-request-dialog',
  templateUrl: './submit-leave-request-dialog.component.html',
  styleUrls: ['./submit-leave-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitLeaveRequestDialogComponent implements OnInit {
  @Output() formValueEvent = new EventEmitter<string>();

  nameItemList: any[] = [];
  data$: Observable<any> = this.myLeaveService.getLeaveType().pipe(map((data) => data.items));
  dataDuration$: Observable<any> = this.myLeaveService.getdurations().pipe(map((data) => data.data.items));
  dataSendTo$: Observable<any> = this.myLeaveService.getSendTo().pipe(map((data) => data.data.items));

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'col-span-full',
      key: 'leaveType',
      type: 'filter',
      templateOptions: {
        options: this.data$,
        labelProp: 'name',
        size: 's',
        single: true,
      },
    },

    {
      className: 'col-span-full',
      template: `
        <div class="my-8">
        <div style="border: 1px solid #e4e4e4"></div>
        </div>
        <h3 class="text-xl font-semibold">Paid Leave</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna
        fringilla urna, porttitor</p>
        </div>
        `,
    },

    {
      key: 'startTime',
      type: 'input-date',
      templateOptions: {
        label: 'From Date',
        placeholder: 'From Date',
        description: 'From Date',
        required: true,
      },
    },

    {
      key: 'endTime',
      type: 'input-date',
      templateOptions: {
        label: 'To Date',
        placeholder: 'To Date',
        description: 'To Date',
        required: true,
      },
    },

    {
      key: 'duration',
      type: 'select',
      templateOptions: {
        options: this.dataDuration$,
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Duration',
      },
    },

    {
      key: 'sendTo',
      type: 'select',
      templateOptions: {
        options: this.dataSendTo$,
        labelProp: 'username',
        valueProp: 'id',
        placeholder: 'Send to',
      },
    },

    {
      className: 'col-span-full',
      key: 'comments',
      type: 'text-area',
      templateOptions: {
        textfieldSize: 'l',
        expandable: false,
        rows: 4,
      },
    },
  ];
  model: LeaveSubmit = {};

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, LeaveSubmit>,
    private submitLeaveService: SubmitLeaveService,
    private myLeaveService: MyLeaveService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  submit() {
    if (this.form.valid) {
      const leaveRequestModel = this.form.value;
      leaveRequestModel.leaveType = leaveRequestModel.leaveType[0];
      leaveRequestModel.startTime = format((leaveRequestModel.startTime as TuiDay).toLocalNativeDate(), 'MM-dd-yyyy');
      leaveRequestModel.endTime = format((leaveRequestModel.endTime as TuiDay).toLocalNativeDate(), 'MM-dd-yyyy');
      const obj: Duration = {
        id: leaveRequestModel.duration,
      };
      leaveRequestModel.duration = obj;
      this.context.completeWith(leaveRequestModel);
    }
  }
}
