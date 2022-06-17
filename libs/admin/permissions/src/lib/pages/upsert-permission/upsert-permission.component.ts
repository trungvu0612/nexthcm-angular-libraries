import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import rfdc from 'rfdc';
import { combineLatest, map, of, startWith, Subject, switchMap } from 'rxjs';
import { catchError, mapTo, shareReplay, tap } from 'rxjs/operators';

import { Item, Policy, PolicyItem } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

interface PolicyItemForm extends Omit<PolicyItem, 'permissions'> {
  permissions: Record<string, Record<string, boolean>>;
}

interface PolicyForm extends Omit<Policy, 'policyItems'> {
  policyItems: PolicyItemForm[];
}

@Component({
  selector: 'hcm-upsert-permission',
  templateUrl: './upsert-permission.component.html',
  styleUrls: ['./upsert-permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertPermissionComponent {
  data = { policyItems: [] as PolicyItem[] } as Policy;
  readonly permissionId = this.activatedRoute.snapshot.params['id'];
  readonly form = new FormGroup({});
  readonly services$ = combineLatest([
    this.adminPermissions.services$,
    this.form.valueChanges.pipe(startWith(this.form.value)),
  ]).pipe(
    map(([services, value]) => {
      return services.filter(({ id }) => {
        return !value.policyItems?.some(({ service }: PolicyItem) => id === service?.id);
      });
    }),
    shareReplay(1)
  );
  readonly options = { formState: { services$: this.services$ } };
  model = { policyItems: [{}] } as PolicyForm;
  readonly fields = [
    { key: 'id' },
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          type: 'input',
          key: 'name',
          templateOptions: {
            required: true,
            translate: true,
            label: 'name',
            labelClassName: 'font-semibold',
            placeholder: 'enterName',
            textfieldLabelOutside: true,
          },
        },
        {
          type: 'input',
          key: 'description',
          templateOptions: {
            translate: true,
            label: 'description',
            labelClassName: 'font-semibold',
            placeholder: 'enterDescription',
            textfieldLabelOutside: true,
          },
        },
      ],
    },
    {
      key: 'policyItems',
      type: 'services',
      fieldArray: {
        fieldGroup: [
          {
            key: 'service',
            type: 'select',
            className: 'tui-form__row block w-1/2',
            templateOptions: {
              required: true,
              label: 'Service',
              labelClassName: 'font-semibold',
              labelProp: 'name',
              placeholder: 'Select a service',
              matcherBy: 'id',
              options: this.services$,
            },
          },
          {
            key: 'permissions',
            type: 'permissions',
          },
        ],
      },
    },
  ];

  readonly loading$ = this.permissionId
    ? this.adminPermissions.getPermission(this.permissionId).pipe(
        map((policy) => {
          const policyItems = policy.policyItems.map((policy) => {
            const permissions = policy.permissions.reduce<Record<string, Record<string, boolean>>>(
              (acc, { action, resource }) => {
                // TODO spelling mistake
                if (action.code === 'APPRROVE') action.code = 'APPROVE';
                if (!acc[action.code]) acc[action.code] = {};
                acc[action.code][resource.code] = true;
                return acc;
              },
              {}
            );

            return { ...policy, permissions };
          });
          this.model = { ...policy, policyItems };
          this.data = policy;
        }),
        startWith(true)
      )
    : of(false);

  readonly submit$ = new Subject<Policy>();
  readonly submitLoading$ = this.submit$.pipe(
    switchMap((body) =>
      this.adminPermissions.upsertPermission(body).pipe(
        tap(
          this.promptService.handleResponse(
            this.translocoScope.scope + (body.id ? '.updatePermissionSuccessfully' : '.addPermissionSuccessfully'),
            () => body.id || this.onCancel()
          )
        ),
        catchError(() => of(false)),
        mapTo(false),
        startWith(true)
      )
    )
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
    private readonly adminPermissions: AdminPermissionsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  onCancel(): void {
    this.router.navigateByUrl('/admin/permissions');
  }

  onSubmit(): void {
    if (this.form.valid) {
      const data = rfdc()(this.data);
      const actions = this.adminPermissions.get('actions');
      const resource = this.adminPermissions.get('resources');

      let error = false;
      const policyItems: PolicyItem[] = [];

      for (const policyItem of this.model.policyItems) {
        const policy =
          data.policyItems.find(({ service: { id } }) => id === policyItem.service.id) ||
          ({ service: policyItem.service, permissions: [] } as unknown as PolicyItem);

        policy.permissions.forEach((permission) => {
          const { action, resource } = permission;
          // TODO spelling mistake
          if (action.code === 'APPRROVE') action.code = 'APPROVE';
          if (!policyItem.permissions[action.code][resource.code]) policy.permissionRemoves.push(permission);
        });

        actions.forEach((action) => {
          for (const resourceCode in policyItem.permissions[action.code]) {
            if (
              policyItem.permissions[action.code][resourceCode] &&
              !policy.permissions.find(({ resource: { code } }) => code === resourceCode)
            ) {
              policy.permissions.push({
                action,
                resource: resource[action.code].find(({ code }) => code === resourceCode) as Item,
              });
            }
          }
        });

        if (policy.permissions.length) policyItems.push(policy);
        else {
          this.promptService.open({
            icon: 'error',
            text: this.translocoService.translate(this.translocoScope.scope + '.pleaseSelectAtLeastOnePermission'),
          });
          error = true;
          break;
        }
      }

      if (!error) this.submit$.next({ ...this.form.value, policyItems });
    }
  }
}
