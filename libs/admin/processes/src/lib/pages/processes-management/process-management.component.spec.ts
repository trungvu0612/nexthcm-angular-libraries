import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessManagementComponent } from './process-management.component';

describe('ProcessManagementComponent', () => {
  let component: ProcessManagementComponent;
  let fixture: ComponentFixture<ProcessManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcessManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
