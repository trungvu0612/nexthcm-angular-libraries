import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { map } from 'rxjs';

import { LeaveEntitlementsExportType } from '../../enums';

@Component({
  selector: 'hcm-select-leave-entitlements-export-type-dialog',
  templateUrl: './select-leave-entitlements-export-type-dialog.component.html',
  styleUrls: ['./select-leave-entitlements-export-type-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectLeaveEntitlementsExportTypeDialogComponent {
  form = this.fb.group({});
  fields: FormlyFieldConfig[] = [
    {
      key: 'exportType',
      type: 'select',
      className: 'tui-form__row block',
      defaultValue: LeaveEntitlementsExportType.Detail,
      templateOptions: {
        translate: true,
        required: true,
        label: 'type',
        labelClassName: 'font-semibold',
        valueProp: 'value',
        options: this.translocoService.selectTranslateObject('EXPORT_TYPES').pipe(
          map((result) => [
            { label: result.detail, value: LeaveEntitlementsExportType.Detail },
            { label: result.cnb, value: LeaveEntitlementsExportType.CnB },
          ])
        ),
      },
    },
  ];

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly translocoService: TranslocoService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<LeaveEntitlementsExportType>
  ) {}

  onSubmit(): void {
    this.context.completeWith(this.form.value.exportType);
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
