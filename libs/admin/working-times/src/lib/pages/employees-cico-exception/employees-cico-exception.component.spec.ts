import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesCICOExceptionComponent } from './employees-cico-exception.component';

describe('EmployeesCICOExceptionComponent', () => {
  let component: EmployeesCICOExceptionComponent;
  let fixture: ComponentFixture<EmployeesCICOExceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeesCICOExceptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesCICOExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
