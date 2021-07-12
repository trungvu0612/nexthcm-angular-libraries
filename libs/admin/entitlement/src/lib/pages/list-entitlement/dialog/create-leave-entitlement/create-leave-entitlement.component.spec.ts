import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeaveEntitlementComponent } from './create-leave-entitlement.component';

describe('CreateLeaveEntitlementComponent', () => {
  let component: CreateLeaveEntitlementComponent;
  let fixture: ComponentFixture<CreateLeaveEntitlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLeaveEntitlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLeaveEntitlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
