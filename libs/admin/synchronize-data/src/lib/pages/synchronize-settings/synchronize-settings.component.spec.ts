import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchronizeSettingsComponent } from './synchronize-settings.component';

describe('SynchronizeSettingsComponent', () => {
  let component: SynchronizeSettingsComponent;
  let fixture: ComponentFixture<SynchronizeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SynchronizeSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynchronizeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
