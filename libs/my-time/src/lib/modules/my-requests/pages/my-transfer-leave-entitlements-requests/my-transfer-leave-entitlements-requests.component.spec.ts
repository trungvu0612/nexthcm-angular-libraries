import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTransferLeaveEntitlementsRequestsComponent } from './my-transfer-leave-entitlements-requests.component';

describe('MyTransferLeaveEntitlementsRequestsComponent', () => {
  let component: MyTransferLeaveEntitlementsRequestsComponent;
  let fixture: ComponentFixture<MyTransferLeaveEntitlementsRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyTransferLeaveEntitlementsRequestsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTransferLeaveEntitlementsRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
