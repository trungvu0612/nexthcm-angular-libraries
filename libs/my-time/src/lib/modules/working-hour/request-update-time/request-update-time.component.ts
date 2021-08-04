import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { PromptService, Zone } from '@nexthcm/cdk';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { WorkingHourService } from '../../../services/working-hour.service';

@Component({
  selector: 'hcm-request-update-time',
  templateUrl: './request-update-time.component.html',
  styleUrls: ['./request-update-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestUpdateTimeComponent implements OnInit {
  id = this.context.data || '';
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
        placeholder: 'Send To',
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
        label: 'Reason',
        textfieldSize: 'm',
        expandable: false,
        rows: 4,
        required: true,
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private context: TuiDialogContext<Partial<Zone> | null, Partial<Zone> | null>,
    private workingHourService: WorkingHourService,
    private readonly promptService: PromptService,
    private router: Router,
    private authService: AuthService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private destroy$: TuiDestroyService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  submitRequestTime() {
    const formModel = this.form.value;
    formModel.timeSheetId = this.id;
    formModel.createdDate = (formModel.createdDate as TuiDay).toLocalNativeDate().valueOf();
    formModel.newInTime = (formModel?.newInTime as TuiTime).toAbsoluteMilliseconds().valueOf();
    formModel.newOutTime = (formModel?.newOutTime as TuiTime).toAbsoluteMilliseconds().valueOf();
    formModel.status = 0;

    if (this.form.valid) {
      this.workingHourService
        .submitRequestTime(formModel)
        .pipe(
          mapTo({ icon: 'success', text: 'Updating Successfully!' } as SweetAlertOptions),
          takeUntil(this.destroy$),
          catchError((err) =>
            of({
              icon: 'error',
              text: err.error.message,
              showCancelButton: true,
              showConfirmButton: false,
            } as SweetAlertOptions)
          ),
          switchMap((options) => this.promptService.open(options)),
          filter((result) => result.isConfirmed),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.router.navigate(['../..'], { relativeTo: this.activatedRoute }));
    }
  }
}
