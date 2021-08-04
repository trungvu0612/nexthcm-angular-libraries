import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkingAfterHoursRequestListComponent } from './working-after-hours-request-list.component';

describe('WorkingAfterHoursRequestListComponent', () => {
  let component: WorkingAfterHoursRequestListComponent;
  let fixture: ComponentFixture<WorkingAfterHoursRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkingAfterHoursRequestListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkingAfterHoursRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
