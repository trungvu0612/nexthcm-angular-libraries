import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseOption, EmployeeEducation, EmployeesService, PromptService } from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { HashMap, ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
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
  model = {} as EmployeeEducation;
  fields: FormlyFieldConfig[] = [
    {
      key: 'university',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'university',
        labelClassName: 'font-semibold',
        placeholder: 'enterUniversity',
        textfieldLabelOutside: true,
        translocoScope: this.scope,
      },
    },
    {
      key: 'major',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'major',
        labelClassName: 'font-semibold',
        placeholder: 'enterMajor',
        textfieldLabelOutside: true,
        translocoScope: this.scope,
      },
    },
    {
      key: 'highestCertificate',
      className: 'tui-form__row block',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'highestCertificate',
        labelClassName: 'font-semibold',
        placeholder: 'chooseHighestCertificate',
        valueProp: 'value',
        translocoScope: this.scope,
        options: this.translocoService
          .selectTranslateObject<HashMap<string>>(
            'HIGHEST_CERTIFICATE_OPTIONS',
            {},
            (this.scope as ProviderScope).scope
          )
          .pipe(
            map(
              (result) =>
                [
                  { value: 'COLLEGE', label: result.college },
                  { value: 'BACHELOR', label: result.bachelor },
                  { value: 'MASTER', label: result.master },
                ] as BaseOption<string>[]
            )
          ),
      },
    },
    {
      key: 'graduationYear',
      className: 'tui-form__row block',
      type: 'input-number',
      templateOptions: {
        translate: true,
        label: 'graduationYear',
        labelClassName: 'font-semibold',
        placeholder: 'enterGraduationYear',
        textfieldLabelOutside: true,
        precision: 0,
        translocoScope: this.scope,
        min: 1900,
      },
    },
    {
      key: 'otherCertificates',
      className: 'tui-form__row block',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'otherCertificates',
        labelClassName: 'font-semibold',
        placeholder: 'enterOtherCertificates',
        textfieldLabelOutside: true,
        translocoScope: this.scope,
      },
    },
    {
      key: 'description',
      className: 'tui-form__row block',
      type: 'editor',
      templateOptions: {
        translate: true,
        label: 'description',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
        textfieldLabelOutside: true,
      },
    },
    { key: 'employeeId' },
    { key: 'type' },
  ];
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.params.employeeId, 'EDUCATION')
    .pipe(
      tap(
        (data) =>
          (this.model = {
            ...this.model,
            ...data,
            employeeId: this.activatedRoute.snapshot.params.employeeId,
            type: 'EDUCATION',
          })
      ),
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
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
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
