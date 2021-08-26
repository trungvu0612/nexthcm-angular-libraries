import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CreateCalendarEventDialogComponent } from './components/create-calendar-event-dialog/create-calendar-event-dialog.component';
import { WorkingTimesService } from '../../../admin/working-times/src/lib/services/working-times.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'hcm-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  readonly calendarOptions$: Observable<CalendarOptions> = this.workingTimesService.getHoliday().pipe(
    map((res) => ({
      initialView: 'dayGridMonth',
      events: res.data.items.map(({ name, holidayDate }) => ({ title: name, date: holidayDate, allDay: true })),
    }))
  );

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private workingTimesService: WorkingTimesService
  ) {}

  onCreateMeeting(): void {
    this.dialogService
      .open(new PolymorpheusComponent(CreateCalendarEventDialogComponent, this.injector), {
        size: 'l',
      })
      .subscribe();
  }
}
