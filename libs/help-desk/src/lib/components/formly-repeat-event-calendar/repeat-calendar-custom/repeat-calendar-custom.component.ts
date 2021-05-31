import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiBooleanHandler } from '@taiga-ui/cdk';

@Component({
  selector: 'hcm-repeat-calendar-custom',
  templateUrl: './repeat-calendar-custom.component.html',
  styleUrls: ['./repeat-calendar-custom.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RepeatCalendarCustomComponent implements OnInit {
  weekType = new FormControl();
  weekNumber = new FormControl();
  weekNumberItems = ['1', '3'];
  weekTypeItems = ['week', 'month'];

  readonly form = new FormGroup({
    filters: new FormControl([]),
  });

  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'repeatCalendar',
      key: 'endRepeat',
      type: 'radio',
      templateOptions: {
        options: [
          { id: 1, name: 'Never' },
          { id: 2, name: 'On' },
          { id: 3, name: 'After' },
        ],
        labelProp: 'name',
        valueProp: 'id',
        orientation: 'verticle',
        className: 'address-radio-wrapper flex col-span-full',
      },
    },
  ];

  readonly items = ['M', 'TU', 'W', 'TH', 'F', 'S'];

  constructor() {}

  ngOnInit(): void {}

  disabledItemHandler: TuiBooleanHandler<string> = (item) => item.length < 0;

  test(event: any): void {
    this.form.controls.filters.setValue([]);
  }

}
