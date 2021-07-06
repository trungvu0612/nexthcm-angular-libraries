import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertEmployeeComponent } from './upsert-employee.component';

describe('UpsertEmployeeComponent', () => {
  let component: UpsertEmployeeComponent;
  let fixture: ComponentFixture<UpsertEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsertEmployeeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
