import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiBooleanHandler } from '@taiga-ui/cdk';
import { HelpDeskService } from '../../services/help-desk.service';

@Component({
  selector: 'hcm-create-calendar',
  templateUrl: './create-calendar.component.html',
  styleUrls: ['./create-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCalendarComponent implements OnInit {
  readonly form = new FormGroup({
    filters: new FormControl([]),
  });

  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'col-span-full',
      key: 'calendarTime',
      type: 'input-date',
      templateOptions: {
        label: 'Calendar Time',
        required: true,
      },
    },
    {
      key: 'startTime',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: '10:00' },
          { id: 2, name: '12:00' },
          { id: 3, name: '18:00' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        label: 'Start Time',
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
        label: 'Duration',
        required: true,
      },
    },
    {
      className: 'address-radio-wrapper flex col-span-full',
      key: 'typeBuilding',
      type: 'radio',
      templateOptions: {
        label: 'Choose Building',
        options: this.helpDeskService.get(),
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
        label: 'Select Room',
        options: this.helpDeskService.getRoom(),
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
        label: 'Enter Event Title',
        required: true,
      },
    },
    {
      className: 'col-span-full',
      key: 'peopleInvite',
      type: 'combo-box',
      templateOptions: {
        label: 'People To Invite',
        placeholder: 'Company contact or Team',
        serverRequest: this.helpDeskService.getPeople,
        imageProp: 'image',
        imagePath: '/',
        sublabelProp: 'position',
      },
    },
    {
      className: 'col-span-full',
      key: 'externalEmail',
      type: 'combo-box',
      templateOptions: {
        label: 'External Email',
        placeholder: 'Or External email',
        serverRequest: this.helpDeskService.getEmail,
      },
    },
    {
      key: 'reminder',
      type: 'select',
      templateOptions: {
        options: [
          { id: 1, name: '30 min before' },
          { id: 2, name: '40 min before' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        label: 'Reminder',
        required: true,
        size: 'm',
      },
    },
    {
      key: 'repeat',
      type: 'repeat-event-calendar',
      templateOptions: {
        label: 'Repeat',
      },
    },
    {
      key: 'note',
      type: 'text-area',
      templateOptions: {
        label: 'Notes',
        textfieldSize: 'm',
        expandable: false,
        rows: 4,
      },
    },
    {
      key: 'attachFile',
      type: 'upload-file',
      templateOptions: {
        label: 'Attach file',
        textfieldSize: 'm',
      },
    },
  ];

  constructor(private helpDeskService: HelpDeskService) {}

  ngOnInit(): void {}

  submit(): void {}

  disabledItemHandler: TuiBooleanHandler<string> = (item) => item.length < 7;

  test(event: any): void {
    this.form.controls.filters.setValue([]);
  }
}
