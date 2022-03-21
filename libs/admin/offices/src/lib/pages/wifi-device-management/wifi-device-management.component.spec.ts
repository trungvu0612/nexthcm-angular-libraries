import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WifiDeviceManagement } from './wifi-device-management.component';

describe('WifiDeviceManagement', () => {
  let component: WifiDeviceManagement;
  let fixture: ComponentFixture<WifiDeviceManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WifiDeviceManagement],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WifiDeviceManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
