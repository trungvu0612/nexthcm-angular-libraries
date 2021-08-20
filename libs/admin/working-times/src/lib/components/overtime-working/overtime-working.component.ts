import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { PromptService, secondsToTime } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isPresent, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { BehaviorSubject, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  share,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { WorkingAfterTime } from '../../models/working-after-time';
import { WorkingTimesService } from '../../services/working-times.service';

@Component({
  selector: 'hcm-overtime-working',
  templateUrl: './overtime-working.component.html',
  styleUrls: ['./overtime-working.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OvertimeWorkingComponent implements OnInit {
  myOrgId = this.authService.get('userInfo').orgId;
  overtimeWorkingId: any;
  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 100 });
  orgs$ = this.workingTimesService.getOrgs().pipe(map((res) => res.data.items));
  // offices$ = this.WorkingTimesService.getOffices().pipe(map((res) => res.data.items));
  dataChecking$ = this.workingTimesService.statusChecking().pipe(map((res) => res.data.items));
  model: any = {} as WorkingAfterTime;
  workingAfterTimeElement: any;
  workingHourElement: any;
  readonly form = new FormGroup({
    filters: new FormControl([]),
    orgId: new FormControl([]),
  });

  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block small-input',
      key: 'orgId',
      type: 'select',
      defaultValue: this.myOrgId,
      templateOptions: {
        options: this.orgs$,
        label: 'Org',
        labelProp: 'orgName',
        valueProp: 'id',
        labelClassName: 'font-semibold',
        required: true,
      },
    },
    // {
    //   className: 'tui-form__row block small-input',
    //   key: 'officeId',
    //   type: 'select',
    //   templateOptions: {
    //     options: this.offices$,
    //     label: 'Office',
    //     labelProp: 'name',
    //     valueProp: 'id',
    //     labelClassName: 'font-semibold',
    //     required: true,
    //   },
    // },
    {
      expressionProperties: {
        template: this.translocoService
          .selectTranslate<string>('applyFor')
          .pipe(map((result) => `<div class='font-semibold mt-5'>${result}</div>`)),
      },
    },
    {
      className: 'tui-form__row block',
      key: 'applyFor', // TODO: need change
      fieldGroup: [
        {
          className: 'block mb-5',
          key: 'dayDefault',
          type: 'checkbox-labeled',
          defaultValue: false,
          templateOptions: {
            translate: true,
            label: 'Default',
            size: 'l',
          },
        },
        {
          fieldGroupClassName: 'grid grid-cols-7 gap-2',
          fieldGroup: [
            {
              key: 'day2',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Monday',
                size: 'l',
              },
            },
            {
              key: 'day3',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Tuesday',
                size: 'l',
              },
            },
            {
              key: 'day4',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Wednesday',
                size: 'l',
              },
            },
            {
              key: 'day5',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Thursday',
                size: 'l',
              },
            },
            {
              key: 'day6',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Friday',
                size: 'l',
              },
            },
            {
              key: 'day7',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Saturday',
                size: 'l',
              },
            },
            {
              key: 'day1',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Sunday',
                size: 'l',
              },
            },
          ],
        },
      ],
    },
    {
      fieldGroup: [
        {
          fieldGroupClassName: 'grid grid-cols-5 gap-4',
          fieldGroup: [
            {
              className: 'block my-5 text-xl',
              key: 'checkOut',
              type: 'input-time',
              templateOptions: {
                textfieldLabelOutside: true,
                label: ' Check out',
                labelClassName: 'font-semibold',
                disabled: true,
              },
            },
            {
              className: 'block my-5',
              key: 'minStart',
              type: 'input-time',
              templateOptions: {
                textfieldLabelOutside: true,
                label: 'OT Time Check out',
                labelClassName: 'font-semibold',
                textfieldSize: 'l',
                required: true,
              },
            },
            {
              className: 'block my-5',
              key: 'minOtHours',
              type: 'input-time',
              templateOptions: {
                textfieldLabelOutside: true,
                textfieldSize: 'l',
                label: 'Hour Min',
                required: true,
              },
            },
            {
              className: 'block my-5',
              key: 'minOtMinutes',
              type: 'input-time',
              templateOptions: {
                textfieldSize: 'l',
                label: 'Minute Min',
                required: true,
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'fingerPrint',
              className: 'tui-form__row block',
              type: 'toggle',
              templateOptions: { textfieldLabelOutside: true, labelClassName: 'font-semibold' },
              expressionProperties: {
                'templateOptions.label': of('Use FingerPrint'),
              },
            },
          ],
        },
      ],
    },
    {
      fieldGroup: [
        {
          fieldGroupClassName: 'grid grid-cols-5 gap-4 ot-breaks',
          fieldGroup: [
            {
              key: 'weekendOt',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Weekend OT Break',
                size: 'l',
              },
            },
            {
              className: 'block my-5',
              key: 'otBreakHours',
              type: 'input-time',
            },
            {
              className: 'tui-form__row block',
              key: 'workOtType',
              type: 'select',
              defaultValue: 1,
              templateOptions: {
                options: [
                  { value: 1, label: 'Hour' },
                  { value: 2, label: 'Minute' },
                ],
                valueProp: 'value',
                labelClassName: 'font-semibold',
              },
            },
            {
              className: 'block my-5 hour-label',
              key: 'maxOtHours',
              type: 'input-time',
              templateOptions: {
                textfieldSize: 'l',
                label: 'Hour Max',
                required: true,
                textfieldLabelOutside: true,
              },
            },
            {
              className: 'block my-5 hour-label',
              key: 'maxOtMinutes',
              type: 'input-time',
              templateOptions: {
                textfieldSize: 'l',
                label: 'Minute Max',
                required: true,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
      ],
    },
  ];

  private readonly request$ = this.form.controls.orgId.valueChanges.pipe(
    startWith(this.myOrgId),
    filter(isPresent),
    distinctUntilChanged(),
    switchMap((orgId) => this.workingTimesService.getOvertimeConfigByOrg(orgId).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    private translocoService: TranslocoService,
    private workingTimesService: WorkingTimesService,
    private router: Router,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private destroy$: TuiDestroyService,
    private activatedRoute: ActivatedRoute,
    private promptService: PromptService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.dataChecking$.pipe(takeUntil(this.destroy$)).subscribe((item) => {
      this.dataChecking$ = item[0].outTime;
    });
    this.request$.pipe(filter(isPresent), takeUntil(this.destroy$)).subscribe((data) => this.patchFormValue(data));
  }

  onSubmit(): void {
    const formModel = { ...this.form.value };
    formModel.minStart = (formModel?.minStart as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000;
    formModel.minOtHours = (formModel?.minOtHours as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000;
    formModel.maxOtHours = (formModel?.maxOtHours as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000;
    formModel.minOtMinutes = (formModel?.minOtMinutes as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000;
    formModel.maxOtMinutes = (formModel?.maxOtMinutes as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000;
    formModel.otBreakHours = (formModel?.otBreakHours as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000;
    const overtimeData = [];
    const dayKey = [
      formModel.applyFor.day1,
      formModel.applyFor.day2,
      formModel.applyFor.day3,
      formModel.applyFor.day4,
      formModel.applyFor.day5,
      formModel.applyFor.day6,
      formModel.applyFor.day7,
    ];
    for (let i = 1; i <= 7; i++) {
      const m: number = i - 1;
      if (dayKey[m]) {
        overtimeData.push({
          weekDayId: i,
          values: [
            {
              minOtHours: formModel.applyFor.dayDefault ? 0 : parseInt(formModel.minOtHours),
              maxOtHours: formModel.applyFor.dayDefault ? 0 : parseInt(formModel.maxOtHours),
              minOtMinutes: formModel.applyFor.dayDefault ? 0 : parseInt(formModel.minOtMinutes),
              maxOtMinutes: formModel.applyFor.dayDefault ? 0 : parseInt(formModel.maxOtMinutes),
              minStart: formModel.applyFor.dayDefault ? 0 : parseInt(formModel.minStart),
              otBreakHours:
                formModel.applyFor.dayDefault || !formModel.weekendOt ? 0 : parseInt(formModel.otBreakHours),
            },
          ],
        });
      } else {
        overtimeData.push({
          weekDayId: i,
          values: [
            {
              minOtHours: 0,
              maxOtHours: 0,
              minOtMinutes: 0,
              maxOtMinutes: 0,
              otBreakHours: 0,
              minStart: 0,
            },
          ],
        });
      }
    }

    this.workingAfterTimeElement = {
      orgId: formModel.orgId,
      fingerPrint: true,
      minOtHours: formModel.applyFor.dayDefault ? 0 : parseInt(formModel.minOtHours),
      maxOtHours: formModel.applyFor.dayDefault ? 0 : parseInt(formModel.maxOtHours),
      minOtMinutes: formModel.applyFor.dayDefault ? 0 : parseInt(formModel.minOtMinutes),
      maxOtMinutes: formModel.applyFor.dayDefault ? 0 : parseInt(formModel.maxOtMinutes),
      otBreakHours: formModel.applyFor.dayDefault ? 0 : parseInt(formModel.otBreakHours),
      minStart: formModel.applyFor.dayDefault ? 0 : parseInt(formModel.minStart),
      items: overtimeData,
    };
    console.log(JSON.stringify(this.workingAfterTimeElement));

    if (this.overtimeWorkingId) {
      this.workingAfterTimeElement.id = this.overtimeWorkingId;
    }

    this.workingTimesService
      .submitWorkingAfterTime(this.workingAfterTimeElement)
      .pipe(
        mapTo({ icon: 'success', text: 'Update Working After Time Successfully!' } as SweetAlertOptions),
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

  private patchFormValue(formModel: any): void {
    this.overtimeWorkingId = formModel?.id;
    const jsonEditData = {
      applyFor: {
        dayDefault: false,
        day1: false,
        day2: true,
        day3: true,
        day4: true,
        day5: true,
        day6: true,
        day7: false,
      },
      orgId: this.myOrgId,
      otBreakHours: new TuiTime(
        Number(secondsToTime(formModel.otBreakHours).h),
        Number(secondsToTime(formModel.otBreakHours).m)
      ),
      workOtType: Math.floor(formModel.otBreakHours / 3600) >= 1 ? 1 : 2,
      fingerPrint: formModel.fingerPrint,
      weekendOt: formModel.otBreakHours > 0,
      maxOtHours: new TuiTime(
        Number(secondsToTime(formModel.maxOtHours).h),
        Number(secondsToTime(formModel.maxOtHours).m)
      ),
      minOtHours: new TuiTime(
        Number(secondsToTime(formModel.minOtHours).h),
        Number(secondsToTime(formModel.minOtHours).m)
      ),
      minOtMinutes: new TuiTime(
        Number(secondsToTime(formModel.minOtMinutes).h),
        Number(secondsToTime(formModel.minOtMinutes).m)
      ),
      maxOtMinutes: new TuiTime(
        Number(secondsToTime(formModel.maxOtMinutes).h),
        Number(secondsToTime(formModel.maxOtMinutes).m)
      ),
      minStart: new TuiTime(Number(secondsToTime(formModel.minStart).h), Number(secondsToTime(formModel.minStart).m)),
      checkOut: new TuiTime(Number(secondsToTime(this.dataChecking$).h), Number(secondsToTime(this.dataChecking$).m)),
    };
    formModel.items.forEach(function (res: any) {
      if (res.weekDayId === 1) {
        jsonEditData.applyFor.day1 = res.values[0].minOtHours > 0;
      }
      if (res.weekDayId === 2) {
        jsonEditData.applyFor.day2 = res.values[0].minOtHours > 0;
      }
      if (res.weekDayId === 3) {
        jsonEditData.applyFor.day3 = res.values[0].minOtHours > 0;
      }
      if (res.weekDayId === 4) {
        jsonEditData.applyFor.day4 = res.values[0].minOtHours > 0;
      }
      if (res.weekDayId === 5) {
        jsonEditData.applyFor.day5 = res.values[0].minOtHours > 0;
      }
      if (res.weekDayId === 6) {
        jsonEditData.applyFor.day6 = res.values[0].minOtHours > 0;
      }
      if (res.weekDayId === 7) {
        jsonEditData.applyFor.day7 = res.values[0].minOtHours > 0;
      }
    });

    // console.log(JSON.stringify(jsonEditData));

    this.model = { ...this.model, ...jsonEditData };
  }
}
