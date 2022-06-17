import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FieldType } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { combineLatest, Subject, take } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

import { AdminPermissionsService } from '../../services/admin-permissions.service';

const compareResourceName = (a: string, b: string) => {
  const x = a.replace(/_/g, '');
  const y = b.replace(/_/g, '');
  if (x < y) return -1;
  if (x > y) return 1;
  return 0;
};

@Component({
  selector: 'hcm-formly-permissions',
  templateUrl: './formly-permissions.component.html',
  styleUrls: ['./formly-permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class FormlyPermissionsComponent extends FieldType implements OnInit {
  expanded = true;

  controls!: FormGroup;
  group!: FormGroup;
  readonly group$ = new Subject<FormGroup>();

  actions!: string[];
  resources!: Set<string>;

  readonly loading$ = combineLatest([this.adminPermissions.actions$, this.adminPermissions.resources$]).pipe(
    map(([actions, resources]) => {
      this.actions = actions.map(({ code }) => code);
      this.resources = new Set(
        (
          (
            this.actions.map((action) =>
              resources[action].map(({ code }) => code.replace(new RegExp(`${action}_|_${action}`), ''))
            ) as any
          ).flat() as string[]
        ).sort(compareResourceName)
      );

      const groupConfig: Record<string, FormGroup> = {};
      const controlsConfig: Record<string, FormControl> = {};

      this.actions.forEach((action) => {
        const resourceCodes = resources[action].map(({ code }) => code);
        const childConfig: Record<string, boolean> = {};

        resourceCodes.forEach((code) => (childConfig[code] = false));

        groupConfig[action] = this.fb.group(childConfig);
        controlsConfig[action] = this.fb.control(false);

        controlsConfig[action].valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
          resourceCodes.forEach((code) => groupConfig[action].get(code)?.setValue(value, { emitEvent: false }));
          this.formControl.setValue(this.group.value);
        });
        groupConfig[action].valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
          const allTrue = resourceCodes.every((code) => value[code]);
          controlsConfig[action].setValue(allTrue, { emitEvent: false });
        });
      });

      this.controls = this.fb.group(controlsConfig);
      this.group = this.fb.group(groupConfig);
      this.group$.next(this.group);
      this.group.valueChanges
        .pipe(startWith(this.group.value), takeUntil(this.destroy$))
        .subscribe((value) => this.formControl.setValue(value));

      return false;
    }),
    startWith(true)
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly adminPermissions: AdminPermissionsService,
    private readonly fb: FormBuilder,
    private readonly destroy$: TuiDestroyService
  ) {
    super();
  }

  ngOnInit(): void {
    combineLatest([this.formControl.valueChanges.pipe(filter((v) => v !== this.group?.value)), this.group$])
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(([permissions, group]) => {
        for (const action in permissions) {
          for (const resource in permissions[action]) {
            group?.get(action)?.get(resource)?.setValue(true);
          }
        }
      });
  }

  getControl({ action, resource, group }: { action: string; resource: string; group: FormGroup }): FormControl | null {
    const controls = (group.get(action) as FormGroup).controls;
    for (const key in controls) {
      if (key.includes(resource) && key.length - 1 === action.length + resource.length) {
        return controls[key] as FormControl;
      }
    }
    return null;
  }
}
