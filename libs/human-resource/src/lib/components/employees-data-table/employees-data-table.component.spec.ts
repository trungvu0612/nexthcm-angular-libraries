import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesDataTableComponent } from './employees-data-table.component';

describe('EmployeesDataTableComponent', () => {
  let component: EmployeesDataTableComponent;
  let fixture: ComponentFixture<EmployeesDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeesDataTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
