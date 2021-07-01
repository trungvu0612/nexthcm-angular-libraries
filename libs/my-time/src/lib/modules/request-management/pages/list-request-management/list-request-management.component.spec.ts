import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRequestManagementComponent } from './list-request-management.component';

describe('ListRequestManagementComponent', () => {
  let component: ListRequestManagementComponent;
  let fixture: ComponentFixture<ListRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListRequestManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
