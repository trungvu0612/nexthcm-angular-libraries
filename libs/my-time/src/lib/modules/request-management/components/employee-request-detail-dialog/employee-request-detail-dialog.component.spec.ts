import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeRequestDetailDialogComponent } from './employee-request-detail-dialog.component';

describe('EmployeeRequestDetailComponent', () => {
  let component: EmployeeRequestDetailDialogComponent;
  let fixture: ComponentFixture<EmployeeRequestDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeRequestDetailDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeRequestDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
