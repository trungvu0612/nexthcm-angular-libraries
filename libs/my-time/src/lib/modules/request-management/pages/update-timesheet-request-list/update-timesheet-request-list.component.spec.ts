import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTimesheetRequestListComponent } from './update-timesheet-request-list.component';

describe('UpdateTimesheetRequestListComponent', () => {
  let component: UpdateTimesheetRequestListComponent;
  let fixture: ComponentFixture<UpdateTimesheetRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateTimesheetRequestListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateTimesheetRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
