import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyUpdateTimesheetRequestsComponent } from './my-update-timesheet-requests.component';

describe('MyUpdateTimesheetRequestsComponent', () => {
  let component: MyUpdateTimesheetRequestsComponent;
  let fixture: ComponentFixture<MyUpdateTimesheetRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyUpdateTimesheetRequestsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyUpdateTimesheetRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
