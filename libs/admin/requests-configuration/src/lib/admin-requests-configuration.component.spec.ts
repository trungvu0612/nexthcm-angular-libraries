import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRequestsConfigurationComponent } from './admin-requests-configuration.component';

describe('AdminRequestsConfigurationComponent', () => {
  let component: AdminRequestsConfigurationComponent;
  let fixture: ComponentFixture<AdminRequestsConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminRequestsConfigurationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRequestsConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
