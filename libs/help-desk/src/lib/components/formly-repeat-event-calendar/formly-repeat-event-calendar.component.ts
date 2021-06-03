import { Component, OnInit, ChangeDetectionStrategy, ViewChild, Injector, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FieldType } from '@ngx-formly/core';
import { TuiDialogService, TuiHostedDropdownComponent } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CreateCalendarComponent } from '../create-calendar/create-calendar.component';
import { RepeatCalendarCustomComponent } from './repeat-calendar-custom/repeat-calendar-custom.component';

@Component({
  selector: 'hcm-formly-repeat-event-calendar',
  templateUrl: './formly-repeat-event-calendar.component.html',
  styleUrls: ['./formly-repeat-event-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyRepeatEventCalendarComponent implements OnInit {
  showDropdown = true;
  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private changeDetector: ChangeDetectorRef
  ) {}
  ngOnInit(): void {}

  open = false;
  childOpen = true;


  readonly items = [['Never', 'Daily', 'Weekly on Wednesday', 'Monthly on the second Wednesday', 'Annually on Sep 11']];

  primary = 'Never';

  onClick(item: string) {
    this.showDropdown = !this.showDropdown;
    if (this.items[0].indexOf(item) !== -1) {
      this.primary = item;
      return;
    }
  }

  repeatModal() {
    this.showDropdown = !this.showDropdown;
    this.dialogService
      .open(new PolymorpheusComponent(RepeatCalendarCustomComponent, this.injector), {
        size: 'm',
        closeable: false,
      })
      .subscribe((map) => {
        this.changeDetector.detectChanges();
      });
  }
}
