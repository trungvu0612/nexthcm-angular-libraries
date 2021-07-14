import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTimeSettingsComponent } from './working-time-settings.component';

describe('WorkingTimeSettingsComponent', () => {
  let component: WorkingTimeSettingsComponent;
  let fixture: ComponentFixture<WorkingTimeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkingTimeSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingTimeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
