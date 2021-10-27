import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateConvertLeaveEntitlementRequestComponent } from './create-convert-leave-entitlement-request.component';

describe('CreateConvertLeaveEntitlementRequestComponent', () => {
  let component: CreateConvertLeaveEntitlementRequestComponent;
  let fixture: ComponentFixture<CreateConvertLeaveEntitlementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateConvertLeaveEntitlementRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateConvertLeaveEntitlementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
