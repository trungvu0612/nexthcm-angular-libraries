import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitWorkingOnsiteRequestDialogComponent } from './submit-working-onsite-request-dialog.component';

describe('SubmitWorkingOnsiteRequestDialogComponent', () => {
  let component: SubmitWorkingOnsiteRequestDialogComponent;
  let fixture: ComponentFixture<SubmitWorkingOnsiteRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitWorkingOnsiteRequestDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitWorkingOnsiteRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
