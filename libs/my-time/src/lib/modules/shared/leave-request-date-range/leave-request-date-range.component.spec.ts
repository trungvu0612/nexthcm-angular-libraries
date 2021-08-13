import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestDateRangeComponent } from './leave-request-date-range.component';

describe('AbstractColDayRangeComponent', () => {
  let component: LeaveRequestDateRangeComponent;
  let fixture: ComponentFixture<LeaveRequestDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveRequestDateRangeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRequestDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
