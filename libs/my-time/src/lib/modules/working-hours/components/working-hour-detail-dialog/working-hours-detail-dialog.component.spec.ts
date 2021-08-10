import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHoursDetailDialogComponent } from './working-hours-detail-dialog.component';

describe('WorkingHourDetailComponent', () => {
  let component: WorkingHoursDetailDialogComponent;
  let fixture: ComponentFixture<WorkingHoursDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingHoursDetailDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHoursDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
