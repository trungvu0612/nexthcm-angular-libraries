import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { map } from 'rxjs/operators';
import { WorkingHourService } from '../../services/working-hour.service';

@Component({
  selector: 'hcm-request-update-time',
  templateUrl: './request-update-time.component.html',
  styleUrls: ['./request-update-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestUpdateTimeComponent implements OnInit {
  userInfo: any;
  dataUsersReport$ = this.workingHourService.getAllUsers().pipe(map((res) => res.data.items));

  readonly form = new FormGroup({
    filters: new FormControl([]),
  });
  model: any = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'createdDate',
      type: 'input-date',
      templateOptions: {
        textfieldSize: 'l',
        label: 'Request for date',
        required: true,
      },
    },
    {
      key: 'sendTo',
      type: 'select',
      templateOptions: {
        options: this.dataUsersReport$,
        labelProp: 'username',
        valueProp: 'id',
        placeholder: 'Send To *',
      },
    },
    {
      key: 'newInTime',
      type: 'input-time',
      templateOptions: {
        label: 'Check in Time',
        required: true,
      },
    },
    {
      key: 'newOutTime',
      type: 'input-time',
      templateOptions: {
        label: 'Check out Time',
        required: true,
      },
    },
    {
      className: 'col-span-full',
      key: 'comments',
      type: 'text-area',
      templateOptions: {
        label: 'Reason *',
        textfieldSize: 'm',
        expandable: false,
        rows: 4,
      },
    },
  ];

  constructor(
    private workingHourService: WorkingHourService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  submitRequestTime() {
    this.userInfo = this.authService.get('userInfo');
    const formModel = this.form.value;
    formModel.createdDate = (formModel.createdDate as TuiDay).toLocalNativeDate().valueOf();
    formModel.newInTime = (formModel?.newInTime as TuiTime).toAbsoluteMilliseconds().valueOf();
    formModel.newOutTime = (formModel?.newOutTime as TuiTime).toAbsoluteMilliseconds().valueOf();
    formModel.timeSheetId = this.userInfo.userId;
    formModel.status = 0;
    console.log(formModel);
    this.workingHourService.submitRequestTime(formModel).subscribe((item) => {
      console.log(item);
      // this.router.navigateByUrl('/my-time/working-hour');
    });
  }
}
