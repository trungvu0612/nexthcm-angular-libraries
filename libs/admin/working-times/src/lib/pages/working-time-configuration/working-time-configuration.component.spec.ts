import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingTimeConfigurationComponent } from './working-time-configuration.component';

describe('WorkingTimeConfigurationComponent', () => {
  let component: WorkingTimeConfigurationComponent;
  let fixture: ComponentFixture<WorkingTimeConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingTimeConfigurationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingTimeConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
