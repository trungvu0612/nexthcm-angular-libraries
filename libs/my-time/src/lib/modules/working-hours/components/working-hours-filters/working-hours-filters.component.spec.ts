import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHoursFiltersComponent } from './working-hours-filters.component';

describe('WorkingHoursFilterComponent', () => {
  let component: WorkingHoursFiltersComponent;
  let fixture: ComponentFixture<WorkingHoursFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingHoursFiltersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
