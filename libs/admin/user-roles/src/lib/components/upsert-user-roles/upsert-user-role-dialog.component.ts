import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder, FormControl } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of, Subject } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap, take, tap } from 'rxjs/operators';
import { BasePermission } from '../../models/base-permission';
import { UserRole } from '../../models/user-role';
import { AdminUserRolesService } from '../../services/admin-user-roles.service';

interface ComponentState {
  loading: boolean;
}

@Component({
  selector: 'hcm-upsert-user-role-dialog',
  templateUrl: './upsert-user-role-dialog.component.html',
  styleUrls: ['./upsert-user-role-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class UpsertUserRoleDialogComponent implements OnInit {
  dataTable = this.context.data;

  // arrayTemp: never[] = [];
  removingPermissions: BasePermission[] = [];

  form = this.fb.group<UserRole>({} as UserRole);
  model = {} as UserRole;
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
                    this.data?.name === name ? of(true) : this.adminUserRolesService.checkNameExisting({ name })
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
        translate: true,
        required: true,
        label: 'permission',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'searchPermissions',
        onRemovePermission: (item: BasePermission) => this.removingPermissions.push(item),
      },
    },
    { key: 'id' },
  ];
  // READS
  readonly loading$ = this.state.select('loading');

  // EVENTS
  readonly submit$ = new Subject<UserRole>();

  // HANDLERS
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.adminUserRolesService.upsertUserRole(payload).pipe(
        tap(
          this.promptService.handleResponse(
            payload.id ? 'userRoles.updateUserRoleSuccessfully' : 'userRoles.createUserRoleSuccessfully',
            () => this.context.completeWith(true)
          )
        ),
        catchError(() => of({})),
        startWith(null)
      )
    )
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, UserRole>,
    private readonly fb: FormBuilder,
    private readonly adminUserRolesService: AdminUserRolesService,
    private readonly translocoService: TranslocoService,
    private readonly state: RxState<ComponentState>,
    private readonly promptService: PromptService
  ) {
    this.state.connect('loading', this.submitHandler$.pipe(map((value) => !value)));
  }

  get data(): UserRole {
    return this.context.data;
  }

  ngOnInit(): void {
    if (this.data) {
      this.model = { ...this.model, ...this.data };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      formModel.policyRemoves = this.removingPermissions;
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
