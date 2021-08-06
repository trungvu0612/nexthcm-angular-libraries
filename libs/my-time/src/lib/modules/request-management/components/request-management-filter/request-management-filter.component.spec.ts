import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestManagementFilterComponent } from './request-management-filter.component';

describe('RequestManagementFilterComponent', () => {
  let component: RequestManagementFilterComponent;
  let fixture: ComponentFixture<RequestManagementFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RequestManagementFilterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestManagementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
