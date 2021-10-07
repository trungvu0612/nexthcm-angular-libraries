import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { debounceTime, map, switchMap, take, tap } from 'rxjs/operators';
import { Policy, UserRole } from '../../models/user-role';
import { AdminUserRolesService } from '../../services/admin-user-roles.service';

@Component({
  selector: 'hcm-upsert-user-role-dialog',
  templateUrl: './upsert-user-role-dialog.component.html',
  styleUrls: ['./upsert-user-role-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertUserRoleDialogComponent implements OnInit, AfterViewInit {
  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 100 });
  permissions$: Observable<Policy[]> = this.adminUserRolesService
    .getPermissions(this.params$.value)
    .pipe(map((data) => data.items));

  dataTable = this.context.data;

  arrayTemp: never[] = [];
  count = 0;
  removeArray = [];

  form = this.fb.group<UserRole>({} as UserRole);
  model = {} as UserRole;
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        labelClassName: 'font-semibold',
        placeholder: 'enterName',
        textfieldLabelOutside: true,
      },
      asyncValidators: {
        name: {
          expression: (control: FormControl<string>) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : control.valueChanges.pipe(
                  debounceTime(1000),
                  take(1),
                  switchMap((name) =>
                    this.data.name === name ? of(true) : this.adminUserRolesService.checkNameExisting({ name })
                  ),
                  tap(() => control.markAsTouched())
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.valueExisting'),
        },
      },
    },
    {
      className: 'tui-form__row block',
      key: 'description',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'description',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'policies',
      type: 'select-permissions',
      templateOptions: {
        options: this.permissions$,
        translate: true,
        required: true,
        label: 'permission',
        labelProp: 'name',
        valueProp: 'id',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
      },
    },
    { key: 'id' },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<UserRole, UserRole>,
    private readonly fb: FormBuilder,
    private readonly adminUserRolesService: AdminUserRolesService,
    private readonly translocoService: TranslocoService
  ) {}

  private _data = {} as UserRole;

  get data(): UserRole {
    return this._data;
  }

  ngOnInit(): void {
    if (this.dataTable) {
      this.adminUserRolesService.getAdminUserRolesId(this.dataTable).subscribe((item) => {
        this.model = { ...this.model, ...item.data };

        this.arrayTemp = item.data.policies;
        this.count = item.data.policies.length;
      });
    }
  }

  /*Todo: fix never type*/
  ngAfterViewInit() {
    if (this.context.data) {
      const policiesControl = this.form.controls.policies;
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
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      formModel.policyRemoves = this.removeArray;
      this.context.completeWith(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
