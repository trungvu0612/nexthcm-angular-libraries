import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNodeComponent } from './employee-node.component';

describe('EmployeeNodeComponent', () => {
  let component: EmployeeNodeComponent;
  let fixture: ComponentFixture<EmployeeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeNodeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
