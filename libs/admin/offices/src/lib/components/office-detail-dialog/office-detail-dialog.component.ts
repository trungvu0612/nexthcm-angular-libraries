import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Zone } from '@nexthcm/core';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'hcm-office-detail',
  templateUrl: './office-detail-dialog.component.html',
  styleUrls: ['./office-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeDetailDialogComponent {
  title = this.context.data ? 'editOffice' : 'addOffice';
  form = new FormGroup({});
  model: Partial<Zone> = this.context.data || {};
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        label: 'officeName',
        translate: true,
        required: true,
        textfieldLabelOutside: true,
      },
      validation: {
        messages: {
          required: () => this.translocoService.selectTranslate('VALIDATION.required'),
        },
      },
    },
    {
      key: 'description',
      type: 'text-area',
      templateOptions: {
        label: 'description',
        translate: true,
        textfieldLabelOutside: true,
        expandable: true,
        rows: 15,
      },
    },
    {
      key: 'address',
      type: 'text-area',
      templateOptions: {
        label: 'address',
        translate: true,
        textfieldLabelOutside: true,
        expandable: true,
        rows: 15,
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private context: TuiDialogContext<Partial<Zone> | null, Partial<Zone> | null>,
    private translocoService: TranslocoService
  ) {}

  save(): void {
    const { status = 0, longitude = 0, latitude = 0 } = this.model;
    this.context.completeWith(Object.assign(this.model, { status, longitude, latitude }));
  }

  cancel(): void {
    this.context.completeWith(null);
  }
}
