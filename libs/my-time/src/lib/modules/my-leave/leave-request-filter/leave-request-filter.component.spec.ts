import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveRequestFilterComponent } from './leave-request-filter.component';

describe('LeaveRequestFilterComponent', () => {
  let component: LeaveRequestFilterComponent;
  let fixture: ComponentFixture<LeaveRequestFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveRequestFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveRequestFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
