import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { map, takeUntil, tap } from 'rxjs/operators';
import { EmployeeEducation } from '../../models';
import { AdminEmployeeService } from '../../services/admin-employee.service';

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
  readonly request$ = this.adminEmployeeService
    .getEmployeeInformation<EmployeeEducation>(this.activatedRoute.snapshot.params.employeeId, 'education')
    .pipe(tap((res) => (this.model = { ...this.model, ...res.data })));
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adminEmployeeService: AdminEmployeeService,
    private destroy$: TuiDestroyService,
    private promptService: PromptService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      this.adminEmployeeService
        .updateEmployeeInformation(this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('updateSuccessful'));
    }
  }

  onCancel(): void {
    this.router.navigate(['../..'], { relativeTo: this.activatedRoute });
  }
}
