import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitlesCICOExceptionComponent } from './job-titles-cico-exception.component';

describe('JobTitlesCICOExceptionComponent', () => {
  let component: JobTitlesCICOExceptionComponent;
  let fixture: ComponentFixture<JobTitlesCICOExceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobTitlesCICOExceptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTitlesCICOExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
