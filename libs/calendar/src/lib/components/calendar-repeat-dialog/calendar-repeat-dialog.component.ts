import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiBooleanHandler } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'hcm-calendar-repeat-dialog',
  templateUrl: './calendar-repeat-dialog.component.html',
  styleUrls: ['./calendar-repeat-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarRepeatDialogComponent {
  weekType = new FormControl();
  weekNumber = new FormControl();
  weekNumberItems = ['1', '3'];
  weekTypeItems = ['week', 'month'];

  readonly form = new FormGroup({
    filters: new FormControl([]),
  });

  model: any = {};
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

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<any, any>) {}

  disabledItemHandler: TuiBooleanHandler<string> = (item) => item.length < 0;

  test(): void {
    this.form.controls.filters.setValue([]);
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.context.completeWith(this.form.value);
    }
  }
}
