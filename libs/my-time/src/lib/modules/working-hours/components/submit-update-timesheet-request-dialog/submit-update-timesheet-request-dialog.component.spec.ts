import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitUpdateTimesheetRequestDialogComponent } from './submit-update-timesheet-request-dialog.component';

describe('SubmitUpdateTimesheetRequestDialogComponent', () => {
  let component: SubmitUpdateTimesheetRequestDialogComponent;
  let fixture: ComponentFixture<SubmitUpdateTimesheetRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitUpdateTimesheetRequestDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitUpdateTimesheetRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
