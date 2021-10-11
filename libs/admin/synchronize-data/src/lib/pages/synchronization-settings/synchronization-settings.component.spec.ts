import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchronizationSettingsComponent } from './synchronization-settings.component';

describe('SynchronizationSettingsComponent', () => {
  let component: SynchronizationSettingsComponent;
  let fixture: ComponentFixture<SynchronizationSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SynchronizationSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynchronizationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
