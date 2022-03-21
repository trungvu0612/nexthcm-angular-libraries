import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveEntitlementFiltersComponent } from './leave-entitlement-filters.component';

describe('LeaveEntitlementFiltersComponent', () => {
  let component: LeaveEntitlementFiltersComponent;
  let fixture: ComponentFixture<LeaveEntitlementFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LeaveEntitlementFiltersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveEntitlementFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
