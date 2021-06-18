import { AfterViewInit, ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Zone } from '@nexthcm/ui';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'hcm-office-detail',
  templateUrl: './office-detail-dialog.component.html',
  styleUrls: ['./office-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficeDetailDialogComponent implements AfterViewInit {
  title!: string;
  form = new FormGroup({});
  model!: Zone;
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

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<Zone | undefined, Zone | undefined>) {}

  ngAfterViewInit(): void {
    if (this.context.data) {
      this.form.patchValue(this.context.data);
      this.title = 'editOffice';
    } else this.title = 'addOffice';
  }

  cancel(): void {
    this.context.completeWith(undefined);
  }

  save(): void {
    this.context.completeWith(this.model);
  }
}
