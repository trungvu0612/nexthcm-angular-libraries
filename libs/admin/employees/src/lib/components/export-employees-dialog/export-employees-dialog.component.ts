import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type Schema = Record<string, Record<string, { label: string; value?: boolean }>>;

const getSchema = (scope: string): Schema => ({
  generalInformation: {
    cif: {
      label: 'cif',
      value: true,
    },
    firstName: {
      label: 'firstName',
      value: true,
    },
    lastName: {
      label: 'lastName',
    },
  },
  individual: {
    permanentAddress: {
      label: scope + '.permanentAddress',
    },
  },
});

@Component({
  selector: 'hcm-export-employees-dialog',
  templateUrl: './export-employees-dialog.component.html',
  styleUrls: ['./export-employees-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ExportEmployeesDialogComponent {
  readonly schema = getSchema(this.translocoScope.scope);
  readonly form!: FormGroup;
  readonly groupForm!: FormGroup;
  readonly submitLoading$ = new Subject<boolean>();

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    fb: FormBuilder,
    destroy$: TuiDestroyService
  ) {
    const formConfig: Record<string, FormGroup> = {};
    const groupFormConfig: Record<string, FormControl> = {};

    for (const groupKey in this.schema) {
      const group = this.schema[groupKey];
      const config: Record<string, FormControl> = {};
      let groupValue = true;

      for (const key in group) {
        const { value = false } = group[key];
        config[key] = fb.control({ value, disabled: value });
        groupValue = groupValue && value;
      }

      const controls = fb.group(config);
      const groupControl = fb.control({ value: groupValue, disabled: groupValue });

      controls.valueChanges.pipe(takeUntil(destroy$)).subscribe((value) => {
        const groupValue = Object.values(value).every((v) => v);
        if (groupValue !== groupControl.value) groupControl.setValue(groupValue, { emitEvent: false });
      });
      groupControl.valueChanges.pipe(takeUntil(destroy$)).subscribe((value) => {
        for (const key in group) {
          const control = controls.get(key);
          if (control && control.enabled) control.setValue(value, { emitEvent: false });
        }
      });

      formConfig[groupKey] = controls;
      groupFormConfig[groupKey] = groupControl;
    }

    this.form = fb.group(formConfig);
    this.groupForm = fb.group(groupFormConfig);
  }

  onSubmit(): void {
    const formValue = this.form.getRawValue();
    const body: Record<string, true> = {};

    for (const groupKey in formValue) {
      const groupValue = formValue[groupKey];

      for (const key in groupValue) {
        if (groupValue[key]) body[key] = true;
      }
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
