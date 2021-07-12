import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertDepartmentComponent } from './upsert-department.component';

describe('UpsertDepartmentComponent', () => {
  let component: UpsertDepartmentComponent;
  let fixture: ComponentFixture<UpsertDepartmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertDepartmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
