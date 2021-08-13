import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitWorkFromHomeRequestDialogComponent } from './submit-work-from-home-request-dialog.component';

describe('SubmitWorkFromHomeRequestDialogComponent', () => {
  let component: SubmitWorkFromHomeRequestDialogComponent;
  let fixture: ComponentFixture<SubmitWorkFromHomeRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubmitWorkFromHomeRequestDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitWorkFromHomeRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
