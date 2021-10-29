import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferLeaveEntitlementsRequestListComponent } from './transfer-leave-entitlements-request-list.component';

describe('TransferLeaveEntitlementsRequestListComponent', () => {
  let component: TransferLeaveEntitlementsRequestListComponent;
  let fixture: ComponentFixture<TransferLeaveEntitlementsRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransferLeaveEntitlementsRequestListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferLeaveEntitlementsRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
