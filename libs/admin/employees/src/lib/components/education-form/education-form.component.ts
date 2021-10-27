import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseOption, EmployeeEducation, EmployeesService, parseTuiDayFields, PromptService } from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, map, share, startWith, takeUntil, tap } from 'rxjs/operators';
import { AdminEmployeesService } from '../../services/admin-employees.service';

@Component({
  selector: 'hcm-education-form',
  templateUrl: './education-form.component.html',
  styleUrls: ['./education-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class EducationFormComponent {
  form: FormGroup<EmployeeEducation> = this.fb.group({} as EmployeeEducation);
  model = { certificates: [{}] } as EmployeeEducation;
  fields: FormlyFieldConfig[] = [
    {
      key: 'certificates',
      templateOptions: {
        translate: true,
        label: 'certificates',
      },
      type: 'repeat',
      fieldArray: {
        fieldGroupClassName: 'grid grid-flow-col gap-4',
        fieldGroup: [
          {
            key: 'university',
            type: 'input',
            templateOptions: {
              translate: true,
              label: 'university',
            },
          },
          {
            key: 'major',
            type: 'input',
            templateOptions: {
              translate: true,
              label: 'major',
            },
          },
          {
            key: 'highestCertificate',
            type: 'select',
            templateOptions: {
              translate: true,
              label: 'highestCertificate',
              valueProp: 'value',
              textfieldLabelOutside: false,
              options: this.translocoService.selectTranslateObject<HashMap<string>>('HIGHEST_CERTIFICATE_OPTIONS').pipe(
                map(
                  (result) =>
                    [
                      { value: 'Bachelor - 3 yrs', label: result['Bachelor - 3 yrs'] },
                      { value: 'Bachelor - 4 yrs', label: result['Bachelor - 4 yrs'] },
                      { value: 'Bachelor > 4 yrs', label: result['Bachelor > 4 yrs'] },
                      { value: 'Master', label: result.Master },
                      { value: 'Doctor', label: result.Doctor },
                      { value: 'Other', label: result.Other },
                    ] as BaseOption<string>[]
                )
              ),
            },
          },
          {
            key: 'graduationYear',
            type: 'input-number',
            templateOptions: {
              translate: true,
              label: 'graduationYear',
              precision: 0,
              min: 1900,
            },
          },
          {
            key: 'score',
            type: 'input',
            templateOptions: {
              translate: true,
              label: 'score',
            },
          },
          {
            key: 'startDate',
            type: 'input-date',
            templateOptions: {
              translate: true,
              label: 'startDate',
            },
          },
          {
            key: 'endDate',
            type: 'input-date',
            templateOptions: {
              translate: true,
              label: 'endDate',
            },
          },
        ],
      },
    },
    { key: 'employeeId' },
    { key: 'type' },
  ];
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.params.employeeId, 'EDUCATION')
    .pipe(
      tap((data) => {
        data.certificates =
          data.certificates?.map((certificate) => parseTuiDayFields(certificate, ['startDate', 'endDate'])) || [];
        this.model = {
          ...this.model,
          ...data,
          employeeId: this.activatedRoute.snapshot.params.employeeId,
          type: 'EDUCATION',
        };
      }),
      startWith(null),
      share()
    );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly adminEmployeeService: AdminEmployeesService,
    private readonly employeesService: EmployeesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      this.adminEmployeeService
        .updateEmployeeInformation<EmployeeEducation>(this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }

  onCancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
  }
}
