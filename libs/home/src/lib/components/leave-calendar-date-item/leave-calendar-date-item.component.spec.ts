import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCalendarDateItemComponent } from './leave-calendar-date-item.component';

describe('CalendarLeaveItemComponent', () => {
  let component: LeaveCalendarDateItemComponent;
  let fixture: ComponentFixture<LeaveCalendarDateItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveCalendarDateItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveCalendarDateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
