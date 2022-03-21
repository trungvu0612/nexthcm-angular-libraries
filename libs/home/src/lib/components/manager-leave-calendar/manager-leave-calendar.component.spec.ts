import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerLeaveCalendarComponent } from './manager-leave-calendar.component';

describe('ManagerLeaveCalendarComponent', () => {
  let component: ManagerLeaveCalendarComponent;
  let fixture: ComponentFixture<ManagerLeaveCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagerLeaveCalendarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerLeaveCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
