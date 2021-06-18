import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';
import { AdminEmployeeService } from '../../services/admin-employee.service';
import { map } from 'rxjs/operators';
import { GENDER_NAME, MARITAL_STATUS } from '../../models/employee-enum';
import { TuiDay } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-upsert-employee',
  templateUrl: './upsert-employee.component.html',
  styleUrls: ['./upsert-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertEmployeeComponent implements OnInit {
  dataRoles$?: Observable<any> = this.AdminEmployeeService.getUserRoles().pipe(map((res) => res.data.items));
  dataPermission$?: Observable<any> = this.AdminEmployeeService.getPermissions().pipe(map((res) => res.data.items));
  dataCountries$?: Observable<any> = this.AdminEmployeeService.getCountries().pipe(map((res) => res.items));
  dataLanguage$?: Observable<any> = this.AdminEmployeeService.getCountries().pipe(map((res) => res.items));
  dataUserGroups$?: Observable<any> = this.AdminEmployeeService.getUserGroups().pipe(map((res) => res.items));
  dataUsersReport$?: Observable<any> = this.AdminEmployeeService.getAllUsers().pipe(map((res) => res.data.items));
  dataJobTitle$?: Observable<any> = this.AdminEmployeeService.getJobTitle().pipe(map((res) => res.data.items));

  dataGender$ = GENDER_NAME;
  dataMarital$ = MARITAL_STATUS;

  UserElement: any;
  titleId!: string | undefined;
  userId!: string | undefined;
  contactId!: string | undefined;
  contactType!: string | undefined;
  address2!: string | undefined;

  readonly form = new FormGroup({
    filters: new FormControl([]),
  });
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'profile.firstName',
      type: 'input',
      templateOptions: {
        label: 'First Name(*):',
        required: true,
        size: 'm',
      },
    },
    {
      key: 'title.id',
      type: 'select',
      templateOptions: {
        options: this.dataJobTitle$,
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Job Title:',
      },
    },
    {
      key: 'policies',
      type: 'multi-select',
      templateOptions: {
        options: this.dataPermission$,
        labelProp: 'name',
        valueProp: 'policyId',
        placeholder: 'Permission:',
      },
    },
    {
      key: 'profile.lastName',
      type: 'input',
      templateOptions: {
        label: 'Last Name(*):',
        required: true,
        size: 'm',
      },
    },
    {
      key: 'department',
      type: 'input',
      templateOptions: {
        label: 'Department:',
      },
    },
    {
      key: 'roles',
      type: 'multi-select',
      templateOptions: {
        options: this.dataRoles$,
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Role Name',
        required: true,
      },
    },
    {
      className: 'attachFile',
      key: 'attachFile',
      type: 'upload-file',
      templateOptions: {
        label: 'Image:',
        textfieldSize: 's',
      },
    },
    {
      key: 'office',
      type: 'input',
      templateOptions: {
        label: 'Office:',
      },
    },
    {
      key: 'userGroups.id',
      type: 'select',
      templateOptions: {
        options: this.dataUserGroups$,
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'User Group:',
      },
    },
    {
      className: 'status',
      key: 'state',
      type: 'toggle',
      templateOptions: { textfieldLabelOutside: true },
      expressionProperties: {
        'templateOptions.label': of('Status:'),
        'templateOptions.description': of('Active'),
      },
    },
    {
      key: 'registration',
      type: 'input-date',
      templateOptions: {
        label: 'Join date:',
      },
    },
    {
      key: '',
      type: '',
    },
    {
      key: 'profile.birthDay',
      type: 'input-date',
      templateOptions: {
        label: 'DOB:',
      },
    },
    {
      key: 'contact.phone',
      type: 'input',
      templateOptions: {
        label: 'Phone(*):',
        required: true,
      },
    },
    {
      key: '',
      type: '',
    },
    {
      key: 'profile.gender',
      type: 'select',
      templateOptions: {
        options: this.dataGender$,
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Gender:',
      },
    },
    {
      key: 'contact.skype',
      type: 'input',
      templateOptions: {
        label: 'Skype:',
      },
    },
    {
      key: '',
      type: '',
    },
    {
      key: 'profile.maritalStatus',
      type: 'select',
      templateOptions: {
        options: this.dataMarital$,
        labelProp: 'name',
        valueProp: 'value',
        placeholder: 'Marital Status:',
      },
    },
    {
      key: 'profile.major',
      type: 'text-area',
      templateOptions: {
        label: 'Major/Specialization:',
        textfieldSize: 'm',
        expandable: false,
        rows: 4,
      },
    },
    {
      key: '',
      type: '',
    },
    {
      key: 'address.countryId',
      type: 'select',
      templateOptions: {
        options: this.dataCountries$,
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Nationality:',
      },
    },
    {
      key: 'profile.institute:',
      type: 'input',
      templateOptions: {
        label: 'Institute:',
      },
    },
    {
      key: '',
      type: '',
    },
    {
      key: 'languagueId',
      type: 'select',
      templateOptions: {
        options: this.dataLanguage$,
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Languages:',
      },
    },
    {
      key: 'contact.facebook',
      type: 'input',
      templateOptions: {
        label: 'Facebook:',
      },
    },
    {
      key: '',
      type: '',
    },
    {
      key: 'level.id',
      type: 'select',
      templateOptions: {
        options: [],
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Job Level:',
      },
    },
    {
      key: 'contact.instagram',
      type: 'input',
      templateOptions: {
        label: 'Instagram:',
      },
    },
    {
      key: '',
      type: '',
    },
    {
      key: 'reportTo.id',
      type: 'select',
      templateOptions: {
        options: this.dataUsersReport$,
        labelProp: 'username',
        valueProp: 'id',
        placeholder: 'Direct Report:',
      },
    },
    {
      key: 'profile.salary',
      type: 'input',
      templateOptions: {
        label: 'Salary:',
      },
    },
    {
      key: '',
      type: '',
    },
    {
      key: 'address.address1',
      type: 'input',
      templateOptions: {
        label: 'Address(*):',
        required: true,
      },
    },
    {
      key: 'contact.email',
      type: 'input',
      templateOptions: {
        label: 'Email(*):',
        required: true,
      },
    },
  ];

  constructor(
    private AdminEmployeeService: AdminEmployeeService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.userId = this.activatedRouter.snapshot.params.id;
  }

  ngOnInit(): void {
    if (this.userId) {
      this.AdminEmployeeService.getUserById(this.userId).subscribe((item) => {
        console.log(item.roles);
        this.titleId = item?.title?.id;
        this.contactId = item?.contact?.id;
        this.contactType = item?.contact?.contactType;
        this.address2 = item?.address?.address2;

        this.form.patchValue(item);
      });
    }
  }

  saveEmployee() {
    const formModel = this.form.value;
    const rolesData: any[] = [];

    formModel?.roles.forEach(function (item: any) {
      if (item?.id) {
        rolesData.push({ id: item.id });
      } else {
        rolesData.push({ id: item });
      }
    });

    const permissionData: any[] = [];
    formModel?.policies.forEach(function (item: any) {
      if (item?.policyId) {
        permissionData.push({ policyId: item.policyId });
      } else {
        permissionData.push({ policyId: item });
      }
    });

    this.UserElement = {
      state: 1,
      registerType: 'R',
      roles: rolesData,
      policies: permissionData,
      reportTo: {
        id: '9d07f921-81c3-4c2c-a838-e279dc04a80f',
      },
    };

    if (this.userId) {
      this.UserElement.id = this.userId;

      if (this.titleId) {
        this.UserElement.title = {
          id: this.titleId,
        };
      }
      formModel.contact.id = this.contactId;
      formModel.contact.contactType = this.contactType;
      formModel.address.address2 = this.address2;
      formModel.profile.userId = this.userId;
    }
    if (formModel.state == 'true') {
      formModel.state = 1;
    } else {
      formModel.state = -1;
    }

    if (formModel.profile.birthDay) {
      formModel.profile.birthDay = (formModel.profile.birthDay as TuiDay).toLocalNativeDate().valueOf();
    }
    if (formModel.profile.registration) {
      formModel.registration = (formModel.registration as TuiDay).toLocalNativeDate().valueOf();
    }

    delete formModel.policies;
    delete formModel.roles;
    const formData = Object.assign(this.UserElement, formModel);
    console.log(formData);

    if (this.form.valid) {
      if (this.userId) {
        this.AdminEmployeeService.editEmployee(formData, this.userId).subscribe((item) => {
          this.router.navigateByUrl('/admin/employees');
        });
      } else {
        this.AdminEmployeeService.createEmployee(formData).subscribe((item) => {
          this.router.navigateByUrl('/admin/employees');
        });
      }
    }
  }
}
