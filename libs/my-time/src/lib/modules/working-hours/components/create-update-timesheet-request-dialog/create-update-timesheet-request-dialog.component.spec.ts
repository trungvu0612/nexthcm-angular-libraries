import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateTimesheetRequestDialogComponent } from './create-update-timesheet-request-dialog.component';

describe('SubmitUpdateTimesheetRequestDialogComponent', () => {
  let component: CreateUpdateTimesheetRequestDialogComponent;
  let fixture: ComponentFixture<CreateUpdateTimesheetRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateUpdateTimesheetRequestDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateUpdateTimesheetRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
