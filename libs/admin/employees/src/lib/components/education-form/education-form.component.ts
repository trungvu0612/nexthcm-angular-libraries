import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeEducation, EmployeesService, PromptService } from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TRANSLOCO_SCOPE, TranslocoScope } from '@ngneat/transloco';
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
    { key: 'employeeId', defaultValue: this.activatedRoute.snapshot.params.employeeId },
    { key: 'type', defaultValue: 'EDUCATION' },
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
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'highestCertificate',
        labelClassName: 'font-semibold',
        placeholder: 'enterHighestCertificate',
        textfieldLabelOutside: true,
        translocoScope: this.scope,
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
  ];
  private readonly request$ = this.employeesService
    .getEmployeeInformation(this.activatedRoute.snapshot.params.employeeId, 'education')
    .pipe(
      tap((data) => (this.model = { ...this.model, ...data })),
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
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope
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
