import { AfterViewInit, ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { of } from 'rxjs';
import { AdminEmployeeService } from '../../services/admin-employee.service';
import { map, startWith, tap } from 'rxjs/operators';
import { GENDER_NAME, MARITAL_STATUS } from '../../models/employee-enum';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { UserRole } from '../../models/user-role';
import { Permission } from '../../models/permission';
import { UserGroup } from '../../models/user-group';
import { UploadFileService } from '@nexthcm/ui';
import { APP_CONFIG, AppConfig } from '@nexthcm/core';

@Component({
  selector: 'hcm-upsert-employee',
  templateUrl: './upsert-employee.component.html',
  styleUrls: ['./upsert-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertEmployeeComponent implements AfterViewInit {
  dataRoles$ = this.adminEmployeeService.getUserRoles().pipe(map((res) => res.data.items));
  dataPermission$ = this.adminEmployeeService.getPermissions().pipe(map((res) => res.data.items));
  dataCountries$ = this.adminEmployeeService.getCountries().pipe(map((res) => res.data.items));
  dataLanguage$ = this.adminEmployeeService.getLanguages().pipe(map((res) => res.data.items));
  dataUserGroups$ = this.adminEmployeeService.getUserGroups().pipe(map((res) => res.data.items));
  dataUsersReport$ = this.adminEmployeeService.getAllUsers().pipe(map((res) => res.data.items));
  dataJobTitle$ = this.adminEmployeeService.getJobTitle().pipe(map((res) => res.data.items));
  dataJobLevel$ = this.adminEmployeeService.getJobLevels().pipe(map((res) => res.data.items));
  dataOrg$ = this.adminEmployeeService.getOrg().pipe(map((res) => res.data.items));
  dataOffices$ = this.adminEmployeeService.getOffices().pipe(map((res) => res.data.items));

  dataGender$ = GENDER_NAME;
  dataMarital$ = MARITAL_STATUS;
  userElement: any;
  SelectElement: any;
  titleId?: string;
  userId?: string;
  contactId?: string;
  contactType?: string;
  address2?: string;
  addressId?: string;

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
      type: 'object-select',
      templateOptions: {
        options: this.dataPermission$,
        labelProp: 'name',
        valueProp: 'policyId',
        placeholder: 'Permission(*):',
        required: true,
        multiple: true,
        translate: true,
        compareWith: (item1: Permission, item2: Permission) => item1.policyId === item2.policyId,
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
      key: 'org.id',
      type: 'select',
      templateOptions: {
        options: this.dataOrg$,
        labelProp: 'orgName',
        valueProp: 'id',
        placeholder: 'Department:',
      },
    },
    {
      key: 'roles',
      type: 'object-select',
      templateOptions: {
        translate: true,
        options: this.dataRoles$,
        labelProp: 'name',
        placeholder: 'Role Name(*):',
        required: true,
        multiple: true,
        compareWith: (item1: UserRole, item2: UserRole) => item1.id === item2.id,
      },
    },
    {
      className: 'attachFile',
      key: 'profile.image',
      type: 'upload-file',
      templateOptions: {
        label: 'Image:',
        textfieldSize: 's',
        previewImage: true,
        serverRequest: this.uploadFileService.uploadFile.bind(this.uploadFileService, 'employee'),
      },
    },
    {
      key: 'office.id',
      type: 'select',
      templateOptions: {
        options: this.dataOffices$,
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Office:',
      },
    },
    {
      key: 'userGroups',
      type: 'object-select',
      templateOptions: {
        options: this.dataUserGroups$,
        labelProp: 'groupName',
        valueProp: 'id',
        placeholder: 'User Group(*):',
        required: true,
        translate: true,
        multiple: true,
        compareWith: (item1: UserGroup, item2: UserGroup) => item1.id === item2.id,
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
      key: 'profile.institute',
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
      key: 'languageId',
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
        options: this.dataJobLevel$,
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
        placeholder: 'Direct Report(*):',
        required: true,
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
    private adminEmployeeService: AdminEmployeeService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private uploadFileService: UploadFileService,
    private destroy$: TuiDestroyService,
    @Inject(APP_CONFIG) private appConfig: AppConfig
  ) {
    this.userId = this.activatedRouter.snapshot.params.id;
  }

  ngAfterViewInit(): void {
    if (this.userId) {
      this.adminEmployeeService.getUserById(this.userId).subscribe((item) => {
        this.titleId = item?.title?.id;
        this.contactId = item?.contact?.id;
        this.contactType = item?.contact?.contactType;
        this.address2 = item?.address?.address2;
        this.addressId = item?.address?.id;
        if (item.state == -1) {
          item.state = false;
        }
        item.profile.birthDay = TuiDay.fromLocalNativeDate(new Date(item.profile?.birthDay));
        item.registration = TuiDay.fromLocalNativeDate(new Date(item?.registration));
        console.log(item.profile.birthDay);
        console.log(item.registration);
        this.model = { ...this.model, ...item };
      });
    }
  }

  saveEmployee() {
    const formModel = this.form.value;
    const rolesData: any[] = [];

    formModel?.roles.forEach(function (res: any) {
      if (res?.id) {
        rolesData.push({ id: res.id });
      } else {
        rolesData.push({ id: res });
      }
    });

    const permissionData: any[] = [];
    formModel.policies.forEach(function (res: any) {
      if (res?.policyId) {
        permissionData.push({ policyId: res.policyId });
      } else {
        permissionData.push({ policyId: res });
      }
    });

    const userGroupData: any[] = [];
    formModel.userGroups.forEach(function (res: any) {
      if (res?.id) {
        userGroupData.push({ id: res.id });
      } else {
        userGroupData.push({ id: res });
      }
    });

    this.userElement = {
      state: 1,
      registerType: 'R',
      roles: rolesData,
      policies: permissionData,
      userGroups: userGroupData,
      reportTo: {
        id: '9d07f921-81c3-4c2c-a838-e279dc04a80f',
      },
    };

    if (this.userId) {
      this.userElement.id = this.userId;

      if (this.titleId) {
        this.userElement.title = {
          id: this.titleId,
        };
      } else {
        delete formModel.title;
      }
      formModel.contact.id = this.contactId;
      formModel.contact.contactType = this.contactType;
      formModel.address.address2 = this.address2;
      formModel.address.id = this.addressId;
      formModel.profile.userId = this.userId;
    }
    if (formModel.state == true) {
      formModel.state = 1;
    } else {
      formModel.state = -1;
    }

    if (formModel.profile.birthDay) {
      formModel.profile.birthDay = (formModel.profile.birthDay as TuiDay).toLocalNativeDate().valueOf();
    }
    if (formModel.registration) {
      formModel.registration = (formModel.registration as TuiDay).toLocalNativeDate().valueOf();
    }

    delete formModel.policies;
    delete formModel.roles;
    delete formModel.userGroups;
    const formData = Object.assign(this.userElement, formModel);
    // console.log(formData);

    if (this.form.valid) {
      if (this.userId) {
        this.adminEmployeeService.editEmployee(formData, this.userId).subscribe((item) => {
          this.router.navigateByUrl('/admin/employees');
        });
      } else {
        this.adminEmployeeService.createEmployee(formData).subscribe((item) => {
          this.router.navigateByUrl('/admin/employees');
        });
      }
    }
  }
}
