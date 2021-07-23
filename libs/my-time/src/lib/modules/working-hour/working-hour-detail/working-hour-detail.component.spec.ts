import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingHourDetailComponent } from './working-hour-detail.component';

describe('WorkingHourDetailComponent', () => {
  let component: WorkingHourDetailComponent;
  let fixture: ComponentFixture<WorkingHourDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingHourDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingHourDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
