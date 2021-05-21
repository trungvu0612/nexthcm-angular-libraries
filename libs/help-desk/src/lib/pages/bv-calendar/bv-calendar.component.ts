import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CreateCalendarComponent } from '../../components/create-calendar/create-calendar.component'; // useful for typechecking

@Component({
  selector: 'hcm-bv-calendar',
  templateUrl: './bv-calendar.component.html',
  styleUrls: ['./bv-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BvCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    // dateClick: this.handleDateClick.bind(this), // bind is important!
    events: [
      { title: '[SD: Meeting BV]', date: '2021-05-19' },
      { title: 'Training BV', date: '2021-05-20' },
    ],
  };

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  createCalendar(): void {
    this.dialogService
      .open(new PolymorpheusComponent(CreateCalendarComponent, this.injector), {
        size: 'l',
        closeable: false,
      })
      .subscribe((map) => {
        this.changeDetector.detectChanges();
      });
  }
}
