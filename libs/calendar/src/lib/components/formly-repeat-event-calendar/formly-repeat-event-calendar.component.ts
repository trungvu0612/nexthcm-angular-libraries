import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CalendarRepeatDialogComponent } from '../calendar-repeat-dialog/calendar-repeat-dialog.component';

@Component({
  selector: 'hcm-formly-repeat-event-calendar',
  templateUrl: './formly-repeat-event-calendar.component.html',
  styleUrls: ['./formly-repeat-event-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyRepeatEventCalendarComponent {
  showDropdown = true;
  open = false;
  childOpen = true;
  readonly items = [['Never', 'Daily', 'Weekly on Wednesday', 'Monthly on the second Wednesday', 'Annually on Sep 11']];
  primary = 'Never';

  constructor(private dialogService: TuiDialogService, private injector: Injector) {}

  onClick(item: string): void {
    this.showDropdown = !this.showDropdown;
    if (this.items[0].indexOf(item) !== -1) {
      this.primary = item;
      return;
    }
  }

  openCalendarRepeatDialog(): void {
    this.showDropdown = !this.showDropdown;
    this.dialogService
      .open(new PolymorpheusComponent(CalendarRepeatDialogComponent, this.injector), {
        size: 'm',
        closeable: false,
      })
      .subscribe();
  }
}
