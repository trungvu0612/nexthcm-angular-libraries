import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AdminUserRolesService, Policy } from '@nexthcm/admin-user-roles';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdminUserRole } from '../../models/admin-user-role';

@Component({
  selector: 'hcm-upsert-user-roles',
  templateUrl: './upsert-user-roles.component.html',
  styleUrls: ['./upsert-user-roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertUserRolesComponent implements OnInit {
  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 100 });
  permissions$: Observable<Policy[]> = this.adminUserRolesService
    .getPermissions(this.params$.value)
    .pipe(map((data) => data.items));

  //After view init
  readonly arrayTemp: never[] = [];
  readonly count = 0;
  private removeArray = [];

  readonly adminUserRoleForm = new FormGroup({});
  model: Partial<AdminUserRole> = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
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
    },
    {
      className: 'my-8',
      key: 'policies',
      type: 'select-permissions',
      templateOptions: {
        options: this.permissions$,
        required: true,
        label: 'Permissions',
        labelProp: 'name',
        valueProp: 'id',
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, AdminUserRole>,
    private adminUserRolesService: AdminUserRolesService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = { ...this.model, ...this.context.data };
    }
  }

  /*Todo: fix never type*/
  ngAfterViewInit() {
    if (this.context.data) {
      const policiesControl = this.adminUserRoleForm.controls.policies;
      if (policiesControl) {
        policiesControl.valueChanges.subscribe((data) => {
          const difference = data
            .filter((x: never) => !this.arrayTemp.includes(x))
            .concat(this.arrayTemp.filter((x) => !data.includes(x)));

          const intersection = data.filter((x: never) => this.arrayTemp.includes(x));

          const differenceIn = data.filter((x: never) => !this.arrayTemp.includes(x));

          if (intersection.concat(differenceIn).length < this.arrayTemp.length) {
            this.removeArray = difference.filter((x: never) => this.arrayTemp.includes(x));
          }
        });
      }
    }
  }

  onSubmit() {
    if (this.adminUserRoleForm.valid) {
      if (this.context.data) {
        const body = {
          id: this.context.data,
          ...this.model,
          policyRemoves: this.removeArray,
        };
        this.context.completeWith(body);
      } else {
        this.context.completeWith(this.model);
      }
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
