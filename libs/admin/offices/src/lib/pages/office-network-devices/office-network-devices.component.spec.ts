import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeNetworkDevicesComponent } from './office-network-devices.component';

describe('OfficeNetworkDevicesComponent', () => {
  let component: OfficeNetworkDevicesComponent;
  let fixture: ComponentFixture<OfficeNetworkDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficeNetworkDevicesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeNetworkDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
