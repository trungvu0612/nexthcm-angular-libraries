import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarRepeatDialogComponent } from './calendar-repeat-dialog.component';

describe('RepeatCalendarCustomComponent', () => {
  let component: CalendarRepeatDialogComponent;
  let fixture: ComponentFixture<CalendarRepeatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarRepeatDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarRepeatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
