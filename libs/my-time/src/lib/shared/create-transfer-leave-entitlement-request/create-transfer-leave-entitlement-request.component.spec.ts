import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransferLeaveEntitlementRequestComponent } from './create-transfer-leave-entitlement-request.component';

describe('CreateConvertLeaveEntitlementRequestComponent', () => {
  let component: CreateTransferLeaveEntitlementRequestComponent;
  let fixture: ComponentFixture<CreateTransferLeaveEntitlementRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateTransferLeaveEntitlementRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTransferLeaveEntitlementRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
