import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHoursCalendarItemComponent } from './working-hours-calendar-item.component';

describe('WorkingHoursCalendarItemComponent', () => {
  let component: WorkingHoursCalendarItemComponent;
  let fixture: ComponentFixture<WorkingHoursCalendarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingHoursCalendarItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursCalendarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
