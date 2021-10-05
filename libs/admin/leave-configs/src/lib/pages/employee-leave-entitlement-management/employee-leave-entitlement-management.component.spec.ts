import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveEntitlementManagementComponent } from './employee-leave-entitlement-management.component';

describe('EmployeeLeaveEntitlementManagementComponent', () => {
  let component: EmployeeLeaveEntitlementManagementComponent;
  let fixture: ComponentFixture<EmployeeLeaveEntitlementManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeLeaveEntitlementManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLeaveEntitlementManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
