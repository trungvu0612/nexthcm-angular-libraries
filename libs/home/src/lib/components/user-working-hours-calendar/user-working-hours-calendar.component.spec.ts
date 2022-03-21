import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWorkingHoursCalendarComponent } from './user-working-hours-calendar.component';

describe('UserLeaveCalendarComponent', () => {
  let component: UserWorkingHoursCalendarComponent;
  let fixture: ComponentFixture<UserWorkingHoursCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserWorkingHoursCalendarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWorkingHoursCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
