import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable, of } from 'rxjs';
import { AdminEmployeeService } from '../../services/admin-employee.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'hcm-upsert-employee',
  templateUrl: './upsert-employee.component.html',
  styleUrls: ['./upsert-employee.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertEmployeeComponent implements OnInit {
  dataTest$?: Observable<any> = this.AdminEmployeeService.getUserRoles().pipe(map((res) => res.data.items));
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
      key: 'jobTitle',
      type: 'input',
      templateOptions: {
        label: 'Job Title:',
      },
    },
    {
      key: 'permission',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: 'permission 1' },
          { id: 2, name: 'permission 2' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Start Time:',
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
        options: this.dataTest$,
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
      key: 'userGroup',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: 'group 1' },
          { id: 2, name: 'group 2' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'User Group:',
      },
    },
    {
      className: 'status',
      key: 'status',
      type: 'toggle',
      templateOptions: { textfieldLabelOutside: true },
      expressionProperties: {
        'templateOptions.label': of('Status:'),
        'templateOptions.description': of('Active'),
      },
    },
    {
      key: 'joinDate',
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
      key: 'dateBirth',
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
      key: 'gender',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: 'Male' },
          { id: 2, name: 'Female' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Gender:',
      },
    },
    {
      key: 'skype',
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
      key: 'marital',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: 'Single' },
          { id: 2, name: 'Married' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Marital Status:',
      },
    },
    {
      key: 'major',
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
      key: 'nationality',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: 'Vietnam' },
          { id: 2, name: 'Thailand' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Nationality:',
      },
    },
    {
      key: 'institute:',
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
      key: 'languague',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: 'Vietnam' },
          { id: 2, name: 'Thailand' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Languages:',
      },
    },
    {
      key: 'facebook',
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
      key: 'joblevel',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: 'Senior' },
          { id: 2, name: 'Junior' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Job Level:',
      },
    },
    {
      key: 'instagram',
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
      key: 'directreport',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: 'Senior' },
          { id: 2, name: 'Junior' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        placeholder: 'Direct Report:',
      },
    },
    {
      key: 'salary',
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
        this.titleId = item?.title?.id;
        this.contactId = item?.contact?.id;
        this.contactType = item?.contact?.contactType;
        this.address2 = item?.address?.address2;
        this.form.patchValue(item);
      });
    }
  }

  saveEmployee() {
    console.log(this.form.value.roles);
    const rolesData: any[] = [];
    this.form.value.roles.forEach(function (item: any) {
      rolesData.push({ id: item });
    });

    const UserElement = {
      title: {
        id: this.titleId,
      },
      id: '',
      state: 1,
      registerType: 'R',
      roles: rolesData,
      reportTo: {
        id: '9d07f921-81c3-4c2c-a838-e279dc04a80f',
      },
    };

    if (this.userId) {
      UserElement.id = this.userId;
      this.form.value.contact.id = this.contactId;
      this.form.value.contact.contactType = this.contactType;
      this.form.value.address.address2 = this.address2;
      this.form.value.profile.userId = this.userId;
    }

    delete this.form.value.roles;
    const formData = Object.assign(UserElement, this.form.value);

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
