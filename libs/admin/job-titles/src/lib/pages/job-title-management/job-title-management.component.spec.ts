import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitleManagementComponent } from './job-title-management.component';

describe('ListJobTitleComponent', () => {
  let component: JobTitleManagementComponent;
  let fixture: ComponentFixture<JobTitleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobTitleManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTitleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
