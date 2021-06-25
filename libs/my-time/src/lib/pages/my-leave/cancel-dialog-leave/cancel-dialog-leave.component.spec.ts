import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelDialogLeaveComponent } from './cancel-dialog-leave.component';

describe('CancelDialogLeaveComponent', () => {
  let component: CancelDialogLeaveComponent;
  let fixture: ComponentFixture<CancelDialogLeaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelDialogLeaveComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelDialogLeaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
