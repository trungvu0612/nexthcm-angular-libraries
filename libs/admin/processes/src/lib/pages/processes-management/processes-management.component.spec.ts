import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessesManagementComponent } from './processes-management.component';

describe('ProcessesManagementComponent', () => {
  let component: ProcessesManagementComponent;
  let fixture: ComponentFixture<ProcessesManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProcessesManagementComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
