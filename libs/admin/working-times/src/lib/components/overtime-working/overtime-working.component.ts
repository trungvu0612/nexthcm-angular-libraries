import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { WorkingTimesService } from '../../services/working-times.service';

@Component({
  selector: 'hcm-overtime-working',
  templateUrl: './overtime-working.component.html',
  styleUrls: ['./overtime-working.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OvertimeWorkingComponent implements OnInit {
  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 100 });
  offices$ = this.WorkingTimesService.getOffices().pipe(map((res) => res.data.items));
  dataChecking$ = this.WorkingTimesService.statusChecking().pipe(map((res) => res.data.items));

  model: any = {};
  workingAfterTimeElement: any;
  workingHourElement: any;
  readonly form = new FormGroup({
    filters: new FormControl([]),
  });

  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block small-input',
      key: 'orgId',
      type: 'select',
      templateOptions: {
        options: this.offices$,
        label: 'Office',
        labelProp: 'orgName',
        valueProp: 'id',
        subLabelProp: 'orgType',
        matcherBy: 'id',
        labelClassName: 'font-semibold',
        required: true,
      },
    },
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
          key: 'default',
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
              key: '2',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Monday',
                size: 'l',
              },
            },
            {
              key: '3',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Tuesday',
                size: 'l',
              },
            },
            {
              key: '4',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Wednesday',
                size: 'l',
              },
            },
            {
              key: '5',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Thursday',
                size: 'l',
              },
            },
            {
              key: '6',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Friday',
                size: 'l',
              },
            },
            {
              key: '7',
              type: 'checkbox-labeled',
              defaultValue: false,
              templateOptions: {
                translate: true,
                label: 'Saturday',
                size: 'l',
              },
            },
            {
              key: '1',
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
              key: 'check-out',
              type: 'input',
              defaultValue: this.dataChecking$,
              templateOptions: {
                textfieldLabelOutside: true,
                label: 'OT Time (Check in)',
                labelClassName: 'font-semibold',
                disabled: true,
                valueProp: 'inTime',
              },
            },
            {
              className: 'block my-5',
              key: 'minStart',
              type: 'input-time',
              templateOptions: {
                textfieldLabelOutside: true,
                label: 'Check out',
                labelClassName: 'font-semibold',
                textfieldSize: 'l',
                required: true,
              },
            },
            {
              className: 'block my-5',
              key: 'minOtHours',
              type: 'input',
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
              type: 'input',
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
          fieldGroupClassName: 'grid grid-cols-5 gap-4',
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
              type: 'input',
              defaultValue: 1,
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
              className: 'block my-5',
              key: 'maxOtHours',
              type: 'input',
              templateOptions: {
                textfieldSize: 'l',
                label: 'Hour Max',
                required: true,
                textfieldLabelOutside: true,
              },
            },
            {
              className: 'block my-5',
              key: 'maxOtMinutes',
              type: 'input',
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

  constructor(
    private translocoService: TranslocoService,
    private WorkingTimesService: WorkingTimesService,
    private router: Router,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private destroy$: TuiDestroyService,
    private activatedRoute: ActivatedRoute,
    private promptService: PromptService
  ) {}

  ngOnInit(): void {
    // console.log('dataChecking$=' + this.dataChecking$);
  }

  onSubmit(): void {
    const formModel = this.form.value;
    formModel.minStart = (formModel?.minStart as TuiTime).toAbsoluteMilliseconds().valueOf();
    formModel.applyFor = Object.keys(formModel.applyFor).filter((key) => formModel.applyFor[key]);
    const workingItems: any[] = [
      {
        values: [],
        weekDayId: 7,
      },
      {
        values: [],
        weekDayId: 1,
      },
    ];

    if (formModel.applyFor.includes('7')) {
      // choose saturday
      workingItems.splice(0, 1);
    }
    if (formModel.applyFor.includes('1')) {
      // choose sunday
      workingItems.splice(1, 1);
    }

    Object.keys(formModel.applyFor).forEach((item) => {
      console.log(item); // key
      console.log(formModel.applyFor[item]); // propertyValue
      workingItems.push({
        values: [
          {
            minOtHours: formModel.applyFor.includes('default') ? 0 : parseInt(formModel.minOtHours) * 60,
            maxOtHours: formModel.applyFor.includes('default') ? 0 : parseInt(formModel.maxOtHours) * 3600,
            minOtMinutes: formModel.applyFor.includes('default') ? 0 : parseInt(formModel.minOtMinutes) * 60,
            maxOtMinutes: formModel.applyFor.includes('default') ? 0 : parseInt(formModel.maxOtMinutes) * 3600,
            minStart: formModel.applyFor.includes('default') ? 0 : parseInt(formModel.minStart),
            otBreakHours:
              formModel.applyFor.includes('default') || formModel.weekendOt != true
                ? 0
                : formModel.workOtType == 1
                ? formModel.otBreakHours * 3600
                : formModel.otBreakHours * 60,
          },
        ],
        weekDayId: formModel.applyFor[item],
      });
    });

    this.workingAfterTimeElement = {
      orgId: formModel.orgId,
      fingerPrint: true,
      minOtHours: formModel.applyFor.includes('default') ? formModel.minOtHours : 0,
      maxOtHours: formModel.applyFor.includes('default') ? formModel.maxOtHours : 0,
      minOtMinutes: formModel.applyFor.includes('default') ? formModel.minOtMinutes : 0,
      maxOtMinutes: formModel.applyFor.includes('default') ? formModel.maxOtMinutes : 0,
      otBreakHours: formModel.applyFor.includes('default') ? formModel.otBreakHours : 0,
      minStart: formModel.applyFor.includes('default') ? formModel.minStart : 0,
      items: workingItems,
    };
    console.log(JSON.stringify(this.workingAfterTimeElement));

    this.WorkingTimesService.submitWorkingAfterTime(this.workingAfterTimeElement)
      .pipe(
        mapTo({ icon: 'success', text: 'Add Working After Time Successfully!' } as SweetAlertOptions),
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
