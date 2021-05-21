import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking

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

  constructor() {}

  ngOnInit(): void {}
}
