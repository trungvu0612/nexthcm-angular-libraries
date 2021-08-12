import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHoursFilterComponent } from './working-hours-filter.component';

describe('WorkingHoursFilterComponent', () => {
  let component: WorkingHoursFilterComponent;
  let fixture: ComponentFixture<WorkingHoursFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingHoursFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
