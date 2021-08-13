import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitOvertimeRequestDialogComponent } from './submit-overtime-request-dialog.component';

describe('SubmitOvertimeRequestDialogComponent', () => {
  let component: SubmitOvertimeRequestDialogComponent;
  let fixture: ComponentFixture<SubmitOvertimeRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitOvertimeRequestDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitOvertimeRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
