import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveLevelApproveManagementComponent } from './leave-level-approve-management.component';

describe('LeaveLevelApproveManagementComponent', () => {
  let component: LeaveLevelApproveManagementComponent;
  let fixture: ComponentFixture<LeaveLevelApproveManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveLevelApproveManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveLevelApproveManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
