import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWorkingAfterHoursRequestDialogComponent } from './create-working-after-hours-request-dialog.component';

describe('SubmitOvertimeRequestDialogComponent', () => {
  let component: CreateWorkingAfterHoursRequestDialogComponent;
  let fixture: ComponentFixture<CreateWorkingAfterHoursRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateWorkingAfterHoursRequestDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWorkingAfterHoursRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
