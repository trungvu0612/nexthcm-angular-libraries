import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'hcm-create-calendar',
  templateUrl: './create-calendar.component.html',
  styleUrls: ['./create-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCalendarComponent implements OnInit {
  startTime = new FormControl();
  duration = new FormControl();
  typeBuilding = new FormControl();
  typeRoom = new FormControl();
  eventTitle = new FormControl();
  peopleInvite = new FormControl();
  externamEmail = new FormControl();
  noteCalendar = new FormControl();
  attachFile = new FormControl();

  TimeItems = ['09:00', '09:30', '10:00', '18:00', '17:00'];
  DurationItems = ['30 min', '60 min', '90 min', '120 min'];
  reminderItems = ['30 min before', '10 min before'];
  repeatItems = ['Never', 'Repeat'];

  constructor() {}

  ngOnInit(): void {}

  submit(): void {}
}
