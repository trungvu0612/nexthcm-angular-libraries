import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitWorkingOutsideRequestDialogComponent } from './submit-working-outside-request-dialog.component';

describe('SubmitWorkingOutsideRequestDialogComponent', () => {
  let component: SubmitWorkingOutsideRequestDialogComponent;
  let fixture: ComponentFixture<SubmitWorkingOutsideRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitWorkingOutsideRequestDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitWorkingOutsideRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
