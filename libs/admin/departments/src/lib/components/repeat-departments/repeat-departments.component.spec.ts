import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatDepartmentsComponent } from './repeat-departments.component';

describe('RepeatDepartmentsComponent', () => {
  let component: RepeatDepartmentsComponent;
  let fixture: ComponentFixture<RepeatDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepeatDepartmentsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepeatDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
