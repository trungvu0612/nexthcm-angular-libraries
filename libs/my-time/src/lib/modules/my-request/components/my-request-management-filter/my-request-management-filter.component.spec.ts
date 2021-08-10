import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRequestManagementFilterComponent } from './my-request-management-filter.component';

describe('MyRequestManagementFilterComponent', () => {
  let component: MyRequestManagementFilterComponent;
  let fixture: ComponentFixture<MyRequestManagementFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyRequestManagementFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRequestManagementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
