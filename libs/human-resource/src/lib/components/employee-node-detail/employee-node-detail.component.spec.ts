import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNodeDetailComponent } from './employee-node-detail.component';

describe('EmployeeNodeDetailComponent', () => {
  let component: EmployeeNodeDetailComponent;
  let fixture: ComponentFixture<EmployeeNodeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeeNodeDetailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeNodeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
