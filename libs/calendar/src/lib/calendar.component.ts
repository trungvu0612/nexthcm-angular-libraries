import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDialogComponent } from './components/create-calendar-event-dialog/create-calendar-event-dialog.component';

@Component({
  selector: 'hcm-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  readonly calendarOptions$: Observable<CalendarOptions> = this.calendarService.select('holidays').pipe(
    map((holidays) => ({
      initialView: 'dayGridMonth',
      events: holidays.map(({ name, holidayDate }) => ({ title: name, date: holidayDate, allDay: true })),
    }))
  );

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private calendarService: CalendarService
  ) {}

  onCreateMeeting(): void {
    this.dialogService
      .open(new PolymorpheusComponent(CreateCalendarEventDialogComponent, this.injector), {
        size: 'l',
      })
      .subscribe();
  }
}
