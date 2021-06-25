import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveManagementDetailDialogComponent } from './leave-management-detail-dialog.component';

describe('LeaveManagementDetailDialogComponent', () => {
  let component: LeaveManagementDetailDialogComponent;
  let fixture: ComponentFixture<LeaveManagementDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveManagementDetailDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveManagementDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
