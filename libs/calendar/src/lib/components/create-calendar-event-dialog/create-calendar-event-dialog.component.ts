import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

import { CalendarService } from '../../calendar.service';

@Component({
  selector: 'hcm-create-calendar-event-dialog',
  templateUrl: './create-calendar-event-dialog.component.html',
  styleUrls: ['./create-calendar-event-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCalendarEventDialogComponent {
  readonly form = new FormGroup({
    filters: new FormControl([]),
  });
  model: any = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'col-span-full',
      key: 'calendarTime',
      type: 'input-date',
      templateOptions: {
        translate: true,
        label: 'calendarTime',
        required: true,
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'startTime',
      type: 'select',
      templateOptions: {
        translate: true,
        options: [
          { id: 1, name: '10:00' },
          { id: 2, name: '12:00' },
          { id: 3, name: '18:00' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        label: 'startTime',
        required: true,
      },
    },

    {
      key: 'duration',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: '10 min' },
          { id: 2, name: '120 min' },
          { id: 3, name: '30 min' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        label: 'duration',
        required: true,
        translate: true,
      },
    },
    {
      className: 'address-radio-wrapper flex col-span-full',
      key: 'typeBuilding',
      type: 'radio',
      templateOptions: {
        translate: true,
        label: 'chooseBuilding',
        options: this.calendarService.select('buildings'),
        size: 'm',
        customTemplate: true,
        labelProp: 'name',
        subLabelProp: 'address',
        orientation: 'horizontal',
      },
    },
    {
      className: 'address-radio-wrapper flex col-span-full',
      key: 'typeRoom',
      type: 'radio',
      templateOptions: {
        translate: true,
        label: 'selectRoom',
        options: this.calendarService.select('rooms'),
        size: 'm',
        customTemplate: true,
        labelProp: 'name',
        subLabelProp: 'address',
        orientation: 'horizontal',
      },
    },
    {
      className: 'col-span-full',
      key: 'eventTitle',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'eventTitle',
        required: true,
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'col-span-full',
      key: 'invitePeople',
      type: 'combo-box',
      templateOptions: {
        translate: true,
        label: 'invitePeople',
        serverRequest: () => this.calendarService.select('invitePeople'),
        imageProp: 'image',
        imagePath: '/',
        subLabelProp: 'position',
        showImage: true,
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'col-span-full',
      key: 'externalEmail',
      type: 'combo-box',
      templateOptions: {
        translate: true,
        label: 'externalEmail',
        serverRequest: () => this.calendarService.select('externalEmails'),
        showImage: true,
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'reminder',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'reminder',
        options: [
          { id: 1, name: '30 min before' },
          { id: 2, name: '40 min before' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        required: true,
        size: 'm',
      },
    },
    {
      key: 'repeat',
      type: 'repeat-event-calendar',
      templateOptions: {
        translate: true,
        label: 'repeat',
      },
    },
    {
      key: 'notes',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'notes',
      },
    },
    {
      key: 'attachFile',
      type: 'upload-file',
      templateOptions: {
        translate: true,
        label: 'attachFile',
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<any, any>,
    private calendarService: CalendarService
  ) {}

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.context.completeWith(this.form.value);
    }
  }
}
