import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidationService } from '@nexthcm/ui';
import { AdminPermissionsService } from '@nexthcm/admin-permissions';
import { AdminUserRolesService } from '../../services/admin-user-roles.service';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { AdminUserRole } from '../../models/admin-user-role';

@Component({
  selector: 'hcm-upsert-user-roles',
  templateUrl: './upsert-user-roles.component.html',
  styleUrls: ['./upsert-user-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertUserRolesComponent implements OnInit {
  columns = ['name','description', 'action'];
  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 100 });
  permissions$: Observable<any[]> = this.adminPermissionsService
    .getPermissions(this.params$.value)
    .pipe(map((data) => data.items));
  // timeValues$: Observable<any[]> = this.myLeaveService.getTimeValues().pipe(map((data) => data));

  data = this.context.data || '';
  readonly adminUserRoleForm = new FormGroup({});
  model: Partial<AdminUserRole> = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'my-8',
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        textfieldLabelOutside: true
      },
      ...this.validationService.getValidation(['required'])
    },
    {
      className: 'my-8',
      key: 'description',
      type: 'text-area',
      templateOptions: {
        required: true,
        translate: true,
        label: 'Description',
        textfieldLabelOutside: true
      },
      ...this.validationService.getValidation(['required'])
    },
    {
      className: 'my-8',
      key: 'policies',
      type: 'select-permissions',
      templateOptions: {
        options: this.permissions$,
        label: 'Permissions',
        labelProp: 'name',
        valueProp: 'id',
        textfieldLabelOutside: true
      },
      ...this.validationService.getValidation(['required'])
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, AdminUserRole>,
    private adminPermissionsService: AdminPermissionsService,
    private adminUserRolesService: AdminUserRolesService,
    private readonly validationService: ValidationService,
  ) {}

  ngOnInit(): void {
    console.log('iddddd data', this.data);
    if (this.data !== '') {
      this.adminUserRolesService.getAdminUserRolesId(this.data).subscribe((item) => {
        console.log(item.data)
        this.model = { ...this.model, ...item.data };
      });
    }
  }

  submit() {}

  cancel() {}

}

