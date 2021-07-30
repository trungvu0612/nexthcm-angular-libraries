import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CreateCalendarEventDialogComponent } from './components/create-calendar-event-dialog/create-calendar-event-dialog.component';

@Component({
  selector: 'hcm-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    events: [
      { title: '[SD] Meeting BV', date: '2021-05-19' },
      { title: 'Training BV', date: '2021-05-20' },
    ],
  };

  constructor(private dialogService: TuiDialogService, private injector: Injector) {}

  onCreateMeeting(): void {
    this.dialogService
      .open(new PolymorpheusComponent(CreateCalendarEventDialogComponent, this.injector), {
        size: 'l',
        closeable: false,
      })
      .subscribe();
  }
}
