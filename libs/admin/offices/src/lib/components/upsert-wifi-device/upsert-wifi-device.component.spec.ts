import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertWifiDeviceComponent } from './upsert-wifi-device.component';

describe('UpsertNetworkDeviceComponent', () => {
  let component: UpsertWifiDeviceComponent;
  let fixture: ComponentFixture<UpsertWifiDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertWifiDeviceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertWifiDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
