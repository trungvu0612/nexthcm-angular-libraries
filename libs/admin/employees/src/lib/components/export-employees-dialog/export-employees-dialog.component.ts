import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { FileSaverService } from 'ngx-filesaver';
import { from, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { AdminEmployeesService } from '../../services/admin-employees.service';

type Schema = Record<string, Record<string, { label: string; value?: boolean }>>;

const getSchema = (scope: string): Schema => ({
  generalInformation: {
    statusUser: { label: 'status' },
    cardinalNumbers: { label: scope + '.ordinalNumbers' },
    cifNumberAccInfo: { label: 'cif', value: true },
    fullNameAccInfo: { label: scope + '.fullName', value: true },
    fullVietNameseNameAccInfo: { label: scope + '.vietnameseFullName' },
    dateOfBirthAccInfo: { label: 'DOB' },
    genderAccInfo: { label: 'gender' },
    nationalityAccInfo: { label: scope + '.nationality' },
    identityNumberAccInfo: { label: scope + '.idNumber' },
    issueOnAccInfo: { label: 'issueOn' },
    issueAtAccInfo: { label: 'issueAt' },
    maritalStatusAccInfo: { label: scope + '.maritalStatus' },
    fullPermanentAddressAccInfo: { label: scope + '.permanentAddress' },
    addressTemporaryAddressAccInfo: { label: scope + '.temporaryAddress' },
    wardTemporaryAddressAccInfo: { label: scope + '.temporaryWard' },
    districtTemporaryAddressAccInfo: { label: scope + '.temporaryDistrict' },
    cityOrProvinceTemporaryAddressAccInfo: { label: scope + '.temporaryProvince' },
    phoneNumberAccInfo: { label: 'phoneNumber' },
    companyEmailAccInfo: { label: 'companyEmail' },
    personalEmailAccInfo: { label: 'personalEmail' },
    acbBankAccountAccInfo: { label: scope + '.acbBankAccount' },
    mbBankAccountAccInfo: { label: scope + '.mbBankAccount' },
    phoneNumberEmergencyContactAccInfo: { label: scope + '.emergencyPhoneNumber' },
    relationshipEmergencyContactAccInfo: { label: scope + '.emergencyContactRelationship' },
  },
  employeeDuration: {
    onboardingDateEmployeeDuration: { label: 'onboardingDate' },
    officalStartDateEmployeeDuration: { label: scope + '.officialStartDate' },
    laborContractStartDate: { label: scope + '.laborContractStartDate' },
    laborContractEndDate: { label: scope + '.laborContractEndDate' },
    labourContractNumber: { label: scope + '.labourContractNumber' },
    terminationDate: { label: 'terminationDate' },
    bvTime: { label: scope + '.bvTime' },
    seniority: { label: scope + '.seniority' },
  },
  team: {
    typesOfPersonnelTeam: { label: scope + '.typeOfPersonnel' },
    jobTitleTeam: { label: 'jobTitle' },
    departmentTeam: { label: 'department' },
    projectNameTeam: { label: scope + '.projectName' },
    sectionTeam: { label: scope + '.section' },
    directReportTeam: { label: 'directReport' },
  },
  education: {
    universityEducation: { label: 'university' },
    majorEducation: { label: 'major' },
    graduationYearEducation: { label: 'graduationYear' },
    hightestCertificateEducation: { label: 'highestCertificate' },
  },
  experience: {
    companyWorkExperience: { label: 'company' },
    jobTitleWorkExperience: { label: 'jobTitle' },
    fromDateWorkExperience: { label: scope + '.fromDate' },
    toDateWorkExperience: { label: scope + '.toDate' },
    descriptionWorkExperience: { label: 'description' },
  },
  shui: {
    taxIdentificationNumberSHUI: { label: 'taxIDNumber' },
    socialInsuranceNoSHUI: { label: 'socialInsuranceNumber' },
    codeHealthInsuranceNoSHUI: { label: 'healthInsuranceNumber' },
    placeHealthInsuranceNoSHUI: { label: scope + '.healthInsurancePlace' },
    pviHealthcareNoSHUI: { label: scope + '.pviHealthCareNumber' },
  },
});

@Component({
  selector: 'hcm-export-employees-dialog',
  templateUrl: './export-employees-dialog.component.html',
  styleUrls: ['./export-employees-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ExportEmployeesDialogComponent {
  readonly schema = getSchema(this.translocoScope.scope);
  readonly form!: FormGroup;
  readonly groupForm!: FormGroup;
  readonly submit$ = new Subject<Record<string, true>>();
  readonly submitLoading$ = this.submit$.pipe(
    switchMap((params) =>
      this.adminEmployeesService.exportEmployees(params).pipe(
        tap(({ blob, filename }) => {
          this.fileSaverService.save(blob, filename);
          this.context.completeWith();
        }),
        catchError((err) =>
          from(this.promptService.open({ icon: 'error', html: this.promptService.generateErrorMessage(err) }))
        ),
        startWith(null),
        map((v) => !v)
      )
    )
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly adminEmployeesService: AdminEmployeesService,
    private readonly promptService: PromptService,
    private readonly fileSaverService: FileSaverService,
    fb: FormBuilder,
    destroy$: TuiDestroyService
  ) {
    const formConfig: Record<string, FormGroup> = {};
    const groupFormConfig: Record<string, FormControl> = {};

    for (const groupKey in this.schema) {
      const group = this.schema[groupKey];
      const config: Record<string, FormControl> = {};
      let groupValue = true;

      for (const key in group) {
        const { value = false } = group[key];
        config[key] = fb.control({ value, disabled: value });
        groupValue = groupValue && value;
      }

      const controls = fb.group(config);
      const groupControl = fb.control({ value: groupValue, disabled: groupValue });

      controls.valueChanges.pipe(takeUntil(destroy$)).subscribe((value) => {
        const groupValue = Object.values(value).every((v) => v);
        if (groupValue !== groupControl.value) groupControl.setValue(groupValue, { emitEvent: false });
      });
      groupControl.valueChanges.pipe(takeUntil(destroy$)).subscribe((value) => {
        for (const key in group) {
          const control = controls.get(key);
          if (control && control.enabled) control.setValue(value, { emitEvent: false });
        }
      });

      formConfig[groupKey] = controls;
      groupFormConfig[groupKey] = groupControl;
    }

    this.form = fb.group(formConfig);
    this.groupForm = fb.group(groupFormConfig);
  }

  onSubmit(): void {
    const formValue = this.form.getRawValue();
    const body: Record<string, true> = {};

    for (const groupKey in formValue) {
      const groupValue = formValue[groupKey];

      for (const key in groupValue) {
        if (groupValue[key]) body[key] = true;
      }
    }

    this.submit$.next(body);
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }

  originalOrder = (): number => 0;
}
