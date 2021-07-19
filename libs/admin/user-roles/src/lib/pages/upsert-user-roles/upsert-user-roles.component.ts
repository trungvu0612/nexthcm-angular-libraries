import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AdminPermissionsService } from '@nexthcm/admin-permissions';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminUserRole } from '../../models/admin-user-role';
import { AdminUserRolesService } from '../../services/admin-user-roles.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'hcm-upsert-user-roles',
  templateUrl: './upsert-user-roles.component.html',
  styleUrls: ['./upsert-user-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertUserRolesComponent implements OnInit {
  columns = ['name', 'description', 'action'];
  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 100 });
  permissions$: Observable<any[]> = this.adminPermissionsService
    .getPermissions(this.params$.value)
    .pipe(map((data) => data.items));

  data = this.context.data || '';

  //Affter view init
  arrayTemp: any[] = [];
  count = 0;
  removeArray = [];

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
        textfieldLabelOutside: true,
      },
      validation: { messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') } },
    },
    {
      className: 'my-8',
      key: 'description',
      type: 'text-area',
      templateOptions: {
        required: true,
        translate: true,
        label: 'Description',
        textfieldLabelOutside: true,
      },
      validation: { messages: { required: () => this.translocoService.selectTranslate('VALIDATION.required') } },
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
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, AdminUserRole>,
    private adminPermissionsService: AdminPermissionsService,
    private adminUserRolesService: AdminUserRolesService,
    private readonly translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    console.log('iddddd data', this.data);

    if (this.data !== '') {
      this.adminUserRolesService.getAdminUserRolesId(this.data).subscribe((item) => {
        console.log('aaaaaaaaaaa', item.data.policies);
        this.model = { ...this.model, ...item.data };

        this.arrayTemp = item.data.policies;
        this.count = item.data.policies.length;
      });
    }
  }

  ngAfterViewInit() {
    // const policiesControl = this.adminUserRoleForm.get('policies');

    if (this.data !== '') {
      const policiesControl = this.adminUserRoleForm.controls.policies;

      if (policiesControl) {
        policiesControl.valueChanges.subscribe((data) => {
          console.log('---------------------------');
          console.log('init', this.arrayTemp);

          const difference = data
            .filter((x: any) => !this.arrayTemp.includes(x))
            .concat(this.arrayTemp.filter((x) => !data.includes(x)));
          console.log('difference', difference);

          const intersection = data.filter((x: any) => this.arrayTemp.includes(x));
          console.log('Intersection', intersection);

          const difference1 = data.filter((x: any) => !this.arrayTemp.includes(x));
          console.log('difference11111', difference1);

          if (intersection.concat(difference1).length < this.arrayTemp.length) {
            this.removeArray = difference.filter((x: any) => this.arrayTemp.includes(x));
            // result = result.filter((x: any) => this.arrayTemp.includes(x));
          }
          // this.model.policy = intersection.concat(difference1)
          console.log('remove[]', this.removeArray);
          console.log('result[]', intersection.concat(difference1));
          console.log('****************************');
        });
      }
    }
  }

  submit() {
    if (this.data !== '') {
      const body = {
        id: this.data,
        ...this.model,
        policyRemoves: this.removeArray,
      };
      this.context.completeWith(body);
      console.log('modelllll edit', body);
    } else {
      this.context.completeWith(this.model);
      console.log('modelllll post', this.model);
    }
  }

  cancel() {
    this.context.completeWith(false);
  }
}
