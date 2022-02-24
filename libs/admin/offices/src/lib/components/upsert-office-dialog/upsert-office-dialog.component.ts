import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Office, PromptService } from '@nexthcm/cdk';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import omit from 'just-omit';
import { LatLngExpression } from 'leaflet';
import { takeUntil } from 'rxjs/operators';

import { AdminOfficesService } from '../../services/admin-offices.service';

interface OfficeForm extends Office {
  coordinates?: LatLngExpression;
}

@Component({
  selector: 'hcm-upsert-office-dialog',
  templateUrl: './upsert-office-dialog.component.html',
  styleUrls: ['./upsert-office-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertOfficeDialogComponent implements OnInit {
  model = {} as OfficeForm;
  form = this.fb.group(this.model);
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        required: true,
        textfieldLabelOutside: true,
        label: 'name',
        labelClassName: 'font-semibold',
        placeholder: 'enterName',
      },
    },
    {
      key: 'address',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        translate: true,
        textfieldLabelOutside: true,
        label: 'address',
        labelClassName: 'font-semibold',
        required: true,
        readonly: true,
      },
    },
    {
      key: 'coordinates',
      className: 'tui-form__row block',
      type: 'leaflet-coordinates',
      templateOptions: {
        onReverseLocation: (address: string, latitude: number, longitude: number) => {
          this.model = { ...this.model, address, latitude, longitude };
          this.changeDetector.detectChanges();
        },
      },
    },
    {
      key: 'onsite',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        labelClassName: 'font-semibold',
        label: 'Onsite',
      },
    },
    {
      key: 'description',
      className: 'tui-form__row block',
      type: 'text-area',
      templateOptions: {
        translate: true,
        textfieldLabelOutside: true,
        label: 'description',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
      },
    },
    { key: 'longitude', defaultValue: 0 },
    { key: 'latitude', defaultValue: 0 },
    { key: 'id' },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, Office>,
    private readonly fb: FormBuilder,
    private readonly adminOfficesService: AdminOfficesService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = {
        ...this.model,
        ...this.context.data,
        coordinates: [this.context.data.latitude, this.context.data.longitude],
      };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel: OfficeForm = { ...this.form.value };

      this.adminOfficesService
        .upsertOffice(omit(formModel, 'coordinates'))
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse(
            formModel.id ? 'offices.editOfficeSuccessfully' : 'offices.createOfficeSuccessfully',
            () => this.context.completeWith(true)
          )
        );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
